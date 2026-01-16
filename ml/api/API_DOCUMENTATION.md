# Face Recognition API Documentation

This API handles student registration and attendance verification using the face recognition module.

**Base URL:** `http://localhost:8001`

## 1. Health Check
*   **Endpoint:** `GET /`
*   **Description:** Checks if the API service is online.
*   **Response:**
    ```json
    {
      "status": "online",
      "service": "Face Recognition API"
    }
    ```

## 2. Register Student
*   **Endpoint:** `POST /register`
*   **Description:** Uploads a photo to register a new student and generate their face embedding.
*   **Body (Multipart Form-Data):**
    *   `student_id` (string): The unique ID of the student (e.g., "STD_123").
    *   `file` (file): The image file containing the student's face.

*   **Success Response (200 OK):**
    ```json
    {
        "status": "success",
        "message": "Student STD_123 registered successfully.",
        "student_id": "STD_123"
    }
    ```

*   **Error Response (400 Bad Request):**
    ```json
    {
        "status": "error",
        "message": "No face detected in the image."
    }
    ```

## 3. Verify Attendance
*   **Endpoint:** `POST /verify`
*   **Description:** Uploads a captured photo to verify against a registered student's embedding.
*   **Body (Multipart Form-Data):**
    *   `student_id` (string): The ID of the student claiming attendance.
    *   `file` (file): The captured live image file.

*   **Success Response (200 OK):**
    *   **Matched:**
        ```json
        {
            "status": "success",
            "match": true,
            "confidence_score": 98.5,
            "distance": 0.15,
            "threshold": 0.4,
            "reason": "Face matched",
            "student_id": "STD_123"
        }
        ```
    *   **Not Matched (Proxy/Imposter):**
        ```json
        {
            "status": "success",
            "match": false,
            "confidence_score": 0.0,
            "distance": 0.75,
            "threshold": 0.4,
            "reason": "Face mismatch - proxy attempt",
            "student_id": "STD_123"
        }
        ```

*   **Error Response (500/400):**
    ```json
    {
        "status": "error",
        "message": "Student ID not found in database.",
        "match": false
    }
    ```

## Integration Guide (Python Example)

```python
import requests

url = "http://localhost:8000/verify"
files = {'file': open('capture.jpg', 'rb')}
data = {'student_id': 'STD_123'}

response = requests.post(url, files=files, data=data)
print(response.json())
```
