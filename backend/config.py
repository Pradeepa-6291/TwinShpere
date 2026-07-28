import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load .env file from current directory or parent directory
load_dotenv(".env")
load_dotenv("../.env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "TWINSPHERE AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "twinsphere_ai")
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "twinsphere-super-secret-jwt-key-2026-campus-ai")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # AI / LLM Configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "fallback") # options: openai, gemini, ollama, fallback
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    
    # Simulation & Anomaly settings
    SIMULATION_INTERVAL_SEC: float = 3.0
    ANOMALY_SENSITIVITY: float = 0.85
    
    class Config:
        case_sensitive = True

settings = Settings()
