# ML Module for Face Recognition Attendance

This module uses `DeepFace` with `VGG-Face` model to register student faces and verify attendance.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Directory Structure:
   - `data/registered_faces/`: Store raw images used for registration here (optional, script stores path).
   - `data/test_faces/`: Store images used for testing verification.
   - `embeddings/students.json`: Database of registered embeddings.

## Usage

### 1. Register a Student
Captures a face embedding from an image and associates it with an ID.

```bash
python register_student.py --id "STUDENT_001" --image "data/registered_faces/student_001.jpg"
```

**Output:**
```json
{
    "status": "success",
    "message": "Student STUDENT_001 registered successfully.",
    "student_id": "STUDENT_001"
}
```

### 2. Verify Attendance
Compares a new captured image against the registered embedding for the claimed ID.

```bash
python verify_attendance.py --id "STUDENT_001" --image "data/test_faces/capture_001.jpg"
```

**Output:**
```json
{
    "status": "success",
    "match": true,
    "confidence_score": 98.5,
    "distance": 0.15,
    "threshold": 0.4,
    "reason": "Face matched",
    "student_id": "STUDENT_001"
}
```

### 3. Live Verification
Test the system using your webcam in real-time.

```bash
python live_verification.py --id "STUDENT_001"
```
- Press **'S'** to capture the current frame and verify.
- Press **'Q'** to quit.

## Error Handling
- logic handles multiple faces (rejection), no faces (rejection), and file not found errors.
- Returns clear JSON with `"status": "error"` and a message.
