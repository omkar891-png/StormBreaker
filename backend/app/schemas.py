from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AttendanceBase(BaseModel):
    subject: str

class AttendanceCreate(AttendanceBase):
    student_id: int
    status: str
    verification_confidence: float

class Attendance(AttendanceBase):
    id: int
    student_id: int
    timestamp: datetime
    status: str
    verification_confidence: str  # Kept as string to match model, or float if we convert

    class Config:
        from_attributes = True

class StudentBase(BaseModel):
    full_name: str
    roll_number: str
    department: str

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    created_at: datetime
    attendance_records: List[Attendance] = []

    class Config:
        from_attributes = True

class VerificationResponse(BaseModel):
    matched: bool
    student_id: Optional[str] = None
    confidence: float
    message: Optional[str] = None
