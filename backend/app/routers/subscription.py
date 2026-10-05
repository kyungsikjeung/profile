"""Subscription router (FR-033~036).

결제는 목업 세션 플로우로 동작한다:
POST /checkout → 세션 생성 → POST /checkout/{id}/confirm → 플랜 적용.
실연동 시 세션 생성 부분만 Stripe/Toss Checkout으로 교체하면 된다 (FR-034).
"""

import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import PlanChangeRequest, SubscriptionResponse
from app.utils.deps import get_current_user

router = APIRouter()

PLANS: dict[str, int] = {"free": 3, "pro": 20, "studio": 100, "enterprise": 10_000}
PRICES_USD: dict[str, int] = {"pro": 19, "studio": 39, "enterprise": 99}

_checkout_sessions: dict[str, dict] = {}


class CheckoutSession(BaseModel):
    session_id: str
    plan: str
    amount_usd: int
    mock: bool = True


def _to_response(sub: Subscription) -> SubscriptionResponse:
    return SubscriptionResponse(
        id=sub.id,
        plan=sub.plan,
        status=sub.status,
        credits_total=sub.credits_total,
        credits_used=sub.credits_used,
        credits_remaining=max(sub.credits_total - sub.credits_used, 0),
        created_at=sub.created_at,
        updated_at=sub.updated_at,
    )


async def _get_or_create(user: User, db: AsyncSession) -> Subscription:
    result = await db.execute(select(Subscription).where(Subscription.user_id == user.id))
    sub = result.scalar_one_or_none()
    if sub is None:
        sub = Subscription(user_id=user.id, plan="free", credits_total=PLANS["free"])
        db.add(sub)
        await db.commit()
        await db.refresh(sub)
    return sub


async def _apply_plan(user: User, plan: str, db: AsyncSession) -> Subscription:
    sub = await _get_or_create(user, db)
    sub.plan = plan
    sub.status = "active"
    sub.credits_total = PLANS[plan]
    sub.credits_used = 0
    await db.commit()
    await db.refresh(sub)
    return sub


@router.get("/current", response_model=SubscriptionResponse)
async def get_current_subscription(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """현재 구독 정보 조회."""
    return _to_response(await _get_or_create(user, db))


@router.post("/checkout", response_model=CheckoutSession)
async def create_checkout(
    request: PlanChangeRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),  # noqa: ARG001 (실연동 시 고객 조회에 사용)
):
    """목업 결제 세션 생성."""
    if request.plan not in PRICES_USD:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="유료 플랜만 결제할 수 있습니다")
    session_id = secrets.token_urlsafe(16)
    _checkout_sessions[session_id] = {"user_id": str(user.id), "plan": request.plan}
    return CheckoutSession(session_id=session_id, plan=request.plan, amount_usd=PRICES_USD[request.plan])


@router.post("/checkout/{session_id}/confirm", response_model=SubscriptionResponse)
async def confirm_checkout(
    session_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """목업 결제 승인 → 플랜 적용."""
    session = _checkout_sessions.pop(session_id, None)
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="결제 세션을 찾을 수 없습니다")
    if session["user_id"] != str(user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="본인의 결제 세션이 아닙니다")
    return _to_response(await _apply_plan(user, session["plan"], db))


@router.post("/change", response_model=SubscriptionResponse)
async def change_subscription(
    request: PlanChangeRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """구독 플랜 직접 변경 (관리자/테스트용). 일반 결제는 /checkout 사용."""
    if request.plan not in PLANS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="지원하지 않는 플랜입니다")
    return _to_response(await _apply_plan(user, request.plan, db))


@router.post("/cancel", response_model=SubscriptionResponse)
async def cancel_subscription(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """구독 해지 → free로 다운그레이드."""
    sub = await _get_or_create(user, db)
    sub.plan = "free"
    sub.status = "cancelled"
    sub.credits_total = PLANS["free"]
    await db.commit()
    await db.refresh(sub)
    return _to_response(sub)
