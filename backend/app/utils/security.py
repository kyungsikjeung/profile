"""Security utilities: password hashing + JWT (NFR-008)."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings

ALGORITHM = "HS256"


def _fallback_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000).hex()
    return f"pbkdf2${salt}${digest}"


def _fallback_verify(password: str, hashed: str) -> bool:
    try:
        _, salt, digest = hashed.split("$", 2)
        check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000).hex()
        return secrets.compare_digest(check, digest)
    except ValueError:
        return False


try:
    from passlib.context import CryptContext

    _pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(password: str) -> str:
        try:
            return _pwd.hash(password)
        except Exception:
            return _fallback_hash(password)

    def verify_password(password: str, hashed: str) -> bool:
        if hashed.startswith("pbkdf2$"):
            return _fallback_verify(password, hashed)
        try:
            return _pwd.verify(password, hashed)
        except Exception:
            return False

except ImportError:

    def hash_password(password: str) -> str:
        return _fallback_hash(password)

    def verify_password(password: str, hashed: str) -> bool:
        return _fallback_verify(password, hashed)


def _expire(minutes: int = 0, days: int = 0) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes, days=days)


def create_access_token(subject: str) -> str:
    payload = {"sub": subject, "type": "access", "exp": _expire(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str) -> str:
    payload = {"sub": subject, "type": "refresh", "exp": _expire(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str, expected_type: str = "access") -> str | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != expected_type:
            return None
        return str(payload.get("sub"))
    except JWTError:
        return None
