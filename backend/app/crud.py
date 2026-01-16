from sqlalchemy.orm import Session
from . import models, schemas

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_student_by_roll_number(db: Session, roll_number: str):
    return db.query(models.Student).filter(models.Student.roll_number == roll_number).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(
        full_name=student.full_name,
        roll_number=student.roll_number,
        department=student.department
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def create_attendance(db: Session, attendance: schemas.AttendanceCreate):
    db_attendance = models.Attendance(
        student_id=attendance.student_id,
        status=attendance.status,
        verification_confidence=str(attendance.verification_confidence),
        subject=attendance.subject
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_attendance_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Attendance).offset(skip).limit(limit).all()
