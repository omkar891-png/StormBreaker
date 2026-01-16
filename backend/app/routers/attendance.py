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

@router.post("/mark", response_model=schemas.Attendance)
async def mark_attendance(
    subject: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Verification via ML
    try:
        verification_result = await ml_client.verify_attendance(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")
    
    # 2. Check match status
    matched = verification_result.get("matched", False)
    ml_student_id = verification_result.get("student_id")
    confidence = verification_result.get("confidence", 0.0)
    
    if not matched or not ml_student_id:
        raise HTTPException(status_code=401, detail="Face not recognized or match failed.")
        
    # 3. Look up student
    student_id = int(ml_student_id)
    student = crud.get_student(db, student_id=student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student ID {student_id} found in ML but not in DB.")
        
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
