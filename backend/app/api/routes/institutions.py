from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, require_role
from app.models.enums import UserRole, InstitutionStatus
from app.schemas.schemas import (
    InstitutionApplyRequest,
    InstitutionApprovalRequest,
    InstitutionResponse
)
from app.services.institution_service import institution_service

router = APIRouter(prefix="/institutions", tags=["Institutions"])


@router.get("/registry", response_model=List[InstitutionResponse])
async def list_institutions(
    status: Optional[InstitutionStatus] = None,
    search: Optional[str] = None
):
    insts = institution_service.list_institutions(status=status, search=search)
    return [
        InstitutionResponse(
            id=i.id,
            name=i.name,
            official_domain=i.official_domain,
            organization_type=i.organization_type,
            registration_number=i.registration_number,
            website=i.website,
            address=i.address,
            contact_email=i.contact_email,
            status=i.status,
            approval_date=i.approval_date,
            credentials_issued_count=i.credentials_issued_count,
            verification_count=i.verification_count,
            created_at=i.created_at
        )
        for i in insts
    ]


@router.post("/apply", response_model=InstitutionResponse)
async def apply_as_issuer(
    req: InstitutionApplyRequest,
    current_user: dict = Depends(get_current_user)
):
    inst = institution_service.apply_as_issuer(
        data=req,
        user_id=current_user["id"],
        user_name=current_user["full_name"]
    )
    return InstitutionResponse(
        id=inst.id,
        name=inst.name,
        official_domain=inst.official_domain,
        organization_type=inst.organization_type,
        registration_number=inst.registration_number,
        website=inst.website,
        address=inst.address,
        contact_email=inst.contact_email,
        status=inst.status,
        approval_date=inst.approval_date,
        credentials_issued_count=inst.credentials_issued_count,
        verification_count=inst.verification_count,
        created_at=inst.created_at
    )


@router.put("/{institution_id}/approve", response_model=InstitutionResponse)
async def update_institution_status(
    institution_id: str,
    req: InstitutionApprovalRequest,
    admin_user: dict = Depends(require_role([UserRole.ADMIN]))
):
    inst = institution_service.update_approval_status(
        institution_id=institution_id,
        approval_data=req,
        admin_id=admin_user["id"],
        admin_name=admin_user["full_name"]
    )
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return InstitutionResponse(
        id=inst.id,
        name=inst.name,
        official_domain=inst.official_domain,
        organization_type=inst.organization_type,
        registration_number=inst.registration_number,
        website=inst.website,
        address=inst.address,
        contact_email=inst.contact_email,
        status=inst.status,
        approval_date=inst.approval_date,
        credentials_issued_count=inst.credentials_issued_count,
        verification_count=inst.verification_count,
        created_at=inst.created_at
    )
