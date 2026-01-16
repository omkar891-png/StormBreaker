import sqlite3
import os

def check_db(db_path):
    print(f"\nChecking DB: {db_path}")
    if not os.path.exists(db_path):
        print("File does not exist.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, email, role FROM users")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} users:")
        for row in rows:
            print(row)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_db("sql_app.db")
    check_db("backend/sql_app.db")
