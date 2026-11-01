from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, require_role
from app.models.enums import UserRole, CredentialStatus
from app.schemas.schemas import (
    CredentialCreateRequest,
    CredentialResponse,
    CredentialVerifyResponse
)
from app.services.credential_service import credential_service

router = APIRouter(prefix="/credentials", tags=["Credentials"])


@router.post("/issue", response_model=CredentialResponse)
async def issue_credential(
    req: CredentialCreateRequest,
    current_user: dict = Depends(require_role([UserRole.INSTITUTION, UserRole.ADMIN]))
):
    institution_name = current_user.get("organization_name") or "Authorized Credentialing Authority"
    cred = credential_service.issue_credential(
        data=req,
        issuer_institution_name=institution_name,
        institution_id=current_user.get("id"),
        issuer_user_id=current_user["id"],
        issuer_user_name=current_user["full_name"]
    )
    return CredentialResponse(
        id=cred.id,
        credential_id=cred.credential_id,
        holder_name=cred.holder_name,
        holder_email=cred.holder_email,
        issuing_institution=cred.issuing_institution,
        institution_id=cred.institution_id,
        credential_type=cred.credential_type,
        program_or_course=cred.program_or_course,
        issue_date=cred.issue_date,
        expiration_date=cred.expiration_date,
        status=cred.status,
        blockchain_tx_hash=cred.blockchain_tx_hash,
        qr_payload=cred.qr_payload,
        grade_or_score=cred.grade_or_score,
        skills=cred.skills,
        created_at=cred.created_at
    )


@router.get("/list", response_model=List[CredentialResponse])
async def list_credentials(
    status: Optional[CredentialStatus] = None,
    current_user: dict = Depends(get_current_user)
):
    user_role = current_user.get("role")
    holder_email = None
    institution_id = None

    if user_role == UserRole.INDIVIDUAL:
        holder_email = current_user.get("email")
    elif user_role == UserRole.INSTITUTION:
        institution_id = current_user.get("id")

    creds = credential_service.list_credentials(
        holder_email=holder_email,
        institution_id=institution_id,
        status=status
    )
    return [
        CredentialResponse(
            id=c.id,
            credential_id=c.credential_id,
            holder_name=c.holder_name,
            holder_email=c.holder_email,
            issuing_institution=c.issuing_institution,
            institution_id=c.institution_id,
            credential_type=c.credential_type,
            program_or_course=c.program_or_course,
            issue_date=c.issue_date,
            expiration_date=c.expiration_date,
            status=c.status,
            blockchain_tx_hash=c.blockchain_tx_hash,
            qr_payload=c.qr_payload,
            grade_or_score=c.grade_or_score,
            skills=c.skills,
            created_at=c.created_at
        )
        for c in creds
    ]


@router.get("/verify/{credential_id}", response_model=CredentialVerifyResponse)
async def verify_credential_public(credential_id: str):
    is_valid, cred, message = credential_service.verify_credential(credential_id)
    cred_resp = None
    if cred:
        cred_resp = CredentialResponse(
            id=cred.id,
            credential_id=cred.credential_id,
            holder_name=cred.holder_name,
            holder_email=cred.holder_email,
            issuing_institution=cred.issuing_institution,
            institution_id=cred.institution_id,
            credential_type=cred.credential_type,
            program_or_course=cred.program_or_course,
            issue_date=cred.issue_date,
            expiration_date=cred.expiration_date,
            status=cred.status,
            blockchain_tx_hash=cred.blockchain_tx_hash,
            qr_payload=cred.qr_payload,
            grade_or_score=cred.grade_or_score,
            skills=cred.skills,
            created_at=cred.created_at
        )

    from blockchain.contract_service import contract_service
    chain_res = contract_service.verify_credential(credential_id)
    blockchain_verified = chain_res.get("verified", False)

    return CredentialVerifyResponse(
        is_valid=is_valid,
        credential=cred_resp,
        issuer_verified=is_valid,
        blockchain_verified=blockchain_verified,
        message=message
    )


@router.post("/revoke")
async def revoke_credential(
    payload: dict,
    current_user: dict = Depends(require_role([UserRole.INSTITUTION, UserRole.ADMIN]))
):
    credential_id = payload.get("credential_id")
    reason = payload.get("reason", "Revoked by issuer authority.")
    if not credential_id:
        raise HTTPException(status_code=400, detail="credential_id is required")

    cred = credential_service.revoke_credential(
        credential_id=credential_id,
        reason=reason,
        user_id=current_user["id"],
        user_name=current_user["full_name"]
    )
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    return {"status": "success", "message": f"Credential {credential_id} successfully revoked."}
