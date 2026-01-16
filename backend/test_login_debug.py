from fastapi.testclient import TestClient
from app.main import app
from app.schemas import UserCreate
import requests

client = TestClient(app)

def test_login(email, password, dept=None, year=None):
    print(f"\nAttempting login with {email} / {password} | Dept: {dept}, Year: {year}")
    
    data = {"username": email, "password": password}
    if dept: data["department"] = dept
    if year: data["year"] = year
    
    try:
        response = client.post("/auth/login", data=data)
        if response.status_code == 200:
            print(f"SUCCESS: Login for {email} successful!")
            print("Token:", response.json().get("access_token"))
        else:
            print(f"FAILURE: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_login("admin@s.com", "admin")
    test_login("testbatch1@sb.com", "pass123", "CS", "FY")
