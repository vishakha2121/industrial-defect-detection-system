-- Create inspection batches table
CREATE TABLE IF NOT EXISTS inspection_batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_name VARCHAR(200) NOT NULL,
    total_items INTEGER DEFAULT 0,
    rejected_items INTEGER DEFAULT 0,
    accepted_items INTEGER DEFAULT 0,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    detection_id INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    correct_defect_type VARCHAR(100),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (detection_id) REFERENCES detections(id) ON DELETE CASCADE
);

-- Create system logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_level VARCHAR(20) NOT NULL,
    module VARCHAR(100),
    message TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_feedback_detection_id ON user_feedback(detection_id);
CREATE INDEX idx_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_logs_level ON system_logs(log_level);
CREATE INDEX idx_batches_status ON inspection_batches(status);
CREATE INDEX idx_batches_start_time ON inspection_batches(start_time);

-- Create view for daily statistics
CREATE VIEW IF NOT EXISTS daily_stats_view AS
SELECT 
    DATE(inspection_time) as date,
    COUNT(*) as total_inspections,
    SUM(CASE WHEN defect_type != 'normal' THEN 1 ELSE 0 END) as defects_found,
    SUM(CASE WHEN is_rejected = 1 THEN 1 ELSE 0 END) as rejected_items,
    AVG(processing_time_ms) as avg_processing_time
FROM detections
GROUP BY DATE(inspection_time);