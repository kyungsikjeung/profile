"""Subscription schemas (FR-033~036)."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PlanChangeRequest(BaseModel):
    plan: str


class SubscriptionResponse(BaseModel):
    id: UUID
    plan: str
    status: str
    credits_total: int
    credits_used: int
    credits_remaining: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
