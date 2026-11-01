import os
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse
from app.core.config import settings
from app.core.security import get_current_user
from app.models.enums import DocumentCategory, VerificationStatus, UserRole
from app.schemas.schemas import DocumentResponse
from app.services.document_service import document_service
from app.services.storage_service import storage_service

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    category: DocumentCategory = Form(...),
    issuer_name: Optional[str] = Form(None),
    certificate_number: Optional[str] = Form(None),
    issue_date: Optional[str] = Form(None),
    expiration_date: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Save file
    file_id, file_path, file_size = await storage_service.save_file(file)

    # Validate file size
    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB"
        )

    file_url = storage_service.get_file_url(file_path)

    doc = document_service.create_document(
        name=file.filename,
        category=category,
        file_type=file.content_type or "application/octet-stream",
        file_size_bytes=file_size,
        file_path=file_path,
        file_url=file_url,
        uploaded_by=current_user["id"],
        uploader_name=current_user["full_name"],
        issuer_name=issuer_name,
        certificate_number=certificate_number,
        issue_date=issue_date,
        expiration_date=expiration_date
    )

    return DocumentResponse(
        id=doc.id,
        name=doc.name,
        category=doc.category,
        file_type=doc.file_type,
        file_size_bytes=doc.file_size_bytes,
        file_url=doc.file_url,
        issuer_name=doc.issuer_name,
        certificate_number=doc.certificate_number,
        issue_date=doc.issue_date,
        expiration_date=doc.expiration_date,
        uploaded_by=doc.uploaded_by,
        uploader_name=doc.uploader_name,
        status=doc.status,
        verification_result_id=doc.verification_result_id,
        is_demo=doc.is_demo,
        created_at=doc.created_at
    )


@router.get("/list", response_model=List[DocumentResponse])
async def list_documents(
    category: Optional[DocumentCategory] = None,
    status: Optional[VerificationStatus] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    is_admin_or_verifier = current_user.get("role") in [UserRole.ADMIN, UserRole.VERIFIER]
    docs = document_service.list_documents(
        user_id=current_user["id"],
        category=category,
        status=status,
        search=search,
        is_admin_or_verifier=is_admin_or_verifier
    )
    return [
        DocumentResponse(
            id=d.id,
            name=d.name,
            category=d.category,
            file_type=d.file_type,
            file_size_bytes=d.file_size_bytes,
            file_url=d.file_url,
            issuer_name=d.issuer_name,
            certificate_number=d.certificate_number,
            issue_date=d.issue_date,
            expiration_date=d.expiration_date,
            uploaded_by=d.uploaded_by,
            uploader_name=d.uploader_name,
            status=d.status,
            verification_result_id=d.verification_result_id,
            is_demo=d.is_demo,
            created_at=d.created_at
        )
        for d in docs
    ]


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    doc = document_service.get_by_id(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse(
        id=doc.id,
        name=doc.name,
        category=doc.category,
        file_type=doc.file_type,
        file_size_bytes=doc.file_size_bytes,
        file_url=doc.file_url,
        issuer_name=doc.issuer_name,
        certificate_number=doc.certificate_number,
        issue_date=doc.issue_date,
        expiration_date=doc.expiration_date,
        uploaded_by=doc.uploaded_by,
        uploader_name=doc.uploader_name,
        status=doc.status,
        verification_result_id=doc.verification_result_id,
        is_demo=doc.is_demo,
        created_at=doc.created_at
    )


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    is_admin = current_user.get("role") == UserRole.ADMIN
    success = document_service.delete_document(
        document_id=document_id,
        user_id=current_user["id"],
        user_name=current_user["full_name"],
        is_admin=is_admin
    )
    if not success:
        raise HTTPException(
            status_code=403,
            detail="Unable to delete document. Ensure you are the document owner or administrator."
        )
    return {"status": "success", "message": "Document deleted successfully"}


@router.get("/download/{filename}")
async def download_file(
    filename: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Secure file download with path traversal prevention and authenticated access control.
    """
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    resolved_path = os.path.abspath(file_path)
    upload_root = os.path.abspath(settings.UPLOAD_DIR)

    if not resolved_path.startswith(upload_root):
        raise HTTPException(status_code=403, detail="Access denied: Invalid file path")

    if not os.path.exists(resolved_path):
        raise HTTPException(status_code=404, detail="File not found on storage")

    return FileResponse(resolved_path)
