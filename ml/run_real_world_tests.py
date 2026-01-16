import os
import sys
import json
from face_recognition_module import FaceRecognitionModule

# ANSI Colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

def print_result(test_name, result, expected_match, expected_error=False):
    print(f"\n{YELLOW}--- Test: {test_name} ---{RESET}")
    print(f"Input: {result.get('student_id', 'N/A')}")
    
    status = result.get("status")
    match = result.get("match")
    msg = result.get("message", "")
    distance = result.get("distance", "N/A")
    reason = result.get("reason", "N/A")

    if expected_error:
        if status == "error":
            print(f"{GREEN}[PASS]{RESET} System correctly returned error: {msg}")
        else:
            print(f"{RED}[FAIL]{RESET} Expected error, but got success/match.")
        return

    if status == "error":
        print(f"{RED}[FAIL]{RESET} Unexpected error: {msg}")
        return

    # Success case checks
    if match == expected_match:
        dist_str = f"{distance:.4f}" if isinstance(distance, float) else str(distance)
        print(f"{GREEN}[PASS]{RESET} Result: {match} (Expected: {expected_match}) | Distance: {dist_str}")
        print(f"Reason: {reason}")
    else:
        print(f"{RED}[FAIL]{RESET} Result: {match} (Expected: {expected_match})")
        print(f"Reason: {reason}")

def main():
    print(f"{YELLOW}Starting Comprehensive Real-World Tests{RESET}")
    print("Ensure you have registered 'STUDENT_001' before running this.")
    
    ml = FaceRecognitionModule()
    
    # Define test images - You must provide these!
    # Using the existing one for base check
    base_image = "data/registered_faces/WhatsApp Image 2026-01-16 at 13.40.25.jpeg" 
    
    # Files expected to be added by user
    tests = [
        {
            "name": "1. Same Image (Sanity Check)",
            "image": base_image,
            "id": "STUDENT_001",
            "expect_match": True,
            "expect_error": False
        },
        {
            "name": "2. Same Person, Different Photo",
            "image": "data/test_faces/me_diff.jpg",
            "id": "STUDENT_001",
            "expect_match": True,
            "expect_error": False
        },
        {
            "name": "3. Different Person (Imposter/Proxy)",
            "image": "data/test_faces/imposter.jpg",
            "id": "STUDENT_001",
            "expect_match": False,
            "expect_error": False
        },
        {
            "name": "4. No Face (Object/Wall)",
            "image": "data/test_faces/no_face.jpg",
            "id": "STUDENT_001",
            "expect_match": False,
            "expect_error": True
        },
        {
            "name": "5. Multiple Faces (Group)",
            "image": "data/test_faces/group.jpg",
            "id": "STUDENT_001",
            "expect_match": False,
            "expect_error": True
        }
    ]

    for t in tests:
        if not os.path.exists(t["image"]):
            print(f"\n{YELLOW}--- Test: {t['name']} ---{RESET}")
            print(f"{RED}[SKIPPED]{RESET} File not found: {t['image']}")
            continue

        res = ml.verify_student(t["id"], t["image"])
        print_result(t["name"], res, t["expect_match"], t["expect_error"])

if __name__ == "__main__":
    main()
