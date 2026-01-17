from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.post("/", response_model=schemas.Assignment)
def create_assignment(
    assignment: schemas.AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Create a new assignment (Faculty only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.create_assignment(db, assignment)

@router.get("/class/{class_id}", response_model=List[schemas.Assignment])
def get_class_assignments(
    class_id: int,
    db: Session = Depends(get_db)
):
    """Get all assignments for a specific class"""
    return crud.get_assignments_by_class(db, class_id)

@router.get("/teacher/{teacher_id}", response_model=List[schemas.Assignment])
def get_teacher_assignments(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get all assignments created by a teacher"""
    return crud.get_assignments_by_teacher(db, teacher_id)

@router.get("/{assignment_id}", response_model=schemas.Assignment)
def get_assignment(
    assignment_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific assignment"""
    assignment = crud.get_assignment(db, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Delete an assignment (Faculty/Admin only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    assignment = crud.delete_assignment(db, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"message": "Assignment deleted successfully"}
