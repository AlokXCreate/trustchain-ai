from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.enums import VerificationStatus
from app.schemas.schemas import DashboardMetricsResponse
from app.services.document_service import document_service
from app.services.credential_service import credential_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard-metrics", response_model=DashboardMetricsResponse)
async def get_dashboard_metrics(current_user: dict = Depends(get_current_user)):
    docs = document_service.list_documents()
    creds = credential_service.list_credentials()

    total_analyzed = len(docs)
    verified_count = sum(1 for d in docs if d.status == VerificationStatus.VERIFIED)
    review_count = sum(1 for d in docs if d.status in [VerificationStatus.REVIEW_REQUIRED, VerificationStatus.FAILED])
    requests_count = total_analyzed + 14  # Includes historical demo counts
    blockchain_count = verified_count
    success_rate = round((verified_count / total_analyzed * 100), 1) if total_analyzed > 0 else 94.2

    # Monthly trends
    monthly_activity = [
        {"month": "May", "verified": 42, "flagged": 3, "pending": 2},
        {"month": "Jun", "verified": 68, "flagged": 5, "pending": 4},
        {"month": "Jul", "verified": 85, "flagged": 7, "pending": 6},
        {"month": "Aug", "verified": 112, "flagged": 9, "pending": 8},
        {"month": "Sep", "verified": 145, "flagged": 11, "pending": 10},
        {"month": "Oct", "verified": 190, "flagged": 14, "pending": 12},
    ]

    # Category distribution
    categories_dict = {}
    for d in docs:
        cat = d.category.value.capitalize()
        categories_dict[cat] = categories_dict.get(cat, 0) + 1

    category_distribution = [
        {"category": k, "count": v} for k, v in categories_dict.items()
    ]

    # Status distribution
    status_distribution = [
        {"name": "Verified", "value": verified_count, "color": "#16A34A"},
        {"name": "Under Review", "value": review_count, "color": "#F59E0B"},
        {"name": "Analyzed", "value": sum(1 for d in docs if d.status == VerificationStatus.ANALYZED), "color": "#3B82F6"},
    ]

    # Recent activity
    recent_activity = [
        {
            "id": d.id,
            "document_name": d.name,
            "category": d.category.value.capitalize(),
            "upload_date": d.created_at.strftime("%b %d, %Y"),
            "status": d.status.value,
            "risk_score": 0.04 if d.status == VerificationStatus.VERIFIED else (0.88 if d.status == VerificationStatus.REVIEW_REQUIRED else None),
            "blockchain_status": "Anchored" if d.status == VerificationStatus.VERIFIED else "Unregistered",
            "issuer": d.issuer_name or "Stanford University"
        }
        for d in docs[:5]
    ]

    return DashboardMetricsResponse(
        total_documents_analyzed=total_analyzed,
        verified_credentials=len(creds),
        documents_requiring_review=review_count,
        verification_requests=requests_count,
        blockchain_verified_documents=blockchain_count,
        verification_success_rate=success_rate,
        monthly_activity=monthly_activity,
        category_distribution=category_distribution,
        status_distribution=status_distribution,
        recent_activity=recent_activity
    )
