from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AttendanceBase(BaseModel):
    subject: str
    session_id: Optional[int] = None

class AttendanceCreate(AttendanceBase):
    student_id: int
    status: str
    verification_confidence: float

class StudentBase(BaseModel):
    full_name: str
    roll_number: str
    department: str
    year: Optional[str] = None
    division: Optional[str] = None

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



class SubjectBase(BaseModel):
    name: str
    code: str
    department: str
    credits: int = 3
    type: str = "Core"

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    class Config:
        from_attributes = True

class ClassGroupBase(BaseModel):
    name: str
    department: str
    year: str
    division: str

class ClassGroupCreate(ClassGroupBase):
    class_teacher_id: Optional[int] = None

class ClassGroup(ClassGroupBase):
    id: int
    class_teacher_id: Optional[int] = None
    class Config:
        from_attributes = True

class SubjectAssignmentBase(BaseModel):
    subject_id: int
    teacher_id: int
    class_id: int

class SubjectAssignmentCreate(SubjectAssignmentBase):
    pass

class SubjectAssignment(SubjectAssignmentBase):
    id: int
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

class LiveSessionBase(BaseModel):
    subject: str
    department: str
    year: str
    division: str

class LiveSessionCreate(LiveSessionBase):
    teacher_id: int

class LiveSession(LiveSessionBase):
    id: int
    teacher_id: int
    is_active: bool
    start_time: datetime
    end_time: Optional[datetime] = None

    class Config:
        from_attributes = True
class ResultBase(BaseModel):
    student_id: int
    subject_id: int
    marks_obtained: int
    total_marks: int = 100
    exam_type: str
    semester: str
    academic_year: str

class ResultCreate(ResultBase):
    pass

class Result(ResultBase):
    id: int
    date_declared: datetime
    class Config:
        from_attributes = True

class TimetableBase(BaseModel):
    class_id: int
    subject_id: int
    teacher_id: int
    day_of_week: str
    start_time: str
    end_time: str
    room_number: str

class TimetableCreate(TimetableBase):
    pass

class Timetable(TimetableBase):
    id: int
    class Config:
        from_attributes = True

class AssignmentBase(BaseModel):
    title: str
    description: str
    due_date: datetime
    subject_id: int
    teacher_id: int
    class_id: int

class AssignmentCreate(AssignmentBase):
    pass

class Assignment(AssignmentBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    assignment_id: int
    student_id: int
    content: str

class SubmissionCreate(SubmissionBase):
    pass

class Submission(SubmissionBase):
    id: int
    submitted_at: datetime
    marks_awarded: Optional[int] = None
    feedback: Optional[str] = None
    class Config:
        from_attributes = True

class LeaveRequestBase(BaseModel):
    student_id: int
    reason: str
    start_date: datetime
    end_date: datetime

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequest(LeaveRequestBase):
    id: int
    status: str
    applied_at: datetime
    approved_by: Optional[int] = None
    class Config:
        from_attributes = True
