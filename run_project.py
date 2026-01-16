import subprocess
import time
import os
import sys

def start_services():
    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    ml_dir = os.path.join(base_dir, "ml")
    frontend_dir = os.path.join(base_dir, "frontend")

    pids = []

    print("[*] Starting ML Service (Port 8001)...")
    ml_process = subprocess.Popen(
        [sys.executable, "api/ml_api.py"], 
        cwd=ml_dir,
        shell=True
    )
    pids.append(ml_process)
    time.sleep(2)

    print("[*] Starting Backend Service (Port 8000)...")
    backend_process = subprocess.Popen(
        ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0"], 
        cwd=backend_dir,
        shell=True
    )
    pids.append(backend_process)
    time.sleep(2)

    print("[*] Starting Frontend (Port 3000)...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"], 
        cwd=frontend_dir,
        shell=True
    )
    pids.append(frontend_process)

    print("\n[+] All services started! Access the app at http://localhost:3000")
    print("Press Ctrl+C to stop all services.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping all services...")
        for p in pids:
            p.terminate()

if __name__ == "__main__":
    start_services()
