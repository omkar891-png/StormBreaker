from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime

client = TestClient(app)

def test_phase3_flow():
    # 1. Login
    email = "admin_test_1@stormbreaker.com"
    password = "adminpassword"
    
    # Ensure user exists (reuse from phase 1 or create)
    client.post("/auth/signup", json={"email": email, "password": password})
    
    login_res = client.post("/auth/login", data={"username": email, "password": password})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get Dashboard Stats
    res = client.get("/reports/dashboard-stats", headers=headers)
    assert res.status_code == 200, f"Stats failed: {res.text}"
    stats = res.json()
    print("Dashboard Stats:", stats)
    assert "total_students" in stats
    assert "present_today" in stats
    
    # 3. Get Attendance History
    res = client.get("/reports/attendance-history", headers=headers)
    assert res.status_code == 200
    print("Attendance History:", res.json())
    
    # 4. Get Defaulters
    res = client.get("/reports/defaulters", headers=headers)
    assert res.status_code == 200
    print(f"Found {len(res.json())} potential defaulters")

if __name__ == "__main__":
    test_phase3_flow()
