from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/", response_model=schemas.Submission)
def create_submission(
    submission: schemas.SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Submit an assignment (Student only)"""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit assignments")
    return crud.create_submission(db, submission)

@router.get("/assignment/{assignment_id}", response_model=List[schemas.Submission])
def get_assignment_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get all submissions for an assignment (Faculty/Admin only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.get_submissions_by_assignment(db, assignment_id)

@router.get("/student/{student_id}", response_model=List[schemas.Submission])
def get_student_submissions(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get all submissions by a student"""
    return crud.get_submissions_by_student(db, student_id)

@router.put("/{submission_id}/grade")
def grade_submission(
    submission_id: int,
    marks_awarded: int,
    feedback: str = None,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Grade a submission (Faculty/Admin only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    submission = crud.update_submission_marks(db, submission_id, marks_awarded, feedback)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission
