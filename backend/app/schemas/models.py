from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str
    role_id: Optional[int] = None

class UserUpdate(UserBase):
    password: Optional[str] = None

class User(UserBase):
    id: int
    role_id: Optional[int]
    created_at: datetime
    
    class Config:
        orm_mode = True

# Role Schemas
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    
    class Config:
        orm_mode = True

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    description: Optional[str] = None
    criteria: Optional[Any] = None

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    
    class Config:
        orm_mode = True

# Question Schemas
class QuestionBase(BaseModel):
    title: str
    content: str
    question_type: str
    options: Optional[Any] = None
    correct_answer: Optional[str] = None
    difficulty: Optional[str] = "Medium"
    tags: Optional[List[str]] = None

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    
    class Config:
        orm_mode = True

# Attempt Schemas
class AttemptCreate(BaseModel):
    question_id: int
    user_answer: Optional[str] = None
    code_submission: Optional[str] = None

class Attempt(BaseModel):
    id: int
    user_id: int
    question_id: int
    user_answer: Optional[str]
    code_submission: Optional[str]
    is_correct: bool
    score: int
    feedback: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
