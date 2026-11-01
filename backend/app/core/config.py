import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "TrustChain AI — Intelligent Document Authentication Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "trustchain-ai-enterprise-secret-key-2026-production-ready"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Environment & Demo Mode
    ENVIRONMENT: str = "development"
    DEMO_MODE: bool = True
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Firebase Configuration (Optional in Demo Mode)
    FIREBASE_PROJECT_ID: str = "trustchain-ai-demo"
    FIREBASE_SERVICE_ACCOUNT_PATH: str = ""
    FIREBASE_STORAGE_BUCKET: str = "trustchain-ai.appspot.com"
    
    # External APIs (Phases 2 & 3 readiness)
    GEMINI_API_KEY: str = ""
    BLOCKCHAIN_ENABLED: bool = True
    BLOCKCHAIN_NETWORK: str = "hardhat"
    BLOCKCHAIN_CHAIN_ID: int = 31337
    BLOCKCHAIN_RPC_URL: str = "http://127.0.0.1:8545"
    BLOCKCHAIN_CONTRACT_ADDRESS: str = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    ISSUER_WALLET_ADDRESS: str = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    
    # File Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    MAX_FILE_SIZE_MB: int = 15

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
