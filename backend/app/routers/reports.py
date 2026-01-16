from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from datetime import datetime, date

from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(
    prefix="/reports",
    tags=["reports"],
)

@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    total_students = db.query(models.Student).count()
    total_exams = db.query(models.Exam).count()
    total_notifications = db.query(models.Notification).count()
    
    # Count teachers (Users with role='teacher')
    total_teachers = db.query(models.User).filter(models.User.role == "teacher").count()
    
    # Today's attendance
    today = datetime.utcnow().date()
    present_today = db.query(models.Attendance).filter(
        func.date(models.Attendance.timestamp) == today
    ).distinct(models.Attendance.student_id).count()
    
    # Just an approximation for now
    absent_today = max(0, total_students - present_today)
    
    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_exams": total_exams,
        "total_notifications": total_notifications,
        "present_today": present_today,
        "absent_today": absent_today
    }

@router.get("/attendance-history")
def get_attendance_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Group by date
    # SQLite 'date' function might vary, but standard SQL is usually date(timestamp)
    history = db.query(
        func.date(models.Attendance.timestamp).label('date'),
        func.count(models.Attendance.id).label('count')
    ).group_by(func.date(models.Attendance.timestamp)).all()
    
    return [{"date": str(h.date), "count": h.count} for h in history]

@router.get("/defaulters")
def get_defaulters(
    threshold: int = 75, # Mock threshold (this logic is simplistic without total_classes tracked)
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # For now, we'll return students with very few attendance records
    # Real implementation needs 'total_classes_held' per subject/dep
    
    # Get attendance count per student
    attendance_counts = db.query(
        models.Attendance.student_id,
        func.count(models.Attendance.id).label('present_count')
    ).group_by(models.Attendance.student_id).all()
    
    student_map = {a.student_id: a.present_count for a in attendance_counts}
    
    all_students = db.query(models.Student).all()
    defaulters = []
    
    for student in all_students:
        count = student_map.get(student.id, 0)
        # Mock logic: if count < 5, consider defaulter (placeholder for %)
        if count < 5: 
            defaulters.append({
                "student_id": student.id,
                "name": student.full_name,
                "roll_number": student.roll_number,
                "attendance_count": count
            })
            
    return defaulters
