from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

def check_admin(current_user: models.User):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges"
        )

@router.get("/teachers", response_model=List[schemas.Teacher])
def read_teachers(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    check_admin(current_user)
    return crud.get_teachers(db, skip=skip, limit=limit)

@router.post("/teachers", response_model=schemas.Teacher)
def add_teacher(
    teacher: schemas.TeacherCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    check_admin(current_user)
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=teacher.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_teacher(db, teacher=teacher)

@router.get("/subjects", response_model=List[schemas.Subject])
def read_subjects(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    check_admin(current_user)
    return crud.get_subjects(db, skip=skip, limit=limit)

@router.post("/subjects", response_model=schemas.Subject)
def add_subject(
    subject: schemas.SubjectCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    check_admin(current_user)
    return crud.create_subject(db, subject=subject)

@router.get("/classes", response_model=List[schemas.ClassGroup])
def read_classes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    check_admin(current_user)
    return crud.get_classes(db, skip=skip, limit=limit)

@router.post("/classes", response_model=schemas.ClassGroup)
def add_class(
    class_group: schemas.ClassGroupCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    check_admin(current_user)
    return crud.create_class(db, class_group=class_group)
