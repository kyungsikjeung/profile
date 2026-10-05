"""Project schemas (FR-018~023, FR-028)."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    title: str = Field(default="Untitled", max_length=200)
    description: str = ""
    template: str = "minimal"
    scene_config: dict[str, Any] = Field(default_factory=dict)


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    template: str | None = None
    status: str | None = None
    scene_config: dict[str, Any] | None = None


class ProjectResponse(BaseModel):
    id: UUID
    title: str
    description: str
    template: str
    status: str
    share_slug: str | None = None
    scene_config: dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
