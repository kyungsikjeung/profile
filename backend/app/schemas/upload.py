"""Upload schemas (FR-006~011)."""

from pydantic import BaseModel


class UploadedFile(BaseModel):
    filename: str
    url: str
    size: int
    content_type: str
    width: int = 0
    height: int = 0


class UploadResponse(BaseModel):
    files: list[UploadedFile]
