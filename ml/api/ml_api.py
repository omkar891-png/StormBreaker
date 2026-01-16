import sys
import os
import shutil
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import uvicorn

# Add parent directory to path to import python modules from ml folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from face_recognition_module import FaceRecognitionModule

app = FastAPI(title="Face Recognition API", description="API for Student Attendance Verification")

# Initialize Face Recognition Module
# Ensure the paths are correct relative to where the script is run or absolute
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMBEDDINGS_FILE = os.path.join(BASE_DIR, "embeddings", "students.json")
TEMP_DIR = os.path.join(BASE_DIR, "data", "temp_api")

if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

# Initialize the module with the absolute path to embeddings
ml_module = FaceRecognitionModule(embeddings_file=EMBEDDINGS_FILE)

@app.get("/")
def read_root():
    return {"status": "online", "service": "Face Recognition API"}

@app.post("/register")
async def register_student(
    student_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Register a new student with their face image.
    """
    temp_file_path = os.path.join(TEMP_DIR, f"register_{student_id}_{file.filename}")
    
    try:
        # Save uploaded file
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Call ML module
        result = ml_module.register_student(student_id, temp_file_path)
        
        if result.get("status") == "error":
            return JSONResponse(status_code=400, content=result)
            
        return result

    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    
    finally:
        # Cleanup temp file if it exists
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@app.post("/verify")
async def verify_attendance(
    student_id: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Verify attendance by comparing uploaded face image matches the registered student_id.
    """
    temp_file_path = os.path.join(TEMP_DIR, f"verify_{student_id}_{file.filename}")
    
    try:
        # Save uploaded file
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Call ML module
        result = ml_module.verify_student(student_id, temp_file_path)
        
        if result.get("status") == "error":
            # If student not found or other logical error, we might still want to return 200 with error status 
            # or 400. Let's stick to returning the JSON as is, maybe with 200 OK because the *check* was successful, 
            # even if the outcome was 'error' (like student not found).
            # However, for API consistency:
            if "not found" in result.get("message", "").lower():
                return JSONResponse(status_code=404, content=result)
            return JSONResponse(status_code=400, content=result)
            
        return result

    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    
    finally:
        # Cleanup
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
