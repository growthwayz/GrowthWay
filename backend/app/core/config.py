"""
Centralised application configuration.
All secrets / tunables come from environment variables (or .env).
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────
    APP_NAME: str = "GrowthWay API"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development | staging | production

    # ── MongoDB ──────────────────────────────────────────
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "growthway"

    # ── CORS ─────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # ── Auth / JWT ───────────────────────────────────────
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # ── Cloudinary ───────────────────────────────────────
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # ── Email ────────────────────────────────────────────
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@growthway.in"
    NOTIFICATION_EMAIL: str = ""

    # ── AI (Phase D) ─────────────────────────────────────
    AI_PROVIDER: str = ""
    AI_API_KEY: str = ""
    AI_MODEL: str = ""

    # ── WhatsApp ─────────────────────────────────────────
    WHATSAPP_NUMBER: str = ""

    # ── Analytics ────────────────────────────────────────
    GA_MEASUREMENT_ID: str = ""

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
