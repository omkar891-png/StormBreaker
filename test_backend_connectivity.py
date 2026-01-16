import requests
import sys

def check_url(url):
    try:
        print(f"Checking {url}...")
        response = requests.get(url, timeout=2)
        print(f"Success! Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Failed to connect to {url}: {e}")
        return False

print("--- Connectivity Test ---")
backend_alive = check_url("http://127.0.0.1:8000/")
if not backend_alive:
    backend_alive = check_url("http://localhost:8000/")

if backend_alive:
    print("Backend is reachable.")
else:
    print("Backend is NOT reachable.")
    sys.exit(1)
