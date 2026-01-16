from app.database import SessionLocal
from app.models import User
from app.security import verify_password, get_password_hash

def check_user_pass():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "testbatch1@sb.com").first()
    if user:
        print(f"User: {user.email}")
        print(f"Hashed: {user.hashed_password}")
        
        test_pass = "pass123"
        result = verify_password(test_pass, user.hashed_password)
        print(f"Verification for '{test_pass}': {result}")
        
        # Also check admin for comparison
        admin = db.query(User).filter(User.email == "admin@s.com").first()
        if admin:
             print(f"Admin Verification for 'admin': {verify_password('admin', admin.hashed_password)}")
    else:
        print("User not found")
    db.close()

if __name__ == "__main__":
    check_user_pass()
