from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="admin") # admin, teacher, student


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    roll_number = Column(String, unique=True, index=True)
    department = Column(String)
    year = Column(String)
    user_id = Column(Integer, ForeignKey("users.id")) # Link to User
    profile_picture = Column(String, nullable=True)
    is_profile_complete = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    attendance_records = relationship("Attendance", back_populates="student")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String) # e.g., "PRESENT", "ABSENT" (though this table is mostly for PRESENT logs)
    verification_confidence = Column(String) # Store confidence score from ML
    subject = Column(String)
    
    student = relationship("Student", back_populates="attendance_records")

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(DateTime)
    subject = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    is_read = Column(String, default="false") # 'true' or 'false'


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    phone = Column(String)
    department = Column(String)
    subjects = Column(String) # Comma separated for now
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User")
