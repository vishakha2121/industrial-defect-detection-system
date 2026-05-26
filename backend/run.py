#!/usr/bin/env python3
"""
Run the FastAPI application
"""

import uvicorn
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("=" * 50)
    print("Industrial Defect Detection System")
    print("=" * 50)
    print("Starting backend server...")
    print("API Docs will be available at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )