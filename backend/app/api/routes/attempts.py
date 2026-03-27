from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.session import get_db
from app.db.models.attempts import Attempt
from app.db.models.questions import Question
from app.schemas import models as schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Attempt])
def read_attempts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    # Users can usually see their own attempts only, but let's keep it simple or filter by user
    attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id).offset(skip).limit(limit).all()
    return attempts

@router.post("/", response_model=schemas.Attempt)
def create_attempt(
    *,
    db: Session = Depends(get_db),
    attempt_in: schemas.AttemptCreate,
    current_user: schemas.User = Depends(deps.get_current_active_user),
) -> Any:
    # Logic to check answer validity could go here
    # For now, just record the attempt
    
    question = db.query(Question).filter(Question.id == attempt_in.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = False
    if question.correct_answer and attempt_in.user_answer:
        is_correct = (question.correct_answer == attempt_in.user_answer)
    
    attempt = Attempt(
        user_id=current_user.id,
        question_id=attempt_in.question_id,
        user_answer=attempt_in.user_answer,
        code_submission=attempt_in.code_submission,
        is_correct=is_correct
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt
