import requests
import os

API_URL = "http://localhost:8001"

# Colors
GREEN = "\033[92m"
RED = "\033[91m"
RESET = "\033[0m"

def test_api():
    print("--- Testing Face Recognition API ---")
    
    # 1. Health Check
    try:
        resp = requests.get(f"{API_URL}/")
        if resp.status_code == 200:
             print(f"{GREEN}[PASS] API is Online{RESET}")
        else:
             print(f"{RED}[FAIL] API returned {resp.status_code}{RESET}")
             return
    except requests.exceptions.ConnectionError:
        print(f"{RED}[FAIL] Could not connect to API. Is it running?{RESET}")
        return

    # Prepare data
    # We need images. Let's look for images in ../data/test_faces/ if available, or ask user.
    # Assuming the user has 'imposter.jpg' or similar from previous steps if they followed instructions.
    # We will use the ones we found earlier: 
    #   ../data/test_faces/WhatsApp Image 2026-01-16 at 14.00.23.jpeg (Use this as 'imposter' or 'student')
    
    # Let's verify what files are available
    base_dir = os.path.dirname(os.path.abspath(__file__))
    ml_dir = os.path.dirname(base_dir)
    data_dir = os.path.join(ml_dir, "data")
    
    # We'll valid images dynamically
    test_face_path = None
    
    # Search for any image in registered or test faces
    reg_dir = os.path.join(data_dir, "registered_faces")
    test_dir = os.path.join(data_dir, "test_faces")
    
    for d in [reg_dir, test_dir]:
        if os.path.exists(d):
            files = os.listdir(d)
            for f in files:
                if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                    test_face_path = os.path.join(d, f)
                    break
        if test_face_path: break
    
    if not test_face_path:
        print(f"{RED}[SKIP] No images found to test with.{RESET}")
        return

    print(f"Using test image: {test_face_path}")
    
    # 2. Register Student (API)
    print(f"\n--- Testing Registration (/register) ---")
    student_id = "API_TEST_USER"
    with open(test_face_path, "rb") as f:
        files = {"file": f}
        data = {"student_id": student_id}
        resp = requests.post(f"{API_URL}/register", files=files, data=data)
        
    if resp.status_code == 200:
        print(f"{GREEN}[PASS] Registration Successful{RESET}")
        print(resp.json())
    else:
        print(f"{RED}[FAIL] Registration Failed: {resp.text}{RESET}")

    # 3. Verify Student (API)
    print(f"\n--- Testing Verification (/verify) ---")
    # Using same image should match
    with open(test_face_path, "rb") as f:
        files = {"file": f}
        data = {"student_id": student_id}
        resp = requests.post(f"{API_URL}/verify", files=files, data=data)
        
    if resp.status_code == 200:
        res_json = resp.json()
        if res_json.get("match") == True:
            print(f"{GREEN}[PASS] Verification Matched{RESET}")
        else:
            print(f"{RED}[FAIL] Verification Mismatch (Unexpected for same image){RESET}")
        print(res_json)
    else:
        print(f"{RED}[FAIL] Verification Request Failed: {resp.text}{RESET}")

if __name__ == "__main__":
    test_api()
