from app.database import SessionLocal
from app.models import User, Student, Attendance

def delete_all_students():
    db = SessionLocal()
    try:
        print("Starting deletion process...")

        # 1. Delete all Attendance records (as they depend on Students)
        num_attendance = db.query(Attendance).delete()
        print(f"Deleted {num_attendance} Attendance records.")

        # 2. Delete all Student records
        num_students = db.query(Student).delete()
        print(f"Deleted {num_students} Student records.")

        # 3. Delete all Users with role 'student'
        # Note: We need to be careful not to delete admins or teachers if they exist
        num_users = db.query(User).filter(User.role == "student").delete()
        print(f"Deleted {num_users} User records (role='student').")

        db.commit()
        print("Deletion completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    delete_all_students()
