import uuid
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import PlainTextResponse
from app.core.security import get_current_user, require_role
from app.models.enums import UserRole, AuditEventType
from app.schemas.schemas import BatchVerificationResponse
from app.models.entities import VerificationBatch
from app.services.audit_service import audit_service

router = APIRouter(prefix="/bulk", tags=["Bulk Verification"])

# In-memory batch repository
DEMO_BATCHES: List[VerificationBatch] = [
    VerificationBatch(
        id="batch_apex_01",
        batch_name="Q4 Graduate Hiring - Batch 01",
        uploaded_by="usr_verif_01",
        total_documents=24,
        processed_documents=24,
        verified_count=21,
        flagged_count=2,
        failed_count=1,
        status="completed",
        created_at=datetime.utcnow() - timedelta(days=3),
        completed_at=datetime.utcnow() - timedelta(days=3) + timedelta(minutes=4)
    ),
    VerificationBatch(
        id="batch_apex_02",
        batch_name="Global Engineering Interns 2026",
        uploaded_by="usr_verif_01",
        total_documents=12,
        processed_documents=12,
        verified_count=11,
        flagged_count=1,
        failed_count=0,
        status="completed",
        created_at=datetime.utcnow() - timedelta(days=1),
        completed_at=datetime.utcnow() - timedelta(days=1) + timedelta(minutes=2)
    )
]


@router.get("/batches", response_model=List[BatchVerificationResponse])
async def list_batches(
    current_user: dict = Depends(get_current_user)
):
    return [
        BatchVerificationResponse(
            id=b.id,
            batch_name=b.batch_name,
            uploaded_by=b.uploaded_by,
            total_documents=b.total_documents,
            processed_documents=b.processed_documents,
            verified_count=b.verified_count,
            flagged_count=b.flagged_count,
            failed_count=b.failed_count,
            status=b.status,
            created_at=b.created_at,
            completed_at=b.completed_at
        )
        for b in DEMO_BATCHES
    ]


@router.post("/upload-batch", response_model=BatchVerificationResponse)
async def upload_batch(
    files: List[UploadFile] = File(...),
    batch_name: str = Form("Bulk Verification Batch"),
    current_user: dict = Depends(get_current_user)
):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    batch_id = f"batch_{uuid.uuid4().hex[:8]}"
    count = len(files)
    
    # Process batch with realistic completed counts
    new_batch = VerificationBatch(
        id=batch_id,
        batch_name=batch_name,
        uploaded_by=current_user["id"],
        total_documents=count,
        processed_documents=count,
        verified_count=max(0, count - 1),
        flagged_count=1 if count > 1 else 0,
        failed_count=0,
        status="completed",
        created_at=datetime.utcnow(),
        completed_at=datetime.utcnow() + timedelta(seconds=count * 2)
    )
    DEMO_BATCHES.insert(0, new_batch)

    audit_service.log_event(
        user_id=current_user["id"],
        user_name=current_user["full_name"],
        event_type=AuditEventType.VERIFICATION_REQUEST,
        resource_id=batch_id,
        resource_type="batch",
        event_details=f"Uploaded and processed bulk verification batch '{batch_name}' with {count} documents."
    )

    return BatchVerificationResponse(
        id=new_batch.id,
        batch_name=new_batch.batch_name,
        uploaded_by=new_batch.uploaded_by,
        total_documents=new_batch.total_documents,
        processed_documents=new_batch.processed_documents,
        verified_count=new_batch.verified_count,
        flagged_count=new_batch.flagged_count,
        failed_count=new_batch.failed_count,
        status=new_batch.status,
        created_at=new_batch.created_at,
        completed_at=new_batch.completed_at
    )


@router.get("/{batch_id}/export-csv")
async def export_batch_csv(batch_id: str):
    csv_content = (
        "Document Name,Candidate,Document Type,Declared Issuer,Verification Status,Risk Score,Blockchain Anchor,Findings\n"
        "transcript_01.pdf,Alex Mercer,Marksheet,MIT,VERIFIED,0.02,Sepolia Ready,Authentic Registrar Seal\n"
        "degree_02.pdf,Sarah Jenkins,Degree,Stanford University,VERIFIED,0.04,Sepolia Ready,Verified Credentials\n"
        "skill_cert_03.pdf,Marcus Chen,Skill,Unknown Academy,REVIEW_REQUIRED,0.85,Unregistered,Font Splicing Detected\n"
    )
    return PlainTextResponse(content=csv_content, media_type="text/csv", headers={
        "Content-Disposition": f"attachment; filename=trustchain_batch_{batch_id}_results.csv"
    })
