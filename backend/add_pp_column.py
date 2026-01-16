from app.database import engine
from sqlalchemy import text

def add_pp_column():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE students ADD COLUMN profile_picture VARCHAR"))
            conn.commit()
            print("Successfully added profile_picture column to students table")
        except Exception as e:
            print(f"Error adding column (might already exist): {e}")

if __name__ == "__main__":
    add_pp_column()
