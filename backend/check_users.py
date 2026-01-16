from app.database import SessionLocal
from app.models import User

def check_users():
    db = SessionLocal()
    users = db.query(User).all()
    print(f"Total Users: {len(users)}")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Role: {user.role}, Password Hash starts with: {user.hashed_password[:10]}")
    db.close()

if __name__ == "__main__":
    check_users()
