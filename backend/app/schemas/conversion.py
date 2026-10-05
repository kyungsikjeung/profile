"""Conversion schemas (FR-012~017)."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class ConversionRequest(BaseModel):
    image_urls: list[str] = Field(min_length=1, max_length=8)
    project_id: UUID | None = None
    options: dict[str, Any] = Field(default_factory=dict)


class ConversionResponse(BaseModel):
    job_id: UUID
    status: str
    progress: int = 0

    model_config = {"from_attributes": False}


class ConversionStatus(BaseModel):
    job_id: UUID
    status: str
    progress: int
    stage: str
    result_url: str = ""
    error: str = ""
    project_id: UUID | None = None
    provider: str = "mock"
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
