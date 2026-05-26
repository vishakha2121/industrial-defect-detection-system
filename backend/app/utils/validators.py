import re
from typing import Dict, Any, List
from fastapi import HTTPException

def validate_detection_input(data: Dict[str, Any]) -> bool:
    """Validate detection input data"""
    required_fields = ['image_path']
    
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
    
    return True

def validate_defect_type(defect_type: str, valid_types: List[str]) -> bool:
    """Validate defect type against allowed list"""
    return defect_type.lower() in [dt.lower() for dt in valid_types]

def validate_confidence_score(confidence: float) -> bool:
    """Validate confidence score range"""
    return 0.0 <= confidence <= 1.0

def validate_batch_data(batch_name: str) -> bool:
    """Validate batch name"""
    if not batch_name or len(batch_name) > 200:
        return False
    # Check for invalid characters
    if re.search(r'[<>:"/\\|?*]', batch_name):
        return False
    return True

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove path traversal attempts
    filename = filename.replace('../', '').replace('..\\', '')
    # Remove any non-alphanumeric characters except dot and underscore
    sanitized = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
    return sanitized[:255]  # Limit length

def validate_file_size(file_size: int, max_size_mb: int) -> bool:
    """Validate file size"""
    max_bytes = max_size_mb * 1024 * 1024
    return file_size <= max_bytes

def validate_threshold(threshold: float) -> bool:
    """Validate threshold value"""
    return 0.0 <= threshold <= 1.0

def validate_api_key(api_key: str) -> bool:
    """Basic API key validation"""
    if not api_key:
        return False
    # Gemini API keys are typically 39 characters
    return len(api_key) >= 30 and api_key.startswith('AI')