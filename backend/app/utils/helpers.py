import hashlib
import uuid
from datetime import datetime
from typing import List, Dict
import json
import re

def generate_unique_id(prefix: str = "") -> str:
    """Generate unique identifier"""
    unique_id = str(uuid.uuid4())[:8]
    if prefix:
        return f"{prefix}_{unique_id}"
    return unique_id

def calculate_file_hash(file_content: bytes) -> str:
    """Calculate SHA256 hash of file"""
    return hashlib.sha256(file_content).hexdigest()

def format_processing_time(ms: float) -> str:
    """Format processing time in human readable format"""
    if ms < 1000:
        return f"{ms:.0f}ms"
    else:
        return f"{ms/1000:.2f}s"

def parse_defect_location(location_str: str) -> Dict:
    """Parse defect location string to dictionary"""
    try:
        if location_str:
            return json.loads(location_str)
    except:
        pass
    return {}

def calculate_defect_density(defect_count: int, area_size: float) -> float:
    """Calculate defect density per unit area"""
    if area_size > 0:
        return defect_count / area_size
    return 0.0

def get_defect_severity_color(severity: str) -> str:
    """Get color code for severity level"""
    colors = {
        "critical": "#FF0000",
        "high": "#FF4444",
        "medium": "#FFA500",
        "low": "#FFFF00",
        "very_low": "#00FF00",
        "none": "#808080"
    }
    return colors.get(severity.lower(), "#808080")

def validate_image_format(filename: str, allowed_formats: List[str]) -> bool:
    """Validate image file format"""
    extension = filename.split('.')[-1].lower()
    return extension in allowed_formats

def compress_image(image_path: str, quality: int = 85) -> str:
    """Compress image for faster processing"""
    from PIL import Image
    compressed_path = f"temp_compressed_{uuid.uuid4().hex}.jpg"
    
    img = Image.open(image_path)
    img.save(compressed_path, "JPEG", quality=quality, optimize=True)
    
    return compressed_path

def get_timestamp_filename(original_name: str) -> str:
    """Generate timestamp-based filename"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    name_parts = original_name.rsplit('.', 1)
    if len(name_parts) == 2:
        return f"{name_parts[0]}_{timestamp}.{name_parts[1]}"
    return f"{original_name}_{timestamp}"