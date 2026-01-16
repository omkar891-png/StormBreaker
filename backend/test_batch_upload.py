from fastapi.testclient import TestClient
from app.main import app
import io

client = TestClient(app)

def test_batch_upload():
    # 1. Login
    email = "admin_test_1@stormbreaker.com"
    password = "adminpassword"
    
    # Ensure admin exists (idempotent due to logic in signup)
    client.post("/auth/signup", json={"email": email, "password": password})
    login_res = client.post("/auth/login", data={"username": email, "password": password})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Dummy CSV
    csv_content = """name,email,password,roll_number
Test Batch 1,testbatch1@sb.com,pass123,BATCH001
Test Batch 2,testbatch2@sb.com,pass123,BATCH002
"""
    
    # Create file object
    files = {
        "file": ("students.csv", io.BytesIO(csv_content.encode('utf-8')), "text/csv")
    }
    data = {
        "department": "CS",
        "year": "FY"
    }
    
    # 3. Upload
    res = client.post("/students/batch-upload", headers=headers, files=files, data=data)
    print("Upload Response:", res.json())
    assert res.status_code == 200
    assert res.json()["success_count"] == 2
    
    # 4. Verify Students created
    res = client.get("/students/", headers=headers)
    assert res.status_code == 200
    students = res.json()
    batch_students = [s for s in students if "BATCH" in s["roll_number"]]
    print(f"Found {len(batch_students)} batch students")
    assert len(batch_students) >= 2

if __name__ == "__main__":
    test_batch_upload()
