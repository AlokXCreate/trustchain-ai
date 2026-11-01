import hashlib
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from app.models.entities import AuditLog
from app.models.enums import AuditEventType


class AuditService:
    def __init__(self):
        self._audit_logs: List[AuditLog] = []
        self._last_hash: str = "0000000000000000000000000000000000000000000000000000000000000000"
        self._seed_demo_logs()

    def _compute_hash(self, prev_hash: str, timestamp: datetime, user_id: str, event_type: str, details: str) -> str:
        payload = f"{prev_hash}:{timestamp.isoformat()}:{user_id}:{event_type}:{details}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def log_event(
        self,
        user_id: str,
        event_type: AuditEventType,
        event_details: str,
        user_name: Optional[str] = None,
        resource_id: Optional[str] = None,
        resource_type: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = "127.0.0.1",
        blockchain_tx_ref: Optional[str] = None,
    ) -> AuditLog:
        now = datetime.utcnow()
        new_hash = self._compute_hash(self._last_hash, now, user_id, event_type.value, event_details)
        self._last_hash = new_hash

        log_entry = AuditLog(
            id=f"aud_{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            user_name=user_name,
            event_type=event_type,
            resource_id=resource_id,
            resource_type=resource_type,
            event_details=event_details,
            metadata=metadata or {},
            ip_address=ip_address,
            tamper_evident_hash=new_hash,
            blockchain_tx_ref=blockchain_tx_ref,
            timestamp=now
        )
        self._audit_logs.append(log_entry)
        return log_entry

    def get_logs(
        self,
        limit: int = 50,
        event_type: Optional[AuditEventType] = None,
        user_id: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[AuditLog]:
        results = self._audit_logs.copy()
        if event_type:
            results = [log for log in results if log.event_type == event_type]
        if user_id:
            results = [log for log in results if log.user_id == user_id]
        if search:
            s = search.lower()
            results = [
                log for log in results
                if s in log.event_details.lower() or (log.user_name and s in log.user_name.lower()) or (log.resource_id and s in log.resource_id.lower())
            ]
        # Return newest first
        results.sort(key=lambda x: x.timestamp, reverse=True)
        return results[:limit]

    def _seed_demo_logs(self):
        demo_events = [
            ("usr_admin_01", "Sarah Connor", AuditEventType.LOGIN, "Administrator session initialized with MFA", None, "192.168.1.10"),
            ("usr_inst_01", "Dr. Eleanor Vance", AuditEventType.INSTITUTION_APPROVAL, "Institutional issuer application approved for MIT Registrar", "inst_mit_01", "18.9.22.4"),
            ("usr_inst_01", "Dr. Eleanor Vance", AuditEventType.CREDENTIAL_ISSUANCE, "Digital Master of Science credential issued for Alex Mercer", "cred_ms_2026_01", "18.9.22.4"),
            ("usr_verif_01", "Marcus Chen", AuditEventType.VERIFICATION_REQUEST, "Bulk verification initiated for 24 candidate certificates", "batch_apex_01", "103.25.14.9"),
            ("usr_indiv_01", "Alex Mercer", AuditEventType.DOCUMENT_UPLOAD, "Uploaded Bachelor of Science in Computer Science certificate", "doc_demo_degree_01", "127.0.0.1"),
            ("usr_indiv_01", "Alex Mercer", AuditEventType.VERIFICATION_COMPLETION, "Completed multi-stage verification analysis for degree certificate", "doc_demo_degree_01", "127.0.0.1"),
        ]

        base_time = datetime.utcnow() - timedelta(days=5)
        for i, (uid, uname, etype, details, resid, ip) in enumerate(demo_events):
            t = base_time + timedelta(hours=i * 18)
            h = self._compute_hash(self._last_hash, t, uid, etype.value, details)
            self._last_hash = h
            self._audit_logs.append(AuditLog(
                id=f"aud_demo_{i+1:02d}",
                user_id=uid,
                user_name=uname,
                event_type=etype,
                resource_id=resid,
                resource_type="document" if resid and "doc" in resid else "credential",
                event_details=details,
                ip_address=ip,
                tamper_evident_hash=h,
                blockchain_tx_ref=f"0x8f2d{i}a3e74b98c{i}0f1a92e35b71904a{i}c",
                timestamp=t
            ))


audit_service = AuditService()
