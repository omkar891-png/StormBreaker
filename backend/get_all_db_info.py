from app.database import SessionLocal
from app.models import User, Student, Attendance, Exam, Notification

def get_all_info():
    db = SessionLocal()
    with open("db_info_output.txt", "w", encoding="utf-8") as f:
        f.write("=== DATABASE CONTENTS ===\n\n")

        # Users
        users = db.query(User).all()
        f.write(f"--- Users ({len(users)}) ---\n")
        for u in users:
            f.write(f"ID: {u.id} | Email: {u.email} | Role: {u.role}\n")
        f.write("\n")

        # Students
        students = db.query(Student).all()
        f.write(f"--- Students ({len(students)}) ---\n")
        for s in students:
            f.write(f"ID: {s.id} | Name: {s.full_name} | Roll: {s.roll_number} | Dept: {s.department} | Year: {s.year} | UserID: {s.user_id} | Profile Complete: {s.is_profile_complete}\n")
        f.write("\n")

        # Attendance
        attendance = db.query(Attendance).all()
        f.write(f"--- Attendance ({len(attendance)}) ---\n")
        for a in attendance:
            f.write(f"ID: {a.id} | StudentID: {a.student_id} | Status: {a.status} | Time: {a.timestamp} | Subject: {a.subject} | Confidence: {a.verification_confidence}\n")
        f.write("\n")

        # Exams
        exams = db.query(Exam).all()
        f.write(f"--- Exams ({len(exams)}) ---\n")
        for e in exams:
            f.write(f"ID: {e.id} | Name: {e.name} | Subject: {e.subject} | Date: {e.date}\n")
        f.write("\n")

        # Notifications
        notifications = db.query(Notification).all()
        f.write(f"--- Notifications ({len(notifications)}) ---\n")
        for n in notifications:
            f.write(f"ID: {n.id} | Title: {n.title} | Message: {n.message} | Is Read: {n.is_read} | Date: {n.date}\n")
        f.write("\n")

    db.close()

if __name__ == "__main__":
    get_all_info()
