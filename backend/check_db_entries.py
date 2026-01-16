from app.database import SessionLocal
from app.models import User, Student

def check_db():
    db = SessionLocal()
    
    print("\n--- Users ---")
    users = db.query(User).all()
    if not users:
        print("No users found.")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Role: {user.role}")

    print("\n--- Students ---")
    students = db.query(Student).all()
    if not students:
        print("No students found.")
    for student in students:
        print(f"ID: {student.id}, Name: {student.full_name}, Roll No: {student.roll_number}, Dept: {student.department}, Year: {student.year}, UserID: {student.user_id}")

    print("\n--- Attendance ---")
    from app.models import Attendance
    attendance = db.query(Attendance).all()
    if not attendance:
        print("No attendance records found.")
    for record in attendance:
        print(f"ID: {record.id}, StudentID: {record.student_id}, Subject: {record.subject}, Status: {record.status}, Time: {record.timestamp}")

    db.close()

if __name__ == "__main__":
    check_db()
