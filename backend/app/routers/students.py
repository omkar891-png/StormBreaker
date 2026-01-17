from datetime import datetime, timedelta
import pandas as pd
from io import BytesIO
import shutil
import os
from pathlib import Path
from ..security import get_password_hash
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional

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
    year: str = Form("FY"),
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
        department=department,
        year=year
    )
    
    # 3. Save to DB to get ID
    created_student = crud.create_student(db=db, student=student_data)
    
    # 3.5 Save Image Locally
    try:
        # Define path
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        images_dir = os.path.join(base_dir, "static", "images")
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)
            
        # File extension
        ext = os.path.splitext(file.filename)[1]
        if not ext:
            ext = ".jpg"
            
        filename = f"{created_student.id}{ext}"
        file_path = os.path.join(images_dir, filename)
        
        # Save file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        # Update DB with path
        created_student.profile_picture = f"/static/images/{filename}"
        created_student.is_profile_complete = True
        db.commit()
        db.refresh(created_student)
        
        # Reset cursor for ML client
        await file.seek(0)
        
    except Exception as e:
        db.delete(created_student)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

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

from ..dependencies import get_current_active_user

# ... existing imports ...

@router.post("/upload-face")
async def upload_face(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # 1. Find the student record associated with this user
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found for this user")
        
    # 1.5 Save Image Locally
    try:
        # Define path
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        images_dir = os.path.join(base_dir, "static", "images")
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)
            
        # File extension
        ext = os.path.splitext(file.filename)[1]
        if not ext:
            ext = ".jpg"
            
        filename = f"{student.id}{ext}"
        file_path = os.path.join(images_dir, filename)
        
        # Save file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        # Update DB with path
        student.profile_picture = f"/static/images/{filename}"
        
        # Reset cursor for ML client
        await file.seek(0)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

    # 2. Call ML Service to register face
    try:
        # We send the Student DB ID as the unique identifier for the face
        ml_response = await ml_client.register_student(str(student.id), file)
        
        # Update profile completion status
        student.is_profile_complete = True
        db.commit()
        db.refresh(student)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Service failed: {str(e)}")
        
    return {"message": "Face registered successfully", "ml_response": ml_response, "profile_picture": student.profile_picture}

@router.get("/me", response_model=schemas.Student)
def read_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student

@router.post("/batch-upload")
async def batch_upload_students(
    file: UploadFile = File(...),
    department: str = Form(...),
    year: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Only admins can upload
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Invalid file format")

    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(contents))
        else:
            df = pd.read_excel(BytesIO(contents))
            
        # Standardize columns
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
        
        # Explicit mappings for user-requested columns
        rename_map = {
            'email_id': 'email',
            'roll_no': 'roll_number',
            'rollnumber': 'roll_number'
        }
        df.rename(columns=rename_map, inplace=True)
        
        required_cols = ['name', 'email', 'password', 'roll_number']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
             raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing_cols)}")

        success_count = 0
        errors = []

        for index, row in df.iterrows():
            try:
                email = str(row['name']).strip() if 'email' not in row or pd.isna(row['email']) else str(row['email']).strip()
                # If no email provided, maybe generate one or skip. For now assume email is meant to be in column 'email'
                # fallback logic above is risky, let's stick to row['email']
                email = str(row['email']).strip()
                
                name = str(row['name']).strip()
                password = str(row['password']).strip()
                roll_no = str(row['roll_number']).strip()
                
                # Check for existing user
                db_user = crud.get_user_by_email(db, email=email)
                if not db_user:
                    # Create User
                    user_data = schemas.UserCreate(email=email, password=password)
                    hashed_pwd = get_password_hash(user_data.password)
                    db_user = models.User(email=user_data.email, hashed_password=hashed_pwd, role="student")
                    db.add(db_user)
                    db.commit()
                    db.refresh(db_user)
                
                # Check for existing student
                db_student = crud.get_student_by_roll_number(db, roll_number=roll_no)
                if not db_student:
                    # Create Student
                    # Create Student
                    db_student = models.Student(
                        full_name=name,
                        roll_number=roll_no,
                        department=department, # Use selected dept
                        year=year, # Use selected year
                        user_id=db_user.id
                    )
                    db.add(db_student)
                    db.commit()
                    success_count += 1
                else:
                    errors.append(f"Row {index+2}: Student {roll_no} already exists")
                    
            except Exception as e:
                errors.append(f"Row {index+2}: {str(e)}")
                db.rollback()

        return {
            "message": "Batch processing completed",
            "success_count": success_count,
            "total_rows": len(df),
            "errors": errors
        }

    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@router.get("/", response_model=List[schemas.Student])
def read_students(
    dept: Optional[str] = None,
    year: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.Student)
    if dept:
        query = query.filter(models.Student.department == dept)
    if year:
        query = query.filter(models.Student.year == year)
    return query.offset(skip).limit(limit).all()
