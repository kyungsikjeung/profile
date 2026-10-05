"""Subscription model."""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.user import GUID


class Subscription(Base):
    """구독 정보 (FR-033~036)."""

    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    plan: Mapped[str] = mapped_column(String(30), nullable=False, default="free")
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="active")
    credits_total: Mapped[int] = mapped_column(nullable=False, default=3)
    credits_used: Mapped[int] = mapped_column(nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
