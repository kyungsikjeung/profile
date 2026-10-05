"""File storage service (FR-006~009, NFR-010)."""

import uuid
from pathlib import Path

from fastapi import UploadFile

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_SIZE = 10 * 1024 * 1024  # 10MB (FR-008)

STORAGE_DIR = Path("storage/uploads")
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def validate_image(content_type: str, size: int) -> str:
    if content_type not in ALLOWED_TYPES:
        raise ValueError("지원하지 않는 이미지 형식입니다 (jpg/png/webp만 가능)")
    if size > MAX_SIZE:
        raise ValueError("파일 크기는 10MB를 초과할 수 없습니다")
    return ALLOWED_TYPES[content_type]


async def save_upload(file: UploadFile) -> dict:
    data = await file.read()
    ext = validate_image(file.content_type or "", len(data))
    name = f"{uuid.uuid4().hex}{ext}"
    path = STORAGE_DIR / name
    path.write_bytes(data)

    width, height = 0, 0
    try:
        from PIL import Image

        with Image.open(path) as img:
            width, height = img.size
    except Exception:
        pass

    return {
        "filename": file.filename or name,
        "url": f"/storage/uploads/{name}",
        "size": len(data),
        "content_type": file.content_type or "application/octet-stream",
        "width": width,
        "height": height,
    }
