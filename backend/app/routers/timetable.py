from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/timetable", tags=["timetable"])

@router.post("/", response_model=schemas.Timetable)
def create_timetable_entry(
    timetable: schemas.TimetableCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Create a new timetable entry (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.create_timetable_entry(db, timetable)

@router.get("/class/{class_id}", response_model=List[schemas.Timetable])
def get_class_timetable(
    class_id: int,
    db: Session = Depends(get_db)
):
    """Get timetable for a specific class"""
    return crud.get_timetable_by_class(db, class_id)

@router.get("/teacher/{teacher_id}", response_model=List[schemas.Timetable])
def get_teacher_timetable(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get timetable for a specific teacher"""
    return crud.get_timetable_by_teacher(db, teacher_id)

@router.delete("/{timetable_id}")
def delete_timetable_entry(
    timetable_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Delete a timetable entry (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    entry = crud.delete_timetable_entry(db, timetable_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Timetable entry not found")
    return {"message": "Timetable entry deleted successfully"}
