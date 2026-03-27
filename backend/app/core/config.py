from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Prep Partner API"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
