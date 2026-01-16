from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    roll_number = Column(String, unique=True, index=True)
    department = Column(String)
    # We might want to store a reference to the image path if we save it locally too,
    # but the ML service handles the face match.
    created_at = Column(DateTime, default=datetime.utcnow)

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
