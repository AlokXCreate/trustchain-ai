from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.schemas.schemas import NotificationResponse
from app.services.notification_service import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/list", response_model=List[NotificationResponse])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    notifs = notification_service.get_user_notifications(current_user["id"])
    return [
        NotificationResponse(
            id=n.id,
            user_id=n.user_id,
            title=n.title,
            message=n.message,
            type=n.type,
            is_read=n.is_read,
            action_url=n.action_url,
            created_at=n.created_at
        )
        for n in notifs
    ]


@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    success = notification_service.mark_as_read(notification_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success", "message": "Notification marked as read"}


@router.put("/read-all")
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    notification_service.mark_all_as_read(current_user["id"])
    return {"status": "success", "message": "All notifications marked as read"}
