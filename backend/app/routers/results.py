from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/results", tags=["results"])

@router.post("/", response_model=schemas.Result)
def create_result(
    result: schemas.ResultCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Create a new result entry (Admin/Faculty only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.create_result(db, result)

@router.get("/student/{student_id}", response_model=List[schemas.Result])
def get_student_results(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get all results for a specific student"""
    return crud.get_results_by_student(db, student_id)

@router.get("/class/{department}/{year}/{semester}", response_model=List[schemas.Result])
def get_class_results(
    department: str,
    year: str,
    semester: str,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get all results for a class"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.get_results_by_class(db, department, year, semester)

@router.put("/{result_id}")
def update_result(
    result_id: int,
    marks_obtained: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Update result marks (Admin/Faculty only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    result = crud.update_result(db, result_id, marks_obtained)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return result
