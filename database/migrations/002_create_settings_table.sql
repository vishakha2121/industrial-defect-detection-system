-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    updated_by VARCHAR(100),
    updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create defect types table
CREATE TABLE IF NOT EXISTS defect_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    severity_level VARCHAR(50) NOT NULL,
    threshold_value FLOAT DEFAULT 0.5,
    auto_reject_enabled BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('confidence_threshold', '0.5', 'number', 'Minimum confidence score for defect detection'),
('iou_threshold', '0.45', 'number', 'Intersection over Union threshold for duplicate detections'),
('auto_reject_enabled', 'true', 'boolean', 'Automatically reject defective items'),
('max_upload_size', '10', 'number', 'Maximum upload size in MB'),
('model_path', 'models/yolov8n.pt', 'string', 'Path to YOLOv8 model'),
('notification_enabled', 'true', 'boolean', 'Enable system notifications');

-- Insert default defect types
INSERT OR IGNORE INTO defect_types (name, severity_level, threshold_value, auto_reject_enabled, description) VALUES
('scratch', 'medium', 0.6, TRUE, 'Surface scratch marks'),
('dent', 'medium', 0.6, TRUE, 'Surface dents or dings'),
('crack', 'high', 0.5, TRUE, 'Material cracks or fractures'),
('hole', 'high', 0.5, TRUE, 'Holes or perforations'),
('stain', 'low', 0.7, FALSE, 'Surface stains or discoloration'),
('burr', 'low', 0.7, FALSE, 'Sharp edges or burrs'),
('deformation', 'medium', 0.6, TRUE, 'Shape deformation'),
('discoloration', 'low', 0.7, FALSE, 'Color variation'),
('scratch_deep', 'high', 0.5, TRUE, 'Deep scratches'),
('normal', 'none', 0.0, FALSE, 'No defect detected');