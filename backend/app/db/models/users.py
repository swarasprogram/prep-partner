from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    role = relationship("app.db.models.roles.Role", back_populates="users")
    attempts = relationship("app.db.models.attempts.Attempt", back_populates="user")
