from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./house_rental.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # App
    PROJECT_NAME: str = "House Rental API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API for house rental platform with agent matching and furniture moving services"
    
    class Config:
        env_file = ".env"


settings = Settings()

