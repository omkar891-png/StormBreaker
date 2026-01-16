import requests

def verify_login():
    url = "http://localhost:8000/auth/login"
    payload = {
        "username": "admin_test_1@stormbreaker.com",
        "password": "admin123"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    try:
        print(f"Sending POST to {url}...")
        response = requests.post(url, data=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_login()
