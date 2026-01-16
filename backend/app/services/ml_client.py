import httpx
from fastapi import UploadFile, HTTPException
import logging

ML_SERVICE_URL = "http://127.0.0.1:8001"

logger = logging.getLogger(__name__)

class MLClient:
    def __init__(self, base_url=ML_SERVICE_URL):
        self.base_url = base_url

    async def register_student(self, student_id: str, image_file: UploadFile):
        """
        Sends the image to the ML service to register the face.
        Expected ML endpoint: POST /register
        Form data: file, student_id
        """
        url = f"{self.base_url}/register"
        
        # Read file content
        file_content = await image_file.read()
        await image_file.seek(0) # Reset cursor for subsequent reads if needed

        files = {"file": (image_file.filename, file_content, image_file.content_type)}
        data = {"student_id": student_id}

        async with httpx.AsyncClient(trust_env=False) as client:
            try:
                response = await client.post(url, files=files, data=data, timeout=60.0)
                response.raise_for_status()
                return response.json()
            except httpx.RequestError as exc:
                logger.error(f"An error occurred while requesting {exc.request.url!r}: {exc}")
                raise HTTPException(status_code=503, detail=f"ML Service unavailable: {str(exc)}")
            except httpx.HTTPStatusError as exc:
                logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
                raise HTTPException(status_code=exc.response.status_code, detail=f"ML Service error: {exc.response.text}")

    async def verify_attendance(self, image_file: UploadFile, student_id: str = None):
        """
        Sends the image to the ML service to verify identity.
        Expected ML endpoint: POST /verify
        Form data: file, student_id (optional)
        """
        url = f"{self.base_url}/verify"
        
        file_content = await image_file.read()
        await image_file.seek(0) 

        files = {"file": (image_file.filename, file_content, image_file.content_type)}
        data = {}
        if student_id:
            data["student_id"] = student_id

        async with httpx.AsyncClient(trust_env=False) as client:
            try:
                response = await client.post(url, files=files, data=data, timeout=60.0)
                response.raise_for_status()
                return response.json()
            except httpx.RequestError as exc:
                logger.error(f"An error occurred while requesting {exc.request.url!r}: {exc}")
                raise HTTPException(status_code=503, detail=f"ML Service unavailable: {str(exc)}")
            except httpx.HTTPStatusError as exc:
                logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
                raise HTTPException(status_code=exc.response.status_code, detail=f"ML Service error: {exc.response.text}")

ml_client = MLClient()
