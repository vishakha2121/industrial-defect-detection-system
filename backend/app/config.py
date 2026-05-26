from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Industrial Defect Detection"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///database/defect_system.db"
    
    # Model Settings
    MODEL_PATH: str = "models/yolov8n.pt"
    CLASSIFIER_PATH: str = "models/defect_model.pth"
    CONFIDENCE_THRESHOLD: float = 0.5
    IOU_THRESHOLD: float = 0.45
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png"]
    
    # Auto Reject
    AUTO_REJECT_ENABLED: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-this"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields

settings = Settings()