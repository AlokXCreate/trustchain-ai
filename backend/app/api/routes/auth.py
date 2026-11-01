from datetime import datetime, timedelta
import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    DEMO_USERS_DB,
)
from app.models.enums import UserRole, AuditEventType
from app.schemas.schemas import Token, UserRegisterRequest, UserLoginRequest, UserResponse
from app.services.audit_service import audit_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLoginRequest):
    email = credentials.email.lower()
    user = DEMO_USERS_DB.get(email)

    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"], "role": user["role"].value},
        expires_delta=access_token_expires
    )

    audit_service.log_event(
        user_id=user["id"],
        user_name=user["full_name"],
        event_type=AuditEventType.LOGIN,
        event_details=f"User {user['email']} successfully authenticated ({user['role'].value})"
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user={
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"].value,
            "organization_name": user.get("organization_name"),
            "organization_type": user.get("organization_type"),
            "designation": user.get("designation"),
            "country": user.get("country"),
        }
    )


@router.post("/register", response_model=UserResponse)
async def register(req: UserRegisterRequest):
    email = req.email.lower()
    if email in DEMO_USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    new_user = {
        "id": user_id,
        "email": email,
        "hashed_password": get_password_hash(req.password),
        "full_name": req.full_name,
        "role": req.role,
        "organization_name": req.organization_name,
        "organization_type": req.organization_type,
        "designation": req.designation,
        "country": req.country or "United States",
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    DEMO_USERS_DB[email] = new_user

    audit_service.log_event(
        user_id=user_id,
        user_name=req.full_name,
        event_type=AuditEventType.LOGIN,
        event_details=f"New user registered: {email} with role {req.role.value}"
    )

    return UserResponse(
        id=new_user["id"],
        email=new_user["email"],
        full_name=new_user["full_name"],
        role=new_user["role"],
        organization_name=new_user["organization_name"],
        organization_type=new_user["organization_type"],
        designation=new_user["designation"],
        country=new_user["country"],
        is_active=new_user["is_active"],
        is_verified=new_user["is_verified"],
        created_at=new_user["created_at"]
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        organization_name=current_user.get("organization_name"),
        organization_type=current_user.get("organization_type"),
        designation=current_user.get("designation"),
        country=current_user.get("country"),
        is_active=current_user.get("is_active", True),
        is_verified=current_user.get("is_verified", False),
        created_at=current_user.get("created_at", datetime.utcnow())
    )


@router.post("/forgot-password")
async def forgot_password(payload: dict):
    email = payload.get("email", "").lower()
    return {
        "status": "success",
        "message": f"If an account exists for {email}, password reset instructions have been dispatched."
    }
