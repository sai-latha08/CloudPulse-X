import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CloudPulse X"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cloudpulse-x-super-secret-jwt-key-for-dev-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Provider Mode: "demo" or "aws"
    CLOUD_PROVIDER: str = os.getenv("CLOUD_PROVIDER", "demo")
    
    # Database URL: SQLite by default for instant zero-dependency execution, or PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cloudpulse.db")
    
    # AWS configuration (optional, active when CLOUD_PROVIDER="aws")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID", None)
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY", None)
    AWS_SESSION_TOKEN: Optional[str] = os.getenv("AWS_SESSION_TOKEN", None)
    
    # Optional LLM API Key (OpenAI or Gemini for Copilot, with local reasoning fallback)
    LLM_API_KEY: Optional[str] = os.getenv("LLM_API_KEY", None)
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
