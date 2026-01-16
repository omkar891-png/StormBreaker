import requests

url = "http://127.0.0.1:8000/auth/login"
payload = {
    "username": "admin@s.com", 
    "password": "admin"
}
headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}

try:
    print(f"Testing login at {url} with {payload['username']}")
    response = requests.post(url, data=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
