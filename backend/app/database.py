"""Database configuration (Postgres 운영 / SQLite 로컬 폴백)."""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


def _build_engine():
    if settings.DATABASE_URL.startswith("sqlite"):
        return create_async_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            connect_args={"check_same_thread": False},
        )
    return create_async_engine(
        settings.DATABASE_URL, echo=settings.DEBUG, pool_size=20, max_overflow=10
    )


engine = _build_engine()

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base class for all models."""
    pass


async def get_db():
    """Dependency for database sessions."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """테이블 생성 (로컬 dev / 테스트용. 운영은 Alembic 사용)."""
    import app.models  # noqa: F401  (모델 등록)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
