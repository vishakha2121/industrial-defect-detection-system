from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# Detection Schemas
class DetectionBase(BaseModel):
    defect_type: str
    confidence_score: float
    defect_location: Optional[str] = None
    severity_level: str = "medium"
    is_rejected: bool = False
    processing_time_ms: Optional[float] = None

class DetectionCreate(DetectionBase):
    image_path: str

class DetectionResponse(DetectionBase):
    id: int
    image_path: str
    inspection_time: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class DetectionResult(BaseModel):
    defect_detected: bool
    defect_type: str
    confidence: float
    defect_location: dict
    severity: str
    should_reject: bool
    processing_time: float
    image_annotated_path: Optional[str] = None

# History Schemas
class HistoryFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    defect_type: Optional[str] = None
    is_rejected: Optional[bool] = None
    page: int = 1
    page_size: int = 20

class HistoryResponse(BaseModel):
    total: int
    page: int
    page_size: int
    detections: List[DetectionResponse]

# Statistics Schemas
class DailyStats(BaseModel):
    date: str
    total_inspections: int
    defects_found: int
    rejected_items: int
    acceptance_rate: float

class DefectTypeStats(BaseModel):
    defect_type: str
    count: int
    percentage: float

class OverallStats(BaseModel):
    total_inspections: int
    total_defects: int
    total_rejected: int
    overall_accuracy: float
    avg_processing_time: float
    defect_by_type: List[DefectTypeStats]
    daily_trend: List[DailyStats]

# Settings Schemas
class SettingBase(BaseModel):
    setting_key: str
    setting_value: str
    setting_type: str = "string"

class SettingResponse(SettingBase):
    id: int
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ThresholdSettings(BaseModel):
    confidence_threshold: float = Field(ge=0, le=1)
    iou_threshold: float = Field(ge=0, le=1)
    auto_reject_enabled: bool

# Feedback Schemas
class FeedbackCreate(BaseModel):
    detection_id: int
    is_correct: bool
    correct_defect_type: Optional[str] = None
    feedback_text: Optional[str] = None

class FeedbackResponse(FeedbackCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True