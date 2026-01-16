from app.database import SessionLocal
from app.models import Student, User

def list_students():
    db = SessionLocal()
    try:
        students = db.query(Student).all()
        print(f"Found {len(students)} students:")
        for student in students:
            user = db.query(User).filter(User.id == student.user_id).first()
            email = user.email if user else "No User"
            print(f"ID: {student.id} | Name: {student.full_name} | Email: {email} | Dept: '{student.department}' | Year: '{student.year}' | UserID: {student.user_id}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_students()
