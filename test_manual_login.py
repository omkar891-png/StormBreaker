import requests
import sys

# Login details
url = "http://127.0.0.1:8000/auth/login"
payload = {
    "username": "admin@s.com",
    "password": "admin"
}
headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

try:
    print(f"Attempting login to {url} with user '{payload['username']}'...")
    response = requests.post(url, data=payload, headers=headers)
    
    if response.status_code == 200:
        print("Login SUCCESS!")
        print("Response:", response.json())
    else:
        print(f"Login FAILED with status code {response.status_code}")
        print("Response:", response.text)
        sys.exit(1)

except Exception as e:
    print(f"An error occurred: {e}")
    sys.exit(1)
