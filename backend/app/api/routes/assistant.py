from typing import List
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.schemas import ChatMessageRequest, ChatMessageResponse
from app.services.assistant_service import assistant_service

router = APIRouter(prefix="/assistant", tags=["TrustChain AI Assistant"])


@router.post("/chat", response_model=ChatMessageResponse)
async def chat_with_assistant(
    req: ChatMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    msg = await assistant_service.send_message(
        conversation_id=req.conversation_id,
        message_text=req.message
    )
    return ChatMessageResponse(
        id=msg.id,
        conversation_id=msg.conversation_id,
        sender=msg.sender,
        content=msg.content,
        sources=msg.sources,
        timestamp=msg.timestamp
    )


@router.get("/conversation/{conversation_id}", response_model=List[ChatMessageResponse])
async def get_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    msgs = assistant_service.get_conversation(conversation_id)
    return [
        ChatMessageResponse(
            id=m.id,
            conversation_id=m.conversation_id,
            sender=m.sender,
            content=m.content,
            sources=m.sources,
            timestamp=m.timestamp
        )
        for m in msgs
    ]
