
from app.database import SessionLocal
from app.models import User
from app.security import get_password_hash

def ensure_admin():
    db = SessionLocal()
    email = "admin@stormbreaker.com"
    password = "adminpassword"
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print(f"Creating user {email}...")
        user = User(email=email, hashed_password=get_password_hash(password), role="admin")
        db.add(user)
    else:
        print(f"Updating password for {email}...")
        user.hashed_password = get_password_hash(password)
        user.role = "admin"
        
    db.commit()
    db.close()
    print("Admin user is ready.")

if __name__ == "__main__":
    ensure_admin()
