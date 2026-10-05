"""Projects router (FR-018~023, FR-028)."""

import secrets
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.utils.deps import get_current_user

router = APIRouter()


@router.get("", response_model=list[ProjectResponse])
async def list_projects(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """내 프로젝트 목록 조회."""
    result = await db.execute(select(Project).where(Project.owner_id == user.id).order_by(Project.updated_at.desc()))
    return list(result.scalars().all())


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """새 프로젝트 생성."""
    project = Project(
        owner_id=user.id,
        title=project_data.title,
        description=project_data.description,
        template=project_data.template,
        scene_config=project_data.scene_config,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.get("/shared/{slug}", response_model=ProjectResponse)
async def get_shared_project(slug: str, db: AsyncSession = Depends(get_db)):
    """공개 공유 링크 조회 (FR-028, 인증 불필요, published만)."""
    result = await db.execute(
        select(Project).where(Project.share_slug == slug, Project.status == "published")
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="공유된 프로젝트를 찾을 수 없습니다")
    return project


def _parse_id(project_id: str) -> uuid.UUID:
    try:
        return uuid.UUID(str(project_id))
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="프로젝트를 찾을 수 없습니다")


async def _get_owned(project_id: str, user: User, db: AsyncSession) -> Project:
    result = await db.execute(
        select(Project).where(Project.id == _parse_id(project_id), Project.owner_id == user.id)
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="프로젝트를 찾을 수 없습니다")
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """프로젝트 상세 조회."""
    return await _get_owned(project_id, user, db)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """프로젝트 수정 + 퍼블리시 시 share_slug 발급 (FR-028)."""
    project = await _get_owned(project_id, user, db)
    data = project_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(project, key, value)
    if data.get("status") == "published" and not project.share_slug:
        project.share_slug = secrets.token_urlsafe(8)
    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """프로젝트 삭제."""
    project = await _get_owned(project_id, user, db)
    await db.delete(project)
    await db.commit()
