from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings

BACKEND_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    APP_NAME: str = 'GrowthWay API'
    DEBUG: bool = False
    ENVIRONMENT: str = 'development'
    MONGODB_URL: str = 'mongodb://localhost:27017'
    MONGODB_DB_NAME: str = 'growthway'
    CORS_ORIGINS: str = 'http://localhost:5173,http://localhost:3000'
    SECRET_KEY: str = ''
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = 'HS256'
    ADMIN_USERNAME: str = ''
    ADMIN_PASSWORD: str = ''
    CLOUDINARY_CLOUD_NAME: str = ''
    CLOUDINARY_API_KEY: str = ''
    CLOUDINARY_API_SECRET: str = ''
    SMTP_HOST: str = ''
    SMTP_PORT: int = 587
    SMTP_USER: str = ''
    SMTP_PASSWORD: str = ''
    SMTP_SSL: bool = False
    EMAIL_FROM: str = ''
    NOTIFICATION_EMAIL: str = ''
    WHATSAPP_NUMBER: str = ''
    GA_MEASUREMENT_ID: str = ''
    SITE_URL: str = ''
    AI_ENABLED: bool = False
    AI_PROVIDER: str = ''
    AI_API_KEY: str = ''
    AI_MODEL: str = ''
    model_config = {'env_file': str(BACKEND_DIR / '.env'), 'extra': 'ignore'}

@lru_cache()
def get_settings(): return Settings()
