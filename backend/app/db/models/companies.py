from sqlalchemy import Column, Integer, String, JSON
from app.db.base import Base

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    criteria = Column(JSON, nullable=True)  # Store criteria metadata as JSON
