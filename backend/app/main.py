from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import students, attendance, auth, exams, notifications, reports, admin

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="StormBreaker Attendance Backend")

# Mount Static Files
from fastapi.staticfiles import StaticFiles
import os
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# CORS middleware to allow connection from Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(attendance.router)
app.include_router(auth.router)
app.include_router(exams.router)
app.include_router(notifications.router)
app.include_router(reports.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to StormBreaker Attendance Backend"}
