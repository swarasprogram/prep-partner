from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    
    # Relationship to User is defined in User model or using backref strings to avoid circular imports at top level
    users = relationship("User", back_populates="role")
