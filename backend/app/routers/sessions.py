from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(
    prefix="/sessions",
    tags=["sessions"],
)

@router.post("/start", response_model=schemas.LiveSession)
def start_session(
    session: schemas.LiveSessionBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role not in ["faculty", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    teacher = crud.get_teacher_by_user_id(db, user_id=current_user.id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
        
    session_create = schemas.LiveSessionCreate(
        **session.model_dump(),
        teacher_id=teacher.id
    )
    return crud.create_live_session(db, session=session_create)

@router.get("/active", response_model=List[schemas.LiveSession])
def get_active_sessions(
    dept: str = None,
    year: str = None,
    div: str = None,
    db: Session = Depends(get_db)
):
    return crud.get_active_live_sessions(db, department=dept, year=year, division=div)

@router.post("/{session_id}/end", response_model=schemas.LiveSession)
def end_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role not in ["faculty", "teacher", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.end_live_session(db, session_id=session_id)
