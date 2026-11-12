from typing import List, Optional
from fastapi import APIRouter, Depends, Query

from app.core.security import get_current_user
from app.services.reporting.email_service import email_service
from app.models.entities import EmailDeliveryLog

router = APIRouter(prefix="/email", tags=["Email"])


@router.get("/history", response_model=List[EmailDeliveryLog])
async def get_email_history(
    limit: int = Query(50, ge=1, le=100),
    report_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    if report_id:
        return email_service.get_logs_for_report(report_id)
    return email_service.list_delivery_logs(limit=limit)


@router.get("/config-status")
async def get_email_config_status(current_user: dict = Depends(get_current_user)):
    is_configured = email_service.is_smtp_configured()
    return {
        "is_configured": is_configured,
        "mode": "Live SMTP Gateway" if is_configured else "Sandbox Diagnostic Mode",
        "instructions": (
            "Configure SMTP_HOST, SMTP_PORT, and SMTP_USERNAME in backend/.env to dispatch real emails."
            if not is_configured else "SMTP settings are loaded and active."
        )
    }

