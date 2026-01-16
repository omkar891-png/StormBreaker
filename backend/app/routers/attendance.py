from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..services.ml_client import ml_client

router = APIRouter(
    prefix="/attendance",
    tags=["attendance"],
)

from ..dependencies import get_current_active_user

@router.post("/mark", response_model=schemas.Attendance)
async def mark_attendance(
    subject: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # 0. Get Student ID from Current User
    student = crud.get_student_by_user_id(db, user_id=current_user.id)
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found for this user")

    # 1. Verification via ML (1:1 with Student ID)
    try:
        # Pass student.id to enforce 1:1 verification against their registered face
        verification_result = await ml_client.verify_attendance(file, student_id=str(student.id))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")
    
    # 2. Check match status
    matched = verification_result.get("matched", False)
    confidence = verification_result.get("confidence", 0.0)
    
    if not matched:
        raise HTTPException(status_code=401, detail="Face verification failed. Face does not match profile.")
        
    # 3. Use the confirmed student object
    # (student is already found above)
        
    # 4. Record Attendance
    attendance_data = schemas.AttendanceCreate(
        student_id=student.id,
        status="PRESENT",
        verification_confidence=confidence,
        subject=subject
    )
    
    new_attendance = crud.create_attendance(db, attendance=attendance_data)
    
    return new_attendance

@router.get("/", response_model=List[schemas.Attendance])
def read_attendance(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_attendance_records(db, skip=skip, limit=limit)
