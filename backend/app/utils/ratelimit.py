"""Redis 고정 윈도우 레이트리밋 (NFR-011).

실습 포인트: INCR+EXPIRE 원자성, fail-open(레디스 다운 시 통과),
키 설계 `rl:{path}:{ip}:{window}`.
"""

import time

import structlog
from fastapi import HTTPException, Request, status
from redis.asyncio import Redis

from app.config import settings

log = structlog.get_logger()

_redis: Redis | None = None


def _client() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(settings.REDIS_URL, socket_connect_timeout=1, socket_timeout=1)
    return _redis


def rate_limit(times: int, seconds: int):
    """고정 윈도우 레이트리밋 의존성. 초과 시 429."""

    async def dep(request: Request) -> None:
        host = request.client.host if request.client else "unknown"
        window = int(time.time()) // seconds
        key = f"rl:{request.url.path}:{host}:{window}"
        try:
            r = _client()
            n = await r.incr(key)
            if n == 1:
                await r.expire(key, seconds + 1)
            if n > times:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="요청이 너무 많습니다. 잠시 후 다시 시도하세요.",
                )
        except HTTPException:
            raise
        except Exception as exc:  # noqa: BLE001 — 레디스 장애 시 통과
            log.warning("ratelimit fail-open", error=str(exc))

    return dep
