-- Insert sample detection data for testing
INSERT INTO detections (image_path, defect_type, confidence_score, defect_location, severity_level, is_rejected, processing_time_ms, inspection_time) VALUES
('/static/uploads/sample1.jpg', 'scratch', 0.85, '{"x_min": 120, "y_min": 80, "x_max": 180, "y_max": 95}', 'medium', TRUE, 245, datetime('now', '-5 days')),
('/static/uploads/sample2.jpg', 'dent', 0.72, '{"x_min": 200, "y_min": 150, "x_max": 230, "y_max": 170}', 'medium', TRUE, 312, datetime('now', '-4 days')),
('/static/uploads/sample3.jpg', 'normal', 0.95, '{}', 'none', FALSE, 198, datetime('now', '-4 days')),
('/static/uploads/sample4.jpg', 'crack', 0.91, '{"x_min": 45, "y_min": 60, "x_max": 48, "y_max": 120}', 'high', TRUE, 267, datetime('now', '-3 days')),
('/static/uploads/sample5.jpg', 'stain', 0.68, '{"x_min": 300, "y_min": 200, "x_max": 350, "y_max": 240}', 'low', FALSE, 189, datetime('now', '-3 days')),
('/static/uploads/sample6.jpg', 'normal', 0.92, '{}', 'none', FALSE, 156, datetime('now', '-2 days')),
('/static/uploads/sample7.jpg', 'scratch', 0.78, '{"x_min": 80, "y_min": 40, "x_max": 200, "y_max": 42}', 'medium', TRUE, 234, datetime('now', '-2 days')),
('/static/uploads/sample8.jpg', 'hole', 0.88, '{"x_min": 150, "y_min": 100, "x_max": 160, "y_max": 110}', 'high', TRUE, 289, datetime('now', '-1 days')),
('/static/uploads/sample9.jpg', 'dent', 0.65, '{"x_min": 400, "y_min": 300, "x_max": 420, "y_max": 315}', 'low', FALSE, 201, datetime('now', '-1 days')),
('/static/uploads/sample10.jpg', 'normal', 0.96, '{}', 'none', FALSE, 167, datetime('now', '0 days'));

-- Insert sample batch data
INSERT INTO inspection_batches (batch_name, total_items, rejected_items, accepted_items, start_time, end_time, status) VALUES
('Morning Batch - Jan 15', 100, 12, 88, datetime('now', '-5 days', '08:00:00'), datetime('now', '-5 days', '12:00:00'), 'completed'),
('Afternoon Batch - Jan 15', 95, 8, 87, datetime('now', '-5 days', '13:00:00'), datetime('now', '-5 days', '17:00:00'), 'completed'),
('Morning Batch - Jan 16', 110, 15, 95, datetime('now', '-4 days', '08:00:00'), datetime('now', '-4 days', '12:00:00'), 'completed'),
('Afternoon Batch - Jan 16', 105, 10, 95, datetime('now', '-4 days', '13:00:00'), datetime('now', '-4 days', '17:00:00'), 'completed'),
('Morning Batch - Jan 17', 98, 9, 89, datetime('now', '-3 days', '08:00:00'), datetime('now', '-3 days', '12:00:00'), 'completed'),
('Current Batch - Today', 45, 5, 40, datetime('now', '08:00:00'), NULL, 'in_progress');

-- Insert sample feedback
INSERT INTO user_feedback (detection_id, is_correct, correct_defect_type, feedback_text) VALUES
(1, 1, NULL, 'Detection correct'),
(2, 0, 'deep_scratch', 'This was actually a deep scratch, not a dent'),
(4, 1, NULL, 'Crack detected accurately'),
(5, 1, NULL, 'Stain detected correctly'),
(7, 0, 'normal', 'False positive - no defect present');