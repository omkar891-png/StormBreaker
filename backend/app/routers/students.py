from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..services.ml_client import ml_client

router = APIRouter(
    prefix="/students",
    tags=["students"],
)

@router.post("/", response_model=schemas.Student)
async def register_student(
    full_name: str = Form(...),
    roll_number: str = Form(...),
    department: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Check if student already exists
    db_student = crud.get_student_by_roll_number(db, roll_number=roll_number)
    if db_student:
        raise HTTPException(status_code=400, detail="Student with this roll number already registered")
    
    # 2. Create student object
    student_data = schemas.StudentCreate(
        full_name=full_name,
        roll_number=roll_number,
        department=department
    )
    
    # 3. Save to DB to get ID
    created_student = crud.create_student(db=db, student=student_data)
    
    # 4. Call ML Service
    try:
        # We send the DB ID as the unique identifier for the face
        ml_response = await ml_client.register_student(str(created_student.id), file)
        # We could also validate ml_response['status'] or similar if needed
    except Exception as e:
        # Rollback: delete the created student if ML service fails
        db.delete(created_student)
        db.commit()
        raise e
        
    return created_student

@router.get("/", response_model=List[schemas.Student])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_students(db, skip=skip, limit=limit)
    return users
