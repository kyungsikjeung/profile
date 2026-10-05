"""3D conversion router (FR-012~017)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.conversion import ConversionRequest, ConversionResponse, ConversionStatus
from app.services.conversion import create_job, get_job
from app.utils.deps import get_current_user_optional
from app.utils.ratelimit import rate_limit

router = APIRouter()


async def _consume_credit(db: AsyncSession, user: User) -> None:
    """로그인 사용자는 플랜 크레딧 차감. 한도 초과 시 402."""
    result = await db.execute(select(Subscription).where(Subscription.user_id == user.id))
    sub = result.scalar_one_or_none()
    if sub is None:
        return
    if sub.credits_used >= sub.credits_total:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="무료 변환 한도를 모두 사용했습니다. 플랜을 업그레이드하세요.",
        )
    sub.credits_used += 1
    await db.commit()


@router.post(
    "",
    response_model=ConversionResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(rate_limit(30, 60))],
)
async def create_conversion(
    request: ConversionRequest,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """3D 변환 요청 생성 → 즉시 job ID 반환 (비동기 패턴, UX-001 데모는 비로그인 허용)."""
    if user is not None:
        await _consume_credit(db, user)
    job = await create_job(
        db,
        image_urls=request.image_urls,
        owner_id=user.id if user else None,
        project_id=request.project_id,
        options=request.options,
    )
    return ConversionResponse(job_id=job.id, status=job.status, progress=job.progress)


@router.get("/{conversion_id}", response_model=ConversionStatus)
async def get_conversion_status(conversion_id: str, db: AsyncSession = Depends(get_db)):
    """변환 상태 폴링 (FR-014)."""
    job = await get_job(db, conversion_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="변환 작업을 찾을 수 없습니다")
    return ConversionStatus(
        job_id=job.id,
        status=job.status,
        progress=job.progress,
        stage=job.stage,
        result_url=job.result_url,
        error=job.error,
        project_id=job.project_id,
        provider=job.provider,
        created_at=job.created_at,
        updated_at=job.updated_at,
    )


@router.post("/{conversion_id}/regenerate", response_model=ConversionResponse)
async def regenerate_conversion(
    conversion_id: str,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """불만족 시 재생성 (FR-016). 재생성도 크레딧 1회 차감."""
    job = await get_job(db, conversion_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="변환 작업을 찾을 수 없습니다")
    if user is not None:
        await _consume_credit(db, user)
    new_job = await create_job(
        db,
        image_urls=list(job.source_urls),
        owner_id=user.id if user else job.owner_id,
        project_id=job.project_id,
        options=dict(job.job_metadata),
    )
    return ConversionResponse(job_id=new_job.id, status=new_job.status, progress=new_job.progress)
