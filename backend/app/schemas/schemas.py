from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from app.models.enums import (
    UserRole,
    DocumentCategory,
    VerificationStatus,
    CredentialStatus,
    InstitutionStatus,
    AuditEventType,
)
from app.models.entities import VerificationStep


# Authentication & Users
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.INDIVIDUAL
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    designation: Optional[str] = None
    country: Optional[str] = "United States"


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    designation: Optional[str] = None
    country: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    designation: Optional[str] = None
    country: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime


# Documents
class DocumentResponse(BaseModel):
    id: str
    name: str
    category: DocumentCategory
    file_type: str
    file_size_bytes: int
    file_url: Optional[str] = None
    issuer_name: Optional[str] = None
    certificate_number: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    uploaded_by: str
    uploader_name: Optional[str] = None
    status: VerificationStatus
    verification_result_id: Optional[str] = None
    is_demo: bool = False
    created_at: datetime


# Verification
class VerificationInitiateRequest(BaseModel):
    document_id: str


class VerificationResultResponse(BaseModel):
    id: str
    document_id: str
    status: VerificationStatus
    risk_score: Optional[float] = None
    confidence: Optional[float] = None
    extracted_data: Dict[str, Any] = {}
    anomaly_findings: List[Dict[str, Any]] = []
    blockchain_status: str
    blockchain_tx_hash: Optional[str] = None
    ai_explanation: Optional[str] = None
    steps: List[VerificationStep] = []
    created_at: datetime
    completed_at: Optional[datetime] = None


# Credentials
class CredentialCreateRequest(BaseModel):
    holder_name: str
    holder_email: Optional[str] = None
    credential_type: DocumentCategory
    program_or_course: str
    issue_date: str
    expiration_date: Optional[str] = None
    grade_or_score: Optional[str] = None
    skills: List[str] = []
    metadata: Dict[str, Any] = {}


class CredentialResponse(BaseModel):
    id: str
    credential_id: str
    holder_name: str
    holder_email: Optional[str] = None
    issuing_institution: str
    institution_id: Optional[str] = None
    credential_type: DocumentCategory
    program_or_course: str
    issue_date: str
    expiration_date: Optional[str] = None
    status: CredentialStatus
    blockchain_tx_hash: Optional[str] = None
    qr_payload: str
    grade_or_score: Optional[str] = None
    skills: List[str] = []
    created_at: datetime


class CredentialVerifyResponse(BaseModel):
    is_valid: bool
    credential: Optional[CredentialResponse] = None
    issuer_verified: bool = False
    blockchain_verified: bool = False
    message: str


# Institutions
class InstitutionApplyRequest(BaseModel):
    name: str
    official_domain: str
    organization_type: str
    registration_number: str
    website: str
    address: str
    contact_email: EmailStr


class InstitutionApprovalRequest(BaseModel):
    status: InstitutionStatus
    notes: Optional[str] = None


class InstitutionResponse(BaseModel):
    id: str
    name: str
    official_domain: str
    organization_type: str
    registration_number: str
    website: str
    address: str
    contact_email: str
    status: InstitutionStatus
    approval_date: Optional[datetime] = None
    credentials_issued_count: int
    verification_count: int
    created_at: datetime


# Batch Verification
class BatchVerificationResponse(BaseModel):
    id: str
    batch_name: str
    uploaded_by: str
    total_documents: int
    processed_documents: int
    verified_count: int
    flagged_count: int
    failed_count: int
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None


# Assistant
class ChatMessageRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str


class ChatMessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender: str
    content: str
    sources: List[str] = []
    timestamp: datetime


# Analytics & Dashboard
class DashboardMetricsResponse(BaseModel):
    total_documents_analyzed: int
    verified_credentials: int
    documents_requiring_review: int
    verification_requests: int
    blockchain_verified_documents: int
    verification_success_rate: float
    monthly_activity: List[Dict[str, Any]]
    category_distribution: List[Dict[str, Any]]
    status_distribution: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]


# Audit & Notifications
class AuditLogResponse(BaseModel):
    id: str
    user_id: str
    user_name: Optional[str] = None
    event_type: AuditEventType
    resource_id: Optional[str] = None
    resource_type: Optional[str] = None
    event_details: str
    ip_address: Optional[str] = None
    tamper_evident_hash: str
    blockchain_tx_ref: Optional[str] = None
    timestamp: datetime


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool
    action_url: Optional[str] = None
    created_at: datetime
