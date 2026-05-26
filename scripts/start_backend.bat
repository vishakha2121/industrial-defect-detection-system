@echo off
echo Starting Industrial Defect Detection Backend...
echo.

cd backend

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI server...
python run.py

pause