from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, require_role, DEMO_USERS_DB
from app.models.enums import UserRole
from app.schemas.schemas import UserResponse, UserUpdateRequest

router = APIRouter(prefix="/users", tags=["Users"])


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    email = current_user["email"]
    user = DEMO_USERS_DB.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.full_name is not None:
        user["full_name"] = update_data.full_name
    if update_data.organization_name is not None:
        user["organization_name"] = update_data.organization_name
    if update_data.organization_type is not None:
        user["organization_type"] = update_data.organization_type
    if update_data.designation is not None:
        user["designation"] = update_data.designation
    if update_data.country is not None:
        user["country"] = update_data.country

    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        organization_name=user.get("organization_name"),
        organization_type=user.get("organization_type"),
        designation=user.get("designation"),
        country=user.get("country"),
        is_active=user["is_active"],
        is_verified=user["is_verified"],
        created_at=user["created_at"]
    )


@router.get("/all", response_model=List[UserResponse])
async def list_all_users(
    admin: dict = Depends(require_role([UserRole.ADMIN]))
):
    return [
        UserResponse(
            id=u["id"],
            email=u["email"],
            full_name=u["full_name"],
            role=u["role"],
            organization_name=u.get("organization_name"),
            organization_type=u.get("organization_type"),
            designation=u.get("designation"),
            country=u.get("country"),
            is_active=u["is_active"],
            is_verified=u["is_verified"],
            created_at=u["created_at"]
        )
        for u in DEMO_USERS_DB.values()
    ]
