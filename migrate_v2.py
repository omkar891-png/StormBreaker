import sqlite3
import os

def migrate():
    db_path = 'd:\\attendence\\StormBreaker\\sql_app.db'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Add division to students table
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN division VARCHAR")
        print("Column 'division' added to 'students' table.")
    except sqlite3.OperationalError as e:
        print(f"Skipping 'division' for students: {e}")

    # 2. Add session_id to attendance table
    try:
        cursor.execute("ALTER TABLE attendance ADD COLUMN session_id INTEGER")
        # Optional: Add foreign key constraint if possible (SQLite doesn't support adding FKs to existing tables easily)
        print("Column 'session_id' added to 'attendance' table.")
    except sqlite3.OperationalError as e:
        print(f"Skipping 'session_id' for attendance: {e}")
        
    conn.commit()
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
