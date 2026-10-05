"""Authentication router (FR-001~005)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.auth import RefreshRequest, Token, UserCreate, UserLogin, UserResponse
from app.utils.deps import get_current_user
from app.utils.ratelimit import rate_limit
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rate_limit(5, 60))],
)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """이메일 회원가입 (FR-001)."""
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none() is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 가입된 이메일입니다")
    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        display_name=user_data.display_name or user_data.email.split("@")[0],
    )
    db.add(user)
    await db.flush()
    db.add(Subscription(user_id=user.id, plan="free", credits_total=3, credits_used=0))
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=Token, dependencies=[Depends(rate_limit(10, 60))])
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """이메일 로그인 (FR-001)."""
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 또는 비밀번호가 올바르지 않습니다")
    return Token(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(body: RefreshRequest):
    """액세스 토큰 갱신 (NFR-008)."""
    user_id = decode_token(body.refresh_token, "refresh")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="리프레시 토큰이 유효하지 않습니다")
    return Token(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    """현재 사용자 정보 조회."""
    return user
