

# User Manual - Defect Detection System

## Getting Started

1. **Start Backend Server**
   - Run `scripts/start_backend.bat` (Windows) or `python backend/run.py`
   - Server starts at `http://localhost:8000`

2. **Start Frontend Application**
   - Run `scripts/start_frontend.bat` (Windows) or `npm start` in frontend folder
   - App opens at `http://localhost:3000`

## Features

### Dashboard
- View key metrics (total inspections, defects found, acceptance rate)
- See defect distribution charts
- Monitor recent detections

### Live Detection
- **Upload Image**: Click upload area to select image file
- **Camera Capture**: Use webcam to capture real-time images
- **View Results**: See defect type, confidence, severity
- **Reject Item**: Manually reject detected defective items

### History
- View all past detections
- Filter by defect type, severity, date range
- Export data to CSV/JSON/PDF

### Analytics
- View daily trends and patterns
- Analyze defect type distribution
- Monitor system performance metrics

### Settings
- Adjust confidence threshold
- Configure auto-reject rules
- Reset to default settings

## Tips
- Use clear, well-lit images for best results
- Minimum image size: 320x320 pixels
- Supported formats: JPG, JPEG, PNG
- Maximum file size: 10MB

## Troubleshooting
- **Connection Error**: Ensure backend is running on port 8000
- **Slow Detection**: Model runs on CPU; expect 200-500ms per image
- **No Defects Found**: Adjust confidence threshold lower