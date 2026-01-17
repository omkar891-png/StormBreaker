from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(prefix="/leave", tags=["leave"])

@router.post("/", response_model=schemas.LeaveRequest)
def create_leave_request(
    leave_request: schemas.LeaveRequestCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Create a new leave request (Student only)"""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can request leave")
    return crud.create_leave_request(db, leave_request)

@router.get("/", response_model=List[schemas.LeaveRequest])
def get_leave_requests(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get all leave requests (Admin/Faculty only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.get_leave_requests(db, status, skip, limit)

@router.get("/student/{student_id}", response_model=List[schemas.LeaveRequest])
def get_student_leave_requests(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Get all leave requests for a student"""
    return crud.get_leave_requests_by_student(db, student_id)

@router.put("/{leave_id}/status")
def update_leave_status(
    leave_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    """Approve or reject a leave request (Admin/Faculty only)"""
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if status not in ["APPROVED", "REJECTED", "PENDING"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    leave = crud.update_leave_request_status(db, leave_id, status, current_user.id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave
