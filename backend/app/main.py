from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import (
    auth,
    users,
    documents,
    verification,
    credentials,
    institutions,
    bulk_verification,
    analytics,
    notifications,
    audit,
    assistant,
    ai_analysis,
    blockchain,
    rag
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise RegTech/GovTech digital trust platform combining AI, Computer Vision, OCR, and Blockchain for verifiable document authentication.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API V1 routes
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(verification.router, prefix=settings.API_V1_STR)
app.include_router(credentials.router, prefix=settings.API_V1_STR)
app.include_router(institutions.router, prefix=settings.API_V1_STR)
app.include_router(bulk_verification.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(ai_analysis.router, prefix=settings.API_V1_STR)
app.include_router(blockchain.router, prefix=settings.API_V1_STR)
app.include_router(rag.router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "platform": "TrustChain AI",
        "tagline": "Building a Trusted Digital Future Through Intelligent Verification.",
        "status": "operational",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "mode": "Demonstration & Development" if settings.DEMO_MODE else "Production",
        "api_v1_base": settings.API_V1_STR
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": "Cloud Firestore (Configured / Demo Hybrid)",
        "storage": "Local & Firebase Storage Abstraction Active",
        "blockchain_bridge": "Sepolia Testnet Interface Initialized (Phase 3)",
        "ai_pipeline": "OCR & Computer Vision Interface Initialized (Phase 2)",
    }
