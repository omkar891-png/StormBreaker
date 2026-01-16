import argparse
import json
import os
import sys

# Ensure we can import the module if running from ml/ or elsewhere
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from face_recognition_module import FaceRecognitionModule

def main():
    parser = argparse.ArgumentParser(description="Register a new student face.")
    parser.add_argument("--id", required=True, help="Student ID")
    parser.add_argument("--image", required=True, help="Path to the face image file")
    
    args = parser.parse_args()
    
    # Initialize module
    ml_module = FaceRecognitionModule()
    
    # Check if image exists
    if not os.path.exists(args.image):
        print(json.dumps({"status": "error", "message": f"Image file not found: {args.image}"}))
        return

    # Process
    result = ml_module.register_student(args.id, args.image)
    
    # Output JSON
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    main()
