-- Create detections table
CREATE TABLE IF NOT EXISTS detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path VARCHAR(500) NOT NULL,
    defect_type VARCHAR(100) NOT NULL,
    confidence_score FLOAT NOT NULL,
    defect_location VARCHAR(200),
    severity_level VARCHAR(50) DEFAULT 'medium',
    is_rejected BOOLEAN DEFAULT FALSE,
    processing_time_ms FLOAT,
    inspection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_detections_defect_type ON detections(defect_type);
CREATE INDEX idx_detections_inspection_time ON detections(inspection_time);
CREATE INDEX idx_detections_is_rejected ON detections(is_rejected);
CREATE INDEX idx_detections_severity ON detections(severity_level);

-- Create trigger for updated_at
CREATE TRIGGER update_detections_updated_at 
AFTER UPDATE ON detections
BEGIN
    UPDATE detections SET created_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;