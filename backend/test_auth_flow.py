from fastapi.testclient import TestClient
from app.main import app
import os

# Remove db if exists to verify fresh start or just expect errors if dup
# if os.path.exists("sql_app.db"):
#     os.remove("sql_app.db") 
# Actually, better to just use a random email

client = TestClient(app)

def test_auth_flow():
    email = "admin_test_1@stormbreaker.com"
    password = "adminpassword"

    # 1. Signup
    response = client.post(
        "/auth/signup",
        json={"email": email, "password": password},
    )
    if response.status_code == 400 and "already registered" in response.text:
        print("User already exists, proceeding to login...")
    else:
        assert response.status_code == 200
        print("Signup successful")

    # 2. Login
    response = client.post(
        "/auth/login",
        data={"username": email, "password": password},
    )
    assert response.status_code == 200
    token = response.json()
    assert "access_token" in token
    print(f"Login successful. Token: {token['access_token'][:20]}...")

if __name__ == "__main__":
    test_auth_flow()
