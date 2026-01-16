from app.database import SessionLocal
from app.models import User
from app.crud import get_user_by_email, create_user
from app.schemas import UserCreate
from app.security import get_password_hash

def create_admin_user():
    db = SessionLocal()
    try:
        email = "admin@s.com"
        password = "admin"
        
        user = get_user_by_email(db, email=email)
        if user:
            print(f"User {email} already exists.")
            # Update password
            user.hashed_password = get_password_hash(password)
            db.commit()
            print(f"Password for {email} updated to '{password}'.")
        else:
            user_create = UserCreate(email=email, password=password)
            user = create_user(db, user_create)
            print(f"Created user {email} with role {user.role}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
