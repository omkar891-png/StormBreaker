from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from . import models, schemas
from .security import get_password_hash


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

def get_teacher_by_user_id(db: Session, user_id: int):
    return db.query(models.Teacher).filter(models.Teacher.user_id == user_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(
        full_name=student.full_name,
        roll_number=student.roll_number,
        department=student.department,
        year=student.year,
        division=student.division
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
        subject=attendance.subject,
        session_id=attendance.session_id
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


def get_attendance_records(db: Session, skip: int = 0, limit: int = 100, subjects: list[str] = None, session_id: int = None):
    query = db.query(models.Attendance).options(joinedload(models.Attendance.student))
    if subjects:
        query = query.filter(models.Attendance.subject.in_(subjects))
    if session_id:
        query = query.filter(models.Attendance.session_id == session_id)
    return query.order_by(models.Attendance.timestamp.desc()).offset(skip).limit(limit).all()

def get_teachers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Teacher).options(joinedload(models.Teacher.user)).offset(skip).limit(limit).all()

def create_teacher(db: Session, teacher: schemas.TeacherCreate):
    # 1. Create User
    hashed_password = get_password_hash(teacher.password)
    db_user = models.User(email=teacher.email, hashed_password=hashed_password, role="faculty")
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

def get_subjects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Subject).offset(skip).limit(limit).all()

def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

def get_classes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ClassGroup).offset(skip).limit(limit).all()

def create_class(db: Session, class_group: schemas.ClassGroupCreate):
    db_class = models.ClassGroup(**class_group.model_dump())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

def create_live_session(db: Session, session: schemas.LiveSessionCreate):
    db_session = models.LiveSession(
        teacher_id=session.teacher_id,
        subject=session.subject,
        department=session.department,
        year=session.year,
        division=session.division,
        is_active=True
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_active_live_sessions(db: Session, department: str = None, year: str = None, division: str = None):
    query = db.query(models.LiveSession).filter(models.LiveSession.is_active == True)
    if department:
        query = query.filter(models.LiveSession.department == department)
    if year:
        query = query.filter(models.LiveSession.year == year)
    if division:
        query = query.filter(models.LiveSession.division == division)
    return query.all()

def end_live_session(db: Session, session_id: int):
    db_session = db.query(models.LiveSession).filter(models.LiveSession.id == session_id).first()
    if db_session:
        # 1. Mark session as inactive
        db_session.is_active = False
        db_session.end_time = datetime.utcnow()
        db.commit()

        # 2. Mark non-attending students as ABSENT
        # Find all students in this department and year
        all_students = db.query(models.Student).filter(
            models.Student.department == db_session.department,
            models.Student.year == db_session.year
        ).all()

        # Get IDs of students who are already PRESENT (or have any record for this session)
        present_student_ids = db.query(models.Attendance.student_id).filter(
            models.Attendance.session_id == session_id
        ).all()
        present_student_ids = [r[0] for r in present_student_ids]

        # For every student not in the present list, create an ABSENT record
        for student in all_students:
            if student.id not in present_student_ids:
                absent_record = models.Attendance(
                    student_id=student.id,
                    session_id=session_id,
                    status="ABSENT",
                    verification_confidence="0.0",
                    subject=db_session.subject,
                    timestamp=datetime.utcnow()
                )
                db.add(absent_record)
        
        db.commit()
        db.refresh(db_session)
    return db_session

# ============ RESULTS ============
def create_result(db: Session, result: schemas.ResultCreate):
    db_result = models.Result(**result.model_dump())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_results_by_student(db: Session, student_id: int):
    return db.query(models.Result).filter(models.Result.student_id == student_id).all()

def get_results_by_class(db: Session, department: str, year: str, semester: str):
    students = db.query(models.Student).filter(
        models.Student.department == department,
        models.Student.year == year
    ).all()
    student_ids = [s.id for s in students]
    return db.query(models.Result).filter(
        models.Result.student_id.in_(student_ids),
        models.Result.semester == semester
    ).all()

def update_result(db: Session, result_id: int, marks_obtained: int):
    db_result = db.query(models.Result).filter(models.Result.id == result_id).first()
    if db_result:
        db_result.marks_obtained = marks_obtained
        db.commit()
        db.refresh(db_result)
    return db_result

# ============ TIMETABLE ============
def create_timetable_entry(db: Session, timetable: schemas.TimetableCreate):
    db_timetable = models.Timetable(**timetable.model_dump())
    db.add(db_timetable)
    db.commit()
    db.refresh(db_timetable)
    return db_timetable

def get_timetable_by_class(db: Session, class_id: int):
    return db.query(models.Timetable).filter(models.Timetable.class_id == class_id).all()

def get_timetable_by_teacher(db: Session, teacher_id: int):
    return db.query(models.Timetable).filter(models.Timetable.teacher_id == teacher_id).all()

def delete_timetable_entry(db: Session, timetable_id: int):
    db_timetable = db.query(models.Timetable).filter(models.Timetable.id == timetable_id).first()
    if db_timetable:
        db.delete(db_timetable)
        db.commit()
    return db_timetable

# ============ ASSIGNMENTS ============
def create_assignment(db: Session, assignment: schemas.AssignmentCreate):
    db_assignment = models.Assignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

def get_assignments_by_class(db: Session, class_id: int):
    return db.query(models.Assignment).filter(models.Assignment.class_id == class_id).order_by(models.Assignment.due_date.desc()).all()

def get_assignments_by_teacher(db: Session, teacher_id: int):
    return db.query(models.Assignment).filter(models.Assignment.teacher_id == teacher_id).order_by(models.Assignment.due_date.desc()).all()

def get_assignment(db: Session, assignment_id: int):
    return db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()

def delete_assignment(db: Session, assignment_id: int):
    db_assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if db_assignment:
        db.delete(db_assignment)
        db.commit()
    return db_assignment

# ============ SUBMISSIONS ============
def create_submission(db: Session, submission: schemas.SubmissionCreate):
    db_submission = models.Submission(**submission.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_submissions_by_assignment(db: Session, assignment_id: int):
    return db.query(models.Submission).filter(models.Submission.assignment_id == assignment_id).all()

def get_submissions_by_student(db: Session, student_id: int):
    return db.query(models.Submission).filter(models.Submission.student_id == student_id).all()

def update_submission_marks(db: Session, submission_id: int, marks_awarded: int, feedback: str = None):
    db_submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if db_submission:
        db_submission.marks_awarded = marks_awarded
        if feedback:
            db_submission.feedback = feedback
        db.commit()
        db.refresh(db_submission)
    return db_submission

# ============ LEAVE REQUESTS ============
def create_leave_request(db: Session, leave_request: schemas.LeaveRequestCreate):
    db_leave = models.LeaveRequest(**leave_request.model_dump())
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

def get_leave_requests(db: Session, status: str = None, skip: int = 0, limit: int = 100):
    query = db.query(models.LeaveRequest)
    if status:
        query = query.filter(models.LeaveRequest.status == status)
    return query.order_by(models.LeaveRequest.applied_at.desc()).offset(skip).limit(limit).all()

def get_leave_requests_by_student(db: Session, student_id: int):
    return db.query(models.LeaveRequest).filter(models.LeaveRequest.student_id == student_id).order_by(models.LeaveRequest.applied_at.desc()).all()

def update_leave_request_status(db: Session, leave_id: int, status: str, approved_by: int = None):
    db_leave = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == leave_id).first()
    if db_leave:
        db_leave.status = status
        if approved_by:
            db_leave.approved_by = approved_by
        db.commit()
        db.refresh(db_leave)
    return db_leave
