"""Meshy image-to-3D 프로바이더 (https://docs.meshy.ai).

Flow: POST /image-to-3d → task id → 폴링 GET /image-to-3d/{id}
→ SUCCEEDED 시 GLB 다운로드 → 로컬 스토리지에 저장.
"""

from pathlib import Path

import httpx

from app.config import settings

BASE_URL = "https://api.meshy.ai/openapi/v1"
MODEL_DIR = Path("storage/models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

TERMINAL_FAIL = {"FAILED", "EXPIRED", "CANCELED"}


def _headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {settings.MESHY_API_KEY}"}


async def create_task(image_url: str, options: dict) -> str:
    """변환 태스크 생성 → task id 반환 (문서화된 필드만 전송)."""
    payload = {
        "image_url": image_url,
        "ai_model": options.get("ai_model", "meshy-7.1"),
        "enable_pbr": True,
        "should_texture": True,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(f"{BASE_URL}/image-to-3d", json=payload, headers=_headers())
        resp.raise_for_status()
        return str(resp.json()["result"])


async def get_task(task_id: str) -> dict:
    """태스크 상태 조회."""
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(f"{BASE_URL}/image-to-3d/{task_id}", headers=_headers())
        resp.raise_for_status()
        return dict(resp.json()["result"])


async def download_glb(url: str, dest_name: str) -> str:
    """GLB 다운로드 → /storage/models 저장 → 서빙용 상대 URL 반환."""
    dest = MODEL_DIR / dest_name
    async with httpx.AsyncClient(timeout=120) as client:
        async with client.stream("GET", url) as resp:
            resp.raise_for_status()
            with dest.open("wb") as f:
                async for chunk in resp.aiter_bytes(1024 * 64):
                    f.write(chunk)
    return f"/storage/models/{dest_name}"
