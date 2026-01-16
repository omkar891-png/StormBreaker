import os
import sys
from face_recognition_module import FaceRecognitionModule

def run_tests():
    print("Running Diagnostics on Face Recognition Module...")
    
    # 1. Check Directory Structure
    dirs = ["data/registered_faces", "data/test_faces", "embeddings"]
    for d in dirs:
        if os.path.isdir(d):
            print(f"[OK] Directory exists: {d}")
        else:
            print(f"[FAIL] Directory missing: {d}")

    # 2. Check Database File
    if os.path.exists("embeddings/students.json"):
        print("[OK] Database file exists: embeddings/students.json")
    else:
        print("[FAIL] Database file missing: embeddings/students.json")

    # 3. Check Library Imports
    try:
        import deepface
        import cv2
        import numpy
        print("[OK] Libraries imported successfully (deepface, cv2, numpy)")
    except ImportError as e:
        print(f"[FAIL] Missing library: {e}")
        print("Please run: pip install -r requirements.txt")
        return

    # 4. Functional Test (requires images)
    print("\nTo perform a functional test, please ensure you have:")
    print(" - A clear face image in 'data/registered_faces/sample_A.jpg'")
    print(" - A matching face image in 'data/test_faces/sample_A_verify.jpg'")
    print(" - A non-matching face image in 'data/test_faces/sample_B.jpg'")
    
    response = input("\nDo you want to run the functional test with these files? (y/n): ")
    if response.lower() == 'y':
        reg_img = "data/registered_faces/sample_A.jpg"
        verify_img = "data/test_faces/sample_A_verify.jpg"
        diff_img = "data/test_faces/sample_B.jpg"
        
        if not (os.path.exists(reg_img) and os.path.exists(verify_img)):
            print("[ABORT] Sample images not found. Please add them to run tests.")
            return

        ml = FaceRecognitionModule()
        
        print(f"\n--- Registering {reg_img} as 'TEST_USER' ---")
        reg_res = ml.register_student("TEST_USER", reg_img)
        print(reg_res)
        
        print(f"\n--- Verifying {verify_img} against 'TEST_USER' (Expect Match) ---")
        ver_res = ml.verify_student("TEST_USER", verify_img)
        print(ver_res)
        
        if os.path.exists(diff_img):
            print(f"\n--- Verifying {diff_img} against 'TEST_USER' (Expect Mismatch) ---")
            fail_res = ml.verify_student("TEST_USER", diff_img)
            print(fail_res)

if __name__ == "__main__":
    run_tests()
