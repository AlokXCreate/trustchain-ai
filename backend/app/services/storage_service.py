import os
import shutil
import uuid
from typing import Optional
from fastapi import UploadFile
from app.core.config import settings


class StorageService:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_file(self, file: UploadFile) -> tuple[str, str, int]:
        """
        Saves uploaded file and returns (file_id, file_path, file_size_bytes)
        """
        file_ext = os.path.splitext(file.filename)[1].lower() if file.filename else ".pdf"
        file_id = f"doc_{uuid.uuid4().hex[:12]}"
        filename = f"{file_id}{file_ext}"
        destination = os.path.join(self.upload_dir, filename)

        file_size = 0
        with open(destination, "wb") as buffer:
            # Read in chunks to safely calculate file size
            while chunk := await file.read(1024 * 1024):  # 1MB chunks
                file_size += len(chunk)
                buffer.write(chunk)
                
        # Return file_id, file_path, file_size
        return file_id, destination, file_size

    def get_file_url(self, file_path: str) -> str:
        """
        Returns accessible URL for the document.
        In demo/local mode, provides a direct relative API endpoint.
        """
        filename = os.path.basename(file_path)
        return f"{settings.API_V1_STR}/documents/download/{filename}"


storage_service = StorageService()
