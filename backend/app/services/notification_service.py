import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from app.models.entities import Notification


class NotificationService:
    def __init__(self):
        self._notifications: List[Notification] = []
        self._seed_demo_notifications()

    def create_notification(
        self,
        user_id: str,
        title: str,
        message: str,
        type: str = "info",
        action_url: Optional[str] = None
    ) -> Notification:
        notif = Notification(
            id=f"notif_{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            title=title,
            message=message,
            type=type,
            is_read=False,
            action_url=action_url,
            created_at=datetime.utcnow()
        )
        self._notifications.append(notif)
        return notif

    def get_user_notifications(self, user_id: str) -> List[Notification]:
        # Return user specific or global demo notifications
        notifs = [n for n in self._notifications if n.user_id == user_id or n.user_id == "all"]
        notifs.sort(key=lambda x: x.created_at, reverse=True)
        return notifs

    def mark_as_read(self, notification_id: str, user_id: str) -> bool:
        for n in self._notifications:
            if n.id == notification_id and (n.user_id == user_id or n.user_id == "all"):
                n.is_read = True
                return True
        return False

    def mark_all_as_read(self, user_id: str):
        for n in self._notifications:
            if n.user_id == user_id or n.user_id == "all":
                n.is_read = True

    def _seed_demo_notifications(self):
        now = datetime.utcnow()
        demo_notifs = [
            ("usr_indiv_01", "Verification Completed", "Your Stanford University degree certificate analysis is complete.", "success", "/app/verify/doc_demo_degree_01", now - timedelta(hours=2)),
            ("usr_indiv_01", "New Credential Registered", "MIT Office of Credentialing issued an active digital credential for your profile.", "info", "/app/credentials", now - timedelta(days=1)),
            ("usr_inst_01", "New Issuer Verification Request", "Apex Global Talent has submitted a verification inquiry for batch #741.", "info", "/app/issuers", now - timedelta(hours=5)),
            ("usr_verif_01", "Batch Processing Complete", "Batch #APX-2026-08 (24 documents) has completed pre-screening.", "success", "/app/bulk", now - timedelta(hours=8)),
            ("usr_admin_01", "Institution Application Pending", "Oxford Digital Academy submitted accreditation documents for review.", "warning", "/app/issuers", now - timedelta(hours=12)),
            ("all", "Platform Update", "TrustChain AI v1.0.0 architecture initialized with secure cryptographic audit logging.", "info", "/app/dashboard", now - timedelta(days=2))
        ]
        for uid, title, msg, ntype, url, t in demo_notifs:
            self._notifications.append(Notification(
                id=f"notif_{uuid.uuid4().hex[:8]}",
                user_id=uid,
                title=title,
                message=msg,
                type=ntype,
                is_read=False,
                action_url=url,
                created_at=t
            ))


notification_service = NotificationService()
