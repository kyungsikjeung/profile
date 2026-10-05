"""Auth dependencies (NFR-008, NFR-009)."""

import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.utils.security import decode_token

_bearer = HTTPBearer(auto_error=False)


async def _load_user(user_id: str, db: AsyncSession) -> User | None:
    try:
        uid = uuid.UUID(str(user_id))
    except ValueError:
        return None
    result = await db.execute(select(User).where(User.id == uid))
    return result.scalar_one_or_none()


async def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="인증이 필요합니다")
    user_id = decode_token(creds.credentials, "access")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="토큰이 유효하지 않습니다")
    user = await _load_user(user_id, db)
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="사용자를 찾을 수 없습니다")
    return user


async def get_current_user_optional(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if creds is None or not creds.credentials:
        return None
    user_id = decode_token(creds.credentials, "access")
    if user_id is None:
        return None
    return await _load_user(user_id, db)
