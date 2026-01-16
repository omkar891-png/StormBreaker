import sqlite3

def add_column():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN profile_picture VARCHAR")
        print("Column 'profile_picture' added successfully.")
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_column()
