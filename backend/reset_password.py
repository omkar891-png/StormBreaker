from app.database import SessionLocal
from app.models import User
from app.security import get_password_hash

def reset_password():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "admin_test_1@stormbreaker.com").first()
    if user:
        new_password = "admin123"
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        print(f"Password for {user.email} has been reset to: {new_password}")
    else:
        print("User not found.")
    db.close()

if __name__ == "__main__":
    reset_password()
