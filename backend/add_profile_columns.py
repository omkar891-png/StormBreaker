from app.database import engine
from sqlalchemy import text

def add_column():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE students ADD COLUMN is_profile_complete BOOLEAN DEFAULT 0"))
            conn.commit()
            print("Successfully added is_profile_complete column to students table")
        except Exception as e:
            print(f"Error adding column (might already exist): {e}")

if __name__ == "__main__":
    add_column()
