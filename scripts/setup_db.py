#!/usr/bin/env python3
"""
Database Setup Script
Initializes database and runs migrations
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.app.database import engine, Base
from backend.app.models import Detection, DefectType, InspectionBatch, SystemSetting, Feedback
import sqlite3
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_database():
    """Create all database tables"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully!")
        
        # Verify tables
        conn = sqlite3.connect("backend/database/defect_system.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        logger.info(f"Created tables: {[t[0] for t in tables]}")
        
        conn.close()
        
    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        raise

def run_migrations():
    """Run SQL migration files"""
    migration_dir = "database/migrations"
    
    if os.path.exists(migration_dir):
        conn = sqlite3.connect("backend/database/defect_system.db")
        cursor = conn.cursor()
        
        for migration_file in sorted(os.listdir(migration_dir)):
            if migration_file.endswith('.sql'):
                logger.info(f"Running migration: {migration_file}")
                
                with open(os.path.join(migration_dir, migration_file), 'r') as f:
                    sql_script = f.read()
                    
                try:
                    cursor.executescript(sql_script)
                    conn.commit()
                    logger.info(f"Migration {migration_file} completed")
                except Exception as e:
                    logger.error(f"Migration {migration_file} failed: {e}")
        
        conn.close()

def seed_sample_data():
    """Insert sample data for testing"""
    try:
        import subprocess
        result = subprocess.run(
            ["python", "scripts/generate_sample_data.py"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            logger.info("Sample data seeded successfully")
        else:
            logger.error(f"Seeding failed: {result.stderr}")
            
    except Exception as e:
        logger.error(f"Error seeding data: {e}")

if __name__ == "__main__":
    logger.info("Starting database setup...")
    setup_database()
    run_migrations()
    seed_sample_data()
    logger.info("Database setup complete!")