from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(
    prefix="/exams",
    tags=["exams"],
)

@router.get("/", response_model=List[schemas.Exam])
def read_exams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    exams = crud.get_exams(db, skip=skip, limit=limit)
    return exams

@router.post("/", response_model=schemas.Exam)
def create_exam(
    exam: schemas.ExamCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.create_exam(db=db, exam=exam)

@router.delete("/{exam_id}", response_model=schemas.Exam)
def delete_exam(
    exam_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_exam = crud.delete_exam(db, exam_id=exam_id)
    if not db_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return db_exam
