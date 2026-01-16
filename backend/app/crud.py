from sqlalchemy.orm import Session, joinedload
from . import models, schemas
from .security import get_password_hash

# ... existing code ...

def get_exams(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Exam).offset(skip).limit(limit).all()

def create_exam(db: Session, exam: schemas.ExamCreate):
    db_exam = models.Exam(name=exam.name, date=exam.date, subject=exam.subject)
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

def delete_exam(db: Session, exam_id: int):
    db_exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if db_exam:
        db.delete(db_exam)
        db.commit()
    return db_exam

def get_notifications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Notification).offset(skip).limit(limit).all()

def create_notification(db: Session, notification: schemas.NotificationCreate):
    db_notification = models.Notification(
        title=notification.title,
        message=notification.message,
        is_read="false"
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_student_by_roll_number(db: Session, roll_number: str):
    return db.query(models.Student).filter(models.Student.roll_number == roll_number).first()

def get_student_by_user_id(db: Session, user_id: int):
    return db.query(models.Student).filter(models.Student.user_id == user_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(
        full_name=student.full_name,
        roll_number=student.roll_number,
        department=student.department,
        year=student.year
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
    return db.query(models.Attendance).options(joinedload(models.Attendance.student)).offset(skip).limit(limit).all()

def get_teachers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Teacher).options(joinedload(models.Teacher.user)).offset(skip).limit(limit).all()

def create_teacher(db: Session, teacher: schemas.TeacherCreate):
    # 1. Create User
    hashed_password = get_password_hash(teacher.password)
    db_user = models.User(email=teacher.email, hashed_password=hashed_password, role="teacher")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 2. Create Teacher profile
    db_teacher = models.Teacher(
        full_name=teacher.full_name,
        phone=teacher.phone,
        department=teacher.department,
        subjects=teacher.subjects,
        user_id=db_user.id
    )
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher
