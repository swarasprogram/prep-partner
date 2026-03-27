from sqlalchemy import Column, Integer, String, JSON, Enum
import enum
from app.db.base import Base

class QuestionType(str, enum.Enum):
    MCQ = "MCQ"
    DSA = "DSA"
    INTERVIEW = "INTERVIEW"

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)  # The question text or problem statement
    question_type = Column(String, nullable=False) # Store Enum as string for simplicity in basic SQL
    options = Column(JSON, nullable=True)  # For MCQs: {"options": ["A", "B", "C", "D"]}
    correct_answer = Column(String, nullable=True) # For MCQs
    difficulty = Column(String, default="Medium")
    tags = Column(JSON, nullable=True)
