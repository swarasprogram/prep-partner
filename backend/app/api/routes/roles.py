from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.session import get_db
from app.db.models.roles import Role
from app.schemas import models as schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Role])
def read_roles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    roles = db.query(Role).offset(skip).limit(limit).all()
    return roles

@router.post("/", response_model=schemas.Role)
def create_role(
    *,
    db: Session = Depends(get_db),
    role_in: schemas.RoleCreate,
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    role = Role(name=role_in.name, description=role_in.description)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role
