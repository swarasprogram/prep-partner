from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.session import get_db
from app.db.models.companies import Company
from app.schemas import models as schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Company])
def read_companies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    companies = db.query(Company).offset(skip).limit(limit).all()
    return companies

@router.post("/", response_model=schemas.Company)
def create_company(
    *,
    db: Session = Depends(get_db),
    company_in: schemas.CompanyCreate,
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    company = Company(
        name=company_in.name, 
        description=company_in.description,
        criteria=company_in.criteria
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company
