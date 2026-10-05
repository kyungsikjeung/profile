"""Project model."""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.user import GUID


class Project(Base):
    """포트폴리오 프로젝트."""

    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(GUID(), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False, default="Untitled")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    template: Mapped[str] = mapped_column(String(50), nullable=False, default="minimal")
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="draft")
    share_slug: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=True)
    scene_config: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
