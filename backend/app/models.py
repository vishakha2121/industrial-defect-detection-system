from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Detection(Base):
    __tablename__ = "detections"
    
    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String(500), nullable=False)
    defect_type = Column(String(100), nullable=False)
    confidence_score = Column(Float, nullable=False)
    defect_location = Column(String(200), default="{}")
    severity_level = Column(String(50), default="medium")
    is_rejected = Column(Boolean, default=False)
    processing_time_ms = Column(Float, default=0.0)
    inspection_time = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DefectType(Base):
    __tablename__ = "defect_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    severity_level = Column(String(50), nullable=False, default="medium")
    threshold_value = Column(Float, default=0.5)
    auto_reject_enabled = Column(Boolean, default=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InspectionBatch(Base):
    __tablename__ = "inspection_batches"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_name = Column(String(200), nullable=False)
    total_items = Column(Integer, default=0)
    rejected_items = Column(Integer, default=0)
    accepted_items = Column(Integer, default=0)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="in_progress")

class SystemSetting(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(100), unique=True, nullable=False)
    setting_value = Column(Text, nullable=False)
    setting_type = Column(String(50), default="string")
    updated_by = Column(String(100), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Feedback(Base):
    __tablename__ = "user_feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    detection_id = Column(Integer, ForeignKey("detections.id"), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    correct_defect_type = Column(String(100), nullable=True)
    feedback_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    detection = relationship("Detection", backref="feedback_items")