"""Portfolio3D FastAPI Application."""

from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.routers import auth, projects, upload, conversion, subscription
from fastapi.staticfiles import StaticFiles

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    logger.info("Starting up Portfolio3D API")
    from app.database import init_db

    await init_db()
    yield
    await engine.dispose()
    logger.info("Shutting down Portfolio3D API")


app = FastAPI(
    title=settings.APP_NAME,
    description="3D 포트폴리오 플랫폼 API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["인증"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["프로젝트"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["업로드"])
app.include_router(conversion.router, prefix="/api/v1/conversion", tags=["3D 변환"])
app.include_router(subscription.router, prefix="/api/v1/subscription", tags=["구독"])

from pathlib import Path

Path("storage/uploads").mkdir(parents=True, exist_ok=True)
app.mount("/storage", StaticFiles(directory="storage"), name="storage")


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트."""
    return {"status": "healthy", "version": "0.1.0"}


@app.get("/")
async def root():
    """루트 엔드포인트."""
    return {
        "name": settings.APP_NAME,
        "version": "0.1.0",
        "docs": "/docs",
    }
