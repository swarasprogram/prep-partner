from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Attempt(Base):
    __tablename__ = "attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    user_answer = Column(String, nullable=True) # For MCQs
    code_submission = Column(String, nullable=True) # For DSA
    is_correct = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    feedback = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("app.db.models.users.User", back_populates="attempts")
    question = relationship("app.db.models.questions.Question")
