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
    
    # Count teachers (Users with role='faculty' or 'teacher')
    total_teachers = db.query(models.User).filter(models.User.role.in_(["faculty", "teacher"])).count()
    
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

@router.get("/faculty-stats")
def get_faculty_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    teacher = crud.get_teacher_by_user_id(db, user_id=current_user.id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    
    teacher_subjects = [s.strip() for s in teacher.subjects.split(',')]
    today = datetime.utcnow().date()
    
    # 1. Lectures Today: Count active or recently ended LiveSessions for this teacher today
    lectures_today = db.query(models.LiveSession).filter(
        models.LiveSession.teacher_id == teacher.id,
        func.date(models.LiveSession.start_time) == today
    ).count()
    
    # 2. Avg Attendance for this teacher's sessions
    # Total Present vs Total Students expected across all sessions this teacher has held
    sessions = db.query(models.LiveSession).filter(
        models.LiveSession.teacher_id == teacher.id,
        models.LiveSession.is_active == False
    ).all()
    
    total_present = 0
    total_possible = 0
    
    if sessions:
        for sess in sessions:
            # Count PRESENT status for this session
            present_count = db.query(models.Attendance).filter(
                models.Attendance.session_id == sess.id,
                models.Attendance.status == "PRESENT"
            ).count()
            
            # Count total students in that session's Dept/Year
            class_strength = db.query(models.Student).filter(
                models.Student.department == sess.department,
                models.Student.year == sess.year
            ).count()
            
            total_present += present_count
            total_possible += class_strength
    
    avg_attendance = round((total_present / total_possible * 100), 1) if total_possible > 0 else 0
    
    return {
        "full_name": teacher.full_name,
        "department": teacher.department,
        "subjects": teacher.subjects,
        "lectures_today": lectures_today,
        "avg_attendance": avg_attendance,
        "total_subjects": len(teacher_subjects)
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
    threshold: int = 75,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    all_students = db.query(models.Student).all()
    defaulters = []
    
    for student in all_students:
        # 1. Count PRESENT records for this student
        present_count = db.query(models.Attendance).filter(
            models.Attendance.student_id == student.id,
            models.Attendance.status == "PRESENT"
        ).count()
        
        # 2. Count total sessions held for this student's class
        total_sessions = db.query(models.LiveSession).filter(
            models.LiveSession.department == student.department,
            models.LiveSession.year == student.year,
            models.LiveSession.is_active == False
        ).count()
        
        # Avoid division by zero
        total_classes = max(total_sessions, 1)
        attendance_percentage = (present_count / total_classes) * 100
        
        if attendance_percentage < threshold:
            defaulters.append({
                "student_id": student.id,
                "name": student.full_name,
                "roll_number": student.roll_number,
                "attendance_count": present_count,
                "percentage": round(attendance_percentage, 1)
            })
            
    return defaulters

@router.get("/student-stats")
def get_student_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    student = crud.get_student_by_user_id(db, user_id=current_user.id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Total attendance count
    attendance_records = db.query(models.Attendance).filter(
        models.Attendance.student_id == student.id
    ).order_by(models.Attendance.timestamp.desc()).all()
    
    total_present = len([r for r in attendance_records if r.status == "PRESENT"])
    
    # Calculate real attendance percentage
    # Count sessions that were held for this student's department, year, and (optionally) division
    total_sessions = db.query(models.LiveSession).filter(
        models.LiveSession.department == student.department,
        models.LiveSession.year == student.year,
        models.LiveSession.is_active == False # Only count finished sessions
    ).count()
    
    # Alternatively, if LiveSession history is empty, fallback to a sensible minimum or count unique subject-date combos in Attendance
    if total_sessions == 0:
        # Fallback to counting unique sessions in the attendance table for this student's groups
        total_sessions = db.query(models.Attendance.subject, func.date(models.Attendance.timestamp)).join(models.Student).filter(
            models.Student.department == student.department,
            models.Student.year == student.year
        ).distinct().count()

    total_classes = max(total_sessions, 1) # Avoid division by zero
    attendance_percentage = min(100, (total_present / total_classes) * 100)
    
    # Last marked attendance
    last_marked = None
    if attendance_records:
        last_rec = attendance_records[0]
        last_marked = {
            "subject": last_rec.subject,
            "timestamp": last_rec.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
    
    # Subject-wise attendance
    subject_stats = {}
    for rec in attendance_records:
        subject_stats[rec.subject] = subject_stats.get(rec.subject, 0) + 1
        
    # Formatting for frontend
    formatted_subject_stats = [
        {"subject": sub, "count": count} for sub, count in subject_stats.items()
    ]
    
    return {
        "full_name": student.full_name,
        "roll_number": student.roll_number,
        "department": student.department,
        "year": student.year,
        "division": student.division,
        "attendance_percentage": round(attendance_percentage, 1),
        "total_present": total_present,
        "last_marked": last_marked,
        "subject_stats": formatted_subject_stats,
        "is_profile_complete": student.is_profile_complete
    }
