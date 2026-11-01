from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.schemas.schemas import VerificationInitiateRequest, VerificationResultResponse
from app.services.verification_service import verification_service
from app.services.document_service import document_service

router = APIRouter(prefix="/verification", tags=["Verification"])


@router.post("/initiate", response_model=VerificationResultResponse)
async def initiate_verification(
    req: VerificationInitiateRequest,
    current_user: dict = Depends(get_current_user)
):
    doc = document_service.get_by_id(req.document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    result = await verification_service.run_verification_pipeline(
        document_id=req.document_id,
        user_id=current_user["id"],
        user_name=current_user["full_name"]
    )

    return VerificationResultResponse(
        id=result.id,
        document_id=result.document_id,
        status=result.status,
        risk_score=result.risk_score,
        confidence=result.confidence,
        extracted_data=result.extracted_data,
        anomaly_findings=result.anomaly_findings,
        blockchain_status=result.blockchain_status,
        blockchain_tx_hash=result.blockchain_tx_hash,
        ai_explanation=result.ai_explanation,
        steps=result.steps,
        created_at=result.created_at,
        completed_at=result.completed_at
    )


@router.get("/{document_id}", response_model=VerificationResultResponse)
async def get_verification_result(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = verification_service.get_result_by_document_id(document_id)
    if not result:
        # If no result yet, run the pipeline on the fly
        doc = document_service.get_by_id(document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        result = await verification_service.run_verification_pipeline(
            document_id=document_id,
            user_id=current_user["id"],
            user_name=current_user["full_name"]
        )

    return VerificationResultResponse(
        id=result.id,
        document_id=result.document_id,
        status=result.status,
        risk_score=result.risk_score,
        confidence=result.confidence,
        extracted_data=result.extracted_data,
        anomaly_findings=result.anomaly_findings,
        blockchain_status=result.blockchain_status,
        blockchain_tx_hash=result.blockchain_tx_hash,
        ai_explanation=result.ai_explanation,
        steps=result.steps,
        created_at=result.created_at,
        completed_at=result.completed_at
    )
