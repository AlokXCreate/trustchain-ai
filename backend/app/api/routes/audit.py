from typing import List, Optional
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.enums import AuditEventType
from app.schemas.schemas import AuditLogResponse
from app.services.audit_service import audit_service

router = APIRouter(prefix="/audit", tags=["Audit Trail"])


@router.get("/logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    limit: int = 50,
    event_type: Optional[AuditEventType] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    logs = audit_service.get_logs(limit=limit, event_type=event_type, search=search)
    return [
        AuditLogResponse(
            id=log.id,
            user_id=log.user_id,
            user_name=log.user_name,
            event_type=log.event_type,
            resource_id=log.resource_id,
            resource_type=log.resource_type,
            event_details=log.event_details,
            ip_address=log.ip_address,
            tamper_evident_hash=log.tamper_evident_hash,
            blockchain_tx_ref=log.blockchain_tx_ref,
            timestamp=log.timestamp
        )
        for log in logs
    ]
