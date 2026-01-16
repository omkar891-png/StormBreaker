from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime

client = TestClient(app)

def test_phase2_flow():
    # 1. Login to get token
    email = "admin_test_1@stormbreaker.com"
    password = "adminpassword"
    
    # Ensure user exists (reuse from phase 1 or create)
    # If this fails, it might be because the user already exists, which is fine, we just try to login
    client.post("/auth/signup", json={"email": email, "password": password})
    
    login_res = client.post("/auth/login", data={"username": email, "password": password})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create Exam (Protected)
    exam_data = {
        "name": "Mid Term Physics",
        "date": datetime.utcnow().isoformat(),
        "subject": "Physics"
    }
    res = client.post("/exams/", json=exam_data, headers=headers)
    assert res.status_code == 200, f"Create Exam failed: {res.text}"
    exam_id = res.json()["id"]
    print(f"Exam created with ID: {exam_id}")
    
    # 3. List Exams (Public or Protected? We made it public in router but usually it's public for students)
    res = client.get("/exams/")
    assert res.status_code == 200
    exams = res.json()
    assert len(exams) > 0
    print(f"Listed {len(exams)} exams")
    
    # 4. Create Notification (Protected)
    notif_data = {
        "title": "Holiday Alert",
        "message": "No classes tomorrow."
    }
    res = client.post("/notifications/", json=notif_data, headers=headers)
    assert res.status_code == 200, f"Create Notification failed: {res.text}"
    print("Notification created")
    
    # 5. List Notifications
    res = client.get("/notifications/")
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs) > 0
    print(f"Listed {len(notifs)} notifications")

if __name__ == "__main__":
    test_phase2_flow()
