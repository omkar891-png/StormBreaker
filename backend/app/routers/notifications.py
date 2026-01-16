from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
)

@router.get("/", response_model=List[schemas.Notification])
def read_notifications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_notifications(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Notification)
def create_notification(
    notification: schemas.NotificationCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return crud.create_notification(db=db, notification=notification)
