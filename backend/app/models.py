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
    division = Column(String, nullable=True)
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
    session_id = Column(Integer, ForeignKey("live_sessions.id"), nullable=True)
    
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


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    department = Column(String)
    credits = Column(Integer, default=3)
    type = Column(String, default="Core") # Core, Theory, Elective, Lab

class ClassGroup(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g. SY-CS-A
    department = Column(String)
    year = Column(String) # FY, SY, TY, BE
    division = Column(String)
    class_teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)

class SubjectAssignment(Base):
    __tablename__ = "subject_assignments"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    phone = Column(String)
    department = Column(String)
    subjects = Column(String) # Comma separated for now
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User")
    live_sessions = relationship("LiveSession", back_populates="teacher")

class LiveSession(Base):
    __tablename__ = "live_sessions"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    subject = Column(String)
    department = Column(String)
    year = Column(String) # FY, SY, TY, BE
    division = Column(String)
    is_active = Column(Boolean, default=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

    teacher = relationship("Teacher", back_populates="live_sessions")
class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    marks_obtained = Column(Integer)
    total_marks = Column(Integer, default=100)
    exam_type = Column(String) # e.g., "Internal", "Final", "Assignment"
    semester = Column(String)
    academic_year = Column(String)
    date_declared = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student")
    subject = relationship("Subject")

class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    day_of_week = Column(String) # Monday, Tuesday, etc.
    start_time = Column(String) # e.g., "09:00"
    end_time = Column(String)   # e.g., "10:00"
    room_number = Column(String)

    class_group = relationship("ClassGroup")
    subject = relationship("Subject")
    teacher = relationship("Teacher")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    due_date = Column(DateTime)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    class_id = Column(Integer, ForeignKey("classes.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    subject = relationship("Subject")
    teacher = relationship("Teacher")
    class_group = relationship("ClassGroup")
    submissions = relationship("Submission", back_populates="assignment")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    content = Column(String) # Can be a link or text
    submitted_at = Column(DateTime, default=datetime.utcnow)
    marks_awarded = Column(Integer, nullable=True)
    feedback = Column(String, nullable=True)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student")

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    reason = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED
    applied_at = Column(DateTime, default=datetime.utcnow)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    student = relationship("Student")
