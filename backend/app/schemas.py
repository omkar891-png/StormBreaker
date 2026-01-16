from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AttendanceBase(BaseModel):
    subject: str

class AttendanceCreate(AttendanceBase):
    student_id: int
    status: str
    verification_confidence: float

class StudentBase(BaseModel):
    full_name: str
    roll_number: str
    department: str
    year: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class Attendance(AttendanceBase):
    id: int
    student_id: int
    timestamp: datetime
    status: str
    verification_confidence: str  
    student: Optional[StudentBase] = None

    class Config:
        from_attributes = True

class Student(StudentBase):
    id: int
    created_at: datetime
    is_profile_complete: bool
    profile_picture: Optional[str] = None
    attendance_records: List[Attendance] = []

    class Config:
        from_attributes = True

class VerificationResponse(BaseModel):
    matched: bool
    student_id: Optional[str] = None
    confidence: float
    message: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    id: int

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    name: str
    date: datetime
    subject: str

class ExamCreate(ExamBase):
    pass

class Exam(ExamBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    date: datetime
    is_read: str
    class Config:
        from_attributes = True



class TeacherBase(BaseModel):
    full_name: str
    phone: str
    department: str
    subjects: str

class TeacherCreate(TeacherBase):
    email: str
    password: str

class Teacher(TeacherBase):
    id: int
    user_id: int
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
