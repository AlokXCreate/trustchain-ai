from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

from app.core.security import get_current_user, require_role
from app.services.audit_service import audit_service, AuditEventType
from blockchain.contract_service import contract_service
from blockchain.hashing_service import hashing_service
from blockchain.qr_service import qr_service

router = APIRouter(prefix="/blockchain", tags=["Blockchain Credential Verification"])


# --- Schemas ---

class CredentialRegisterRequest(BaseModel):
    credential_id: str = Field(..., description="Unique credential identifier, e.g. TC-CRED-2026-X8Y9")
    document_hash: str = Field(..., description="64-character SHA-256 hexadecimal hash of the document bytes")
    expiration_timestamp: int = Field(0, description="Unix timestamp for expiration (0 if lifetime)")
    credential_type: str = Field("degree_certificate", description="Credential classification type")
    issuer_name: Optional[str] = Field(None, description="Issuing authority name")
    organization: Optional[str] = Field(None, description="Issuing institution or university")


class CredentialVerifyRequest(BaseModel):
    credential_id: Optional[str] = Field(None, description="Credential ID to verify")
    document_hash: Optional[str] = Field(None, description="SHA-256 document hash to match against")


class CredentialRevokeRequest(BaseModel):
    reason: str = Field("Clerical error or administrative invalidation", description="Audit reason for revocation")


# --- Endpoints ---

@router.get("/status")
async def get_blockchain_status():
    """
    Returns real-time blockchain network connection, smart contract address,
    block height, and registered credential telemetry.
    """
    return contract_service.get_status()


@router.post("/credentials/register")
async def register_credential(
    req: CredentialRegisterRequest,
    current_user: dict = Depends(require_role(["admin", "issuer", "institution"]))
):
    """
    Registers a new digital credential in the TrustChain smart contract registry.
    Restricted to authorized university/institutional issuers and system administrators.
    """
    result = contract_service.register_credential(
        credential_id=req.credential_id.strip(),
        document_hash=req.document_hash.strip(),
        expiration_timestamp=req.expiration_timestamp,
        credential_type=req.credential_type
    )

    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to register credential on blockchain.")
        )

    # Generate QR verification payload
    qr_data = qr_service.generate_credential_qr_payload(req.credential_id.strip())

    audit_service.log_event(
        user_id=current_user.get("id", "usr_issuer"),
        user_name=current_user.get("full_name", "Authorized Issuer"),
        event_type=AuditEventType.BLOCKCHAIN_REGISTRATION,
        event_details=f"Registered credential '{req.credential_id}' on blockchain registry",
        resource_id=req.credential_id,
        resource_type="blockchain_credential",
        metadata={
            "action": "blockchain_credential_registration",
            "document_hash": req.document_hash,
            "credential_type": req.credential_type,
            "tx_hash": result["credential"].get("transaction_hash")
        }
    )

    return {
        "success": True,
        "message": "Credential registered on blockchain registry.",
        "credential": result["credential"],
        "qr": qr_data
    }


@router.post("/credentials/verify")
async def verify_credential(req: CredentialVerifyRequest):
    """
    Public verification endpoint (accessible without authentication).
    Verifies credential validity, revocation status, expiration, and cryptographic hash match.
    """
    if not req.credential_id and not req.document_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide either 'credential_id' or 'document_hash'."
        )

    if req.credential_id:
        res = contract_service.verify_credential(
            credential_id=req.credential_id.strip(),
            document_hash=req.document_hash.strip() if req.document_hash else None
        )
    else:
        res = contract_service.verify_by_hash(document_hash=req.document_hash.strip())

    return res


@router.post("/credentials/verify-file")
async def verify_credential_file(
    file: UploadFile = File(...),
    credential_id: Optional[str] = Form(None)
):
    """
    Public verification via direct document upload.
    Computes SHA-256 hash from raw uploaded bytes and checks the blockchain registry.
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    computed_hash = hashing_service.compute_sha256(content)

    if credential_id and credential_id.strip():
        res = contract_service.verify_credential(
            credential_id=credential_id.strip(),
            document_hash=computed_hash
        )
    else:
        res = contract_service.verify_by_hash(document_hash=computed_hash)

    res["computed_sha256"] = f"0x{computed_hash}"
    res["filename"] = file.filename
    res["file_size_bytes"] = len(content)

    return res


@router.get("/credentials/{credential_id}")
async def get_credential(credential_id: str):
    """
    Retrieves full credential metadata record by Credential ID.
    """
    res = contract_service.verify_credential(credential_id)
    if res.get("status") == "Unregistered":
        raise HTTPException(status_code=404, detail=f"Credential '{credential_id}' not found.")
    return res


@router.post("/credentials/{credential_id}/revoke")
async def revoke_credential(
    credential_id: str,
    req: CredentialRevokeRequest,
    current_user: dict = Depends(require_role(["admin", "issuer", "institution"]))
):
    """
    Revokes a credential in the blockchain registry.
    Restricted to authorized issuers and administrators.
    """
    res = contract_service.revoke_credential(credential_id, reason=req.reason)
    if not res.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=res.get("error", "Revocation failed.")
        )

    audit_service.log_event(
        user_id=current_user.get("id", "usr_issuer"),
        user_name=current_user.get("full_name", "Authorized Issuer"),
        event_type=AuditEventType.BLOCKCHAIN_REVOCATION,
        event_details=f"Revoked credential '{credential_id}' on blockchain: {req.reason}",
        resource_id=credential_id,
        resource_type="blockchain_credential",
        metadata={
            "action": "blockchain_credential_revocation",
            "reason": req.reason
        }
    )

    return res


@router.get("/credentials/{credential_id}/qr")
async def get_credential_qr(credential_id: str):
    """
    Returns the privacy-compliant verification QR code for a credential.
    """
    return qr_service.generate_credential_qr_payload(credential_id)
