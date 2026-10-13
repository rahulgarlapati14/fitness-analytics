from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Fitness Analytics Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/fitness_analytics"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Instagram API
    INSTAGRAM_CLIENT_ID: Optional[str] = None
    INSTAGRAM_CLIENT_SECRET: Optional[str] = None
    INSTAGRAM_REDIRECT_URI: str = "http://localhost:8000/api/v1/instagram/callback"

    # OpenAI API
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"

    # Anthropic API
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-opus-20240229"

    # MLflow
    MLFLOW_TRACKING_URI: str = "http://localhost:5000"

    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]

    # Subscription Tier Pricing
    DAY_PASS_PRICE: float = 15.0
    MONTHLY_PASS_PRICE: float = 50.0
    THREE_MONTH_PASS_PRICE: float = 120.0

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }


settings = Settings()
