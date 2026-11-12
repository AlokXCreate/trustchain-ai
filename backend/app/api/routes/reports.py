from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from pydantic import BaseModel, EmailStr

from app.core.security import get_current_user
from app.services.reporting.report_service import report_service
from app.services.reporting.email_service import email_service
from app.services.reporting.report_integrity_service import report_integrity_service

router = APIRouter(prefix="/reports", tags=["Reports"])


class EmailReportRequest(BaseModel):
    recipient_email: EmailStr
    recipient_name: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    formats: List[str] = ["pdf"]


@router.get("")
async def list_reports(
    search: Optional[str] = Query(None, description="Search term for ID, document name or category"),
    status: Optional[str] = Query(None, description="Filter by status (verified, review_required, failed)"),
    risk_category: Optional[str] = Query(None, description="Filter by risk category"),
    is_archived: bool = Query(False, description="Filter archived reports"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user)
):
    summaries, total = report_service.list_reports(
        search=search,
        status=status,
        risk_category=risk_category,
        is_archived=is_archived,
        limit=limit,
        offset=offset
    )
    stats = report_service.get_dashboard_stats()
    return {
        "items": summaries,
        "total": total,
        "limit": limit,
        "offset": offset,
        "stats": stats
    }


@router.get("/stats")
async def get_report_stats(current_user: dict = Depends(get_current_user)):
    return report_service.get_dashboard_stats()


@router.get("/compare")
async def compare_reports(
    id1: str = Query(..., description="First Report ID"),
    id2: str = Query(..., description="Second Report ID"),
    current_user: dict = Depends(get_current_user)
):
    comparison = report_service.compare_reports(id1, id2)
    if "error" in comparison:
        raise HTTPException(status_code=404, detail=comparison["error"])
    return comparison


@router.get("/public/verify/{report_id}")
async def public_verify_report(report_id: str):
    """
    Publicly accessible endpoint for QR code report verification.
    Returns cryptographic integrity and validity without leaking sensitive PII.
    """
    rep = report_service.get_report(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Verification report not found or expired.")

    is_valid, current_hash = report_integrity_service.verify_integrity(rep.report_data, rep.integrity_hash)

    return {
        "report_id": rep.id,
        "is_authentic": is_valid,
        "verification_status": rep.status,
        "risk_category": rep.risk_category,
        "category": rep.category,
        "issued_at": rep.created_at,
        "issuer": rep.report_data.get("document_info", {}).get("declared_issuer", "Accredited Authority"),
        "integrity_hash": rep.integrity_hash,
        "blockchain_anchored": "Anchored" in rep.report_data.get("blockchain_verification", {}).get("status", ""),
        "system": "TrustChain AI Cryptographic Verification Engine v1.0"
    }


@router.get("/{report_id}")
async def get_report_detail(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    rep = report_service.get_report(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail=f"Report with ID {report_id} not found")
    return rep


@router.get("/{report_id}/download/{fmt}")
async def download_report_file(
    report_id: str,
    fmt: str,
    current_user: dict = Depends(get_current_user)
):
    file_bytes, mime, filename = report_service.export_report(report_id, fmt)
    if not file_bytes:
        raise HTTPException(
            status_code=404,
            detail=f"Report '{report_id}' could not be generated in '{fmt}' format."
        )

    return Response(
        content=file_bytes,
        media_type=mime,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.post("/{report_id}/email")
async def send_report_email(
    report_id: str,
    req: EmailReportRequest,
    current_user: dict = Depends(get_current_user)
):
    rep = report_service.get_report(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")

    # Generate requested attachments
    attachments = {}
    for fmt in req.formats:
        b_data, _, _ = report_service.export_report(report_id, fmt)
        if b_data:
            attachments[fmt] = b_data

    success, msg, log_entry = email_service.send_report_email(
        report_id=report_id,
        recipient_email=req.recipient_email,
        recipient_name=req.recipient_name,
        subject=req.subject,
        custom_message=req.message,
        formats=req.formats,
        attachments=attachments,
        user_id=current_user["id"],
        user_name=current_user["full_name"]
    )

    if not success:
        # Return error with diagnostic guidance per requirements
        return {
            "success": False,
            "message": msg,
            "log": log_entry,
            "requires_smtp_configuration": not email_service.is_smtp_configured()
        }

    return {
        "success": True,
        "message": msg,
        "log": log_entry
    }


@router.post("/{report_id}/regenerate")
async def regenerate_report(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    rep = report_service.regenerate_report(
        report_id=report_id,
        user_id=current_user["id"],
        user_name=current_user["full_name"]
    )
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")
    return rep


@router.patch("/{report_id}/archive")
async def toggle_archive_report(
    report_id: str,
    archived: bool = Query(True),
    current_user: dict = Depends(get_current_user)
):
    ok = report_service.archive_report(report_id, archived)
    if not ok:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"report_id": report_id, "is_archived": archived}


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    ok = report_service.delete_report(report_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"deleted": True, "report_id": report_id}


@router.post("/{report_id}/verify-integrity")
async def verify_report_integrity(
    report_id: str,
    current_user: dict = Depends(get_current_user)
):
    rep = report_service.get_report(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")

    is_valid, current_hash = report_integrity_service.verify_integrity(rep.report_data, rep.integrity_hash)
    return {
        "report_id": rep.id,
        "is_intact": is_valid,
        "recorded_hash": rep.integrity_hash,
        "computed_hash": current_hash,
        "algorithm": "SHA-256",
        "verified_at": rep.created_at
    }

