import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from backend.core.logger import logger

# Compute the absolute path to the project root
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = ROOT_DIR / "config" / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "PARASITIC AI SOCIAL MEDIA INFRASTRUCTURE"
    APP_NAME: str = "Flowzint AI"

    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = ""
    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"

    # Supabase config (default to empty strings to prevent Pydantic crash, allowing custom validation logs)
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

# Post-load validation logs
logger.info(f"Loaded environment variables from: {ENV_PATH}")
if not settings.SUPABASE_URL:
    logger.error("CRITICAL: SUPABASE_URL is missing or empty.")
if not settings.SUPABASE_ANON_KEY:
    logger.error("CRITICAL: SUPABASE_ANON_KEY is missing or empty.")
