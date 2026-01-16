from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import students, attendance

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="StormBreaker Attendance Backend")

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

@app.get("/")
def read_root():
    return {"message": "Welcome to StormBreaker Attendance Backend"}
