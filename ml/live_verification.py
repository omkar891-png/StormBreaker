import cv2
import argparse
import time
import os
import json
import sys

# Ensure we can import the module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from face_recognition_module import FaceRecognitionModule

# ANSI Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

def draw_text(img, text, position, color=(0, 255, 0)):
    cv2.putText(img, text, position, cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

def main():
    parser = argparse.ArgumentParser(description="Live Face Verification Testing Tool")
    parser.add_argument("--id", required=True, help="Student ID to verify against")
    args = parser.parse_args()
    
    student_id = args.id
    
    # Initialize ML Module
    print(f"{YELLOW}Initializing Face Recognition Module...{RESET}")
    ml_module = FaceRecognitionModule()
    
    # Verify the student exists in DB
    if student_id not in ml_module.embeddings:
        print(f"{RED}Error: Student ID '{student_id}' not found in database!{RESET}")
        print("Please register the student first using register_student.py")
        return

    # Open Webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print(f"{RED}Error: Could not open webcam.{RESET}")
        return

    print(f"{GREEN}Webcam started.{RESET}")
    print("Instructions:")
    print(f" - Press {YELLOW}'s'{RESET} to Capture and Verify")
    print(f" - Press {YELLOW}'q'{RESET} to Quit")

    last_result = None
    last_result_time = 0
    display_duration = 3 # Seconds to show result on screen

    # Create temp dir if not exists
    if not os.path.exists("data/temp"):
        os.makedirs("data/temp")
        
    temp_path = "data/temp/live_capture.jpg"

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        # Display instructions on frame
        draw_text(frame, f"Verifying: {student_id}", (30, 30), (255, 255, 255))
        draw_text(frame, "Press 'S' to Scan, 'Q' to Quit", (30, 60), (200, 200, 200))

        # Check key presses
        key = cv2.waitKey(1) & 0xFF

        if key == ord('q'):
            break
        elif key == ord('s'):
            print(f"\n{YELLOW}Capturing frame...{RESET}")
            # Save frame
            cv2.imwrite(temp_path, frame)
            
            # Verify
            try:
                start_time = time.time()
                result = ml_module.verify_student(student_id, temp_path)
                end_time = time.time()
                
                # Check result
                is_match = result.get("match", False)
                confidence = result.get("confidence_score", 0)
                distance = result.get("distance", 0.0)
                reason = result.get("reason", "Unknown")
                
                print(f"Time taken: {end_time - start_time:.2f}s")
                
                if result.get("status") == "error":
                     print(f"{RED}[ERROR] {result.get('message')}{RESET}")
                     last_result = f"ERROR: {result.get('message')}"
                     last_result_color = (0, 0, 255) # Red
                elif is_match:
                    print(f"{GREEN}[MATCH] Confidence: {confidence}% | Dist: {distance:.4f}{RESET}")
                    last_result = f"MATCH ({confidence}%)"
                    last_result_color = (0, 255, 0) # Green
                else:
                     print(f"{RED}[NO MATCH] Confidence: {confidence}% | Dist: {distance:.4f} | {reason}{RESET}")
                     last_result = f"NO MATCH ({reason})"
                     last_result_color = (0, 0, 255) # Red
                
                last_result_time = time.time()
                
            except Exception as e:
                print(f"{RED}Exception: {e}{RESET}")

        # Display last result overlay
        if last_result and (time.time() - last_result_time < display_duration):
             draw_text(frame, last_result, (30, 100), last_result_color)

        cv2.imshow('Live Face Verification', frame)

    cap.release()
    cv2.destroyAllWindows()
    
    # Cleanup
    if os.path.exists(temp_path):
        os.remove(temp_path)

if __name__ == "__main__":
    main()
