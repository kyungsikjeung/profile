"""File upload router (FR-006~009)."""

from fastapi import APIRouter, HTTPException, UploadFile, status

from app.schemas.upload import UploadResponse
from app.services.storage import save_upload

router = APIRouter()


@router.post("/image", response_model=UploadResponse)
async def upload_image(file: UploadFile):
    """단일 이미지 업로드 + 검증/최적화 메타 반환."""
    try:
        saved = await save_upload(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return {"files": [saved]}


@router.post("/images", response_model=UploadResponse)
async def upload_images(files: list[UploadFile]):
    """다중 이미지 업로드 (FR-007, 최대 8장)."""
    if len(files) > 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="최대 8장까지 업로드할 수 있습니다")
    saved: list[dict] = []
    for file in files:
        try:
            saved.append(await save_upload(file))
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"{file.filename}: {exc}")
    return {"files": saved}
