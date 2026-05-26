#!/bin/bash

echo "🚀 Setting up Industrial Defect Detection System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create necessary directories
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p backend/database backend/models backend/static/uploads backend/static/results backend/logs
mkdir -p frontend/src frontend/public
mkdir -p logs uploads/images uploads/results uploads/temp

# Setup backend
echo -e "${BLUE}Setting up backend...${NC}"
cd backend
python -m venv venv
source venv/bin/activate || source venv/Scripts/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..

# Setup database
echo -e "${BLUE}Setting up database...${NC}"
python scripts/setup_db.py

# Setup frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend
npm install
cd ..

# Download YOLO model
echo -e "${BLUE}Downloading YOLOv8 model...${NC}"
cd backend/models
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
cd ../..

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "To start the system:"
echo "  Backend:  cd backend && python run.py"
echo "  Frontend: cd frontend && npm start"
echo ""
echo "Or use Docker: docker-compose up --build"