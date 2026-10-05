"""Conversion service: provider 디스패치 + 비동기 잡 실행 (FR-012~016).

Provider 선택 (CONVERSION_PROVIDER):
- "auto" (기본): MESHY_API_KEY 있으면 meshy, 없으면 mock
- "meshy" / "tripo" / "mock": 명시 지정
"""

import asyncio
import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.conversion import ConversionJob
from app.models.project import Project
from app.services import meshy as meshy_provider
from app.services.events import publish as publish_event

STAGES = ["queued", "depth_estimation", "mesh_generation", "texturing", "done"]
MESHY_STAGES = {"PENDING": 10, "IN_PROGRESS": 50, "SUCCEEDED": 100}


def resolve_provider() -> str:
    configured = (settings.CONVERSION_PROVIDER or "auto").lower()
    if configured != "auto":
        return configured
    return "meshy" if settings.MESHY_API_KEY else "mock"


async def create_job(
    db: AsyncSession,
    image_urls: list[str],
    owner_id: uuid.UUID | None,
    project_id: uuid.UUID | None,
    options: dict,
) -> ConversionJob:
    job = ConversionJob(
        owner_id=owner_id,
        project_id=project_id,
        status="queued",
        progress=0,
        stage="queued",
        source_urls=image_urls,
        provider=resolve_provider(),
        job_metadata=options,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    await publish_event({"type": "conversion.created", "job_id": str(job.id), "provider": job.provider})
    asyncio.create_task(_run_job(str(job.id)))
    return job


async def get_job(db: AsyncSession, job_id: str) -> ConversionJob | None:
    try:
        uid = uuid.UUID(str(job_id))
    except ValueError:
        return None
    result = await db.execute(select(ConversionJob).where(ConversionJob.id == uid))
    return result.scalar_one_or_none()


async def _run_job(job_id: str) -> None:
    from app.database import async_session

    async with async_session() as db:
        result = await db.execute(
            select(ConversionJob).where(ConversionJob.id == uuid.UUID(job_id))
        )
        job = result.scalar_one_or_none()
        if job is None:
            return
        try:
            if job.provider == "meshy":
                await _run_meshy(db, job)
            else:
                await _run_mock(db, job)
            await publish_event(
                {"type": "conversion.done", "job_id": job_id, "result_url": job.result_url}
            )
        except NotImplementedError as exc:
            job.status = "failed"
            job.error = str(exc)
            await db.commit()
            await publish_event({"type": "conversion.failed", "job_id": job_id, "error": job.error})
        except Exception as exc:  # noqa: BLE001
            job.status = "failed"
            job.error = f"{type(exc).__name__}: {exc}"
            await db.commit()
            await publish_event({"type": "conversion.failed", "job_id": job_id, "error": job.error})


async def _attach_to_project(db: AsyncSession, job: ConversionJob) -> None:
    """완성된 모델 URL을 연결된 프로젝트 scene_config에 기록 (에디터 자동 연결)."""
    if job.project_id is None or not job.result_url:
        return
    result = await db.execute(select(Project).where(Project.id == job.project_id))
    project = result.scalar_one_or_none()
    if project is None:
        return
    cfg = dict(project.scene_config or {})
    cfg["modelUrl"] = job.result_url
    project.scene_config = cfg
    project.updated_at = datetime.utcnow()
    await db.commit()


async def _run_mock(db: AsyncSession, job: ConversionJob) -> None:
    """키 없이 데모용 진행 시뮬레이션."""
    for i, stage in enumerate(STAGES[1:], start=1):
        await asyncio.sleep(1.5)
        job.stage = stage
        job.status = "done" if stage == "done" else "processing"
        job.progress = int(i / (len(STAGES) - 1) * 100)
        if stage == "done":
            job.result_url = "/samples/demo.glb"
        job.updated_at = datetime.utcnow()
        await db.commit()
    await _attach_to_project(db, job)


async def _run_meshy(db: AsyncSession, job: ConversionJob) -> None:
    """Meshy 실연동: 태스크 생성 → 폴링(10s, 최대 ~10분) → GLB 저장."""
    image_url = (job.source_urls or [""])[0]
    if not image_url.startswith("http"):
        raise ValueError(
            "Meshy는 공개 접근 가능한 이미지 URL이 필요합니다. "
            "로컬 /storage URL은 외부에서 접근할 수 없어 변환할 수 없습니다."
        )
    task_id = await meshy_provider.create_task(image_url, dict(job.job_metadata))
    job.job_metadata = {**job.job_metadata, "provider_task_id": task_id}
    job.status = "processing"
    await db.commit()

    for _ in range(60):  # 60 × 10s = 최대 10분
        await asyncio.sleep(10)
        task = await meshy_provider.get_task(task_id)
        status = str(task.get("status", "PENDING")).upper()
        job.stage = "mesh_generation"
        job.progress = MESHY_STAGES.get(status, 30)
        job.updated_at = datetime.utcnow()
        await db.commit()
        if status == "SUCCEEDED":
            glb_url = (task.get("model_urls") or {}).get("glb", "")
            if not glb_url:
                raise ValueError("Meshy 결과에 GLB URL이 없습니다")
            job.result_url = await meshy_provider.download_glb(glb_url, f"{job.id}.glb")
            job.stage = "done"
            job.status = "done"
            job.progress = 100
            job.updated_at = datetime.utcnow()
            await db.commit()
            await _attach_to_project(db, job)
            return
        if status in meshy_provider.TERMINAL_FAIL:
            raise ValueError(f"Meshy 변환 실패 (status={status})")
    raise TimeoutError("Meshy 변환 시간 초과 (10분)")
