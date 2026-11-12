from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.enums import (
    UserRole,
    DocumentCategory,
    VerificationStatus,
    CredentialStatus,
    InstitutionStatus,
    AuditEventType,
    ReportFormat,
    EmailDeliveryStatus,
    RiskCategory,
)


class User(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole = UserRole.INDIVIDUAL
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    designation: Optional[str] = None
    country: Optional[str] = "United States"
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class VerificationStep(BaseModel):
    step_number: int
    name: str
    status: str  # pending, in_progress, completed, failed, awaiting_service
    message: str
    timestamp: Optional[datetime] = None
    details: Optional[Dict[str, Any]] = None


class VerificationResult(BaseModel):
    id: str
    document_id: str
    status: VerificationStatus
    risk_score: Optional[float] = None  # 0.0 (safe) to 1.0 (high risk)
    confidence: Optional[float] = None
    extracted_data: Dict[str, Any] = Field(default_factory=dict)
    anomaly_findings: List[Dict[str, Any]] = Field(default_factory=list)
    blockchain_status: str = "Blockchain verification pending smart contract integration (Phase 3)"
    blockchain_tx_hash: Optional[str] = None
    ai_explanation: Optional[str] = None
    steps: List[VerificationStep] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None


class Document(BaseModel):
    id: str
    name: str
    category: DocumentCategory
    file_type: str
    file_size_bytes: int
    file_path: str
    file_url: Optional[str] = None
    issuer_name: Optional[str] = None
    certificate_number: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    uploaded_by: str
    uploader_name: Optional[str] = None
    status: VerificationStatus = VerificationStatus.UPLOADED
    verification_result_id: Optional[str] = None
    is_demo: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Credential(BaseModel):
    id: str
    credential_id: str  # Public identifier like TC-2026-XXXX
    holder_name: str
    holder_email: Optional[str] = None
    issuing_institution: str
    institution_id: Optional[str] = None
    credential_type: DocumentCategory
    program_or_course: str
    issue_date: str
    expiration_date: Optional[str] = None
    status: CredentialStatus = CredentialStatus.ACTIVE
    blockchain_tx_hash: Optional[str] = None
    qr_payload: str
    grade_or_score: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Institution(BaseModel):
    id: str
    name: str
    official_domain: str
    organization_type: str  # University, Training Provider, Corporate, Certification Body
    registration_number: str
    website: str
    address: str
    contact_email: str
    status: InstitutionStatus = InstitutionStatus.PENDING
    approval_date: Optional[datetime] = None
    authorized_representatives: List[str] = Field(default_factory=list)
    logo_url: Optional[str] = None
    credentials_issued_count: int = 0
    verification_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuditLog(BaseModel):
    id: str
    user_id: str
    user_name: Optional[str] = None
    event_type: AuditEventType
    resource_id: Optional[str] = None
    resource_type: Optional[str] = None
    event_details: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    ip_address: Optional[str] = "127.0.0.1"
    tamper_evident_hash: str  # SHA-256 hash of previous block + event data
    blockchain_tx_ref: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Notification(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str  # info, success, warning, danger
    is_read: bool = False
    action_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ChatMessage(BaseModel):
    id: str
    conversation_id: str
    sender: str  # "user" | "assistant"
    content: str
    sources: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class VerificationBatch(BaseModel):
    id: str
    batch_name: str
    uploaded_by: str
    total_documents: int
    processed_documents: int = 0
    verified_count: int = 0
    flagged_count: int = 0
    failed_count: int = 0
    status: str = "processing"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None


class Report(BaseModel):
    id: str  # e.g. "TC-REP-2026-00101"
    document_id: str
    verification_session_id: str
    document_name: str
    category: str
    status: str  # "verified", "review_required", "failed"
    risk_score: int  # 0 to 100
    risk_category: str  # "Low Risk", "Moderate Risk", "High Risk", "Critical Risk"
    confidence: float = 0.95
    created_at: datetime = Field(default_factory=datetime.utcnow)
    generated_by: str = "TrustChain Automated Engine"
    confidentiality: str = "CONFIDENTIAL // OFFICIAL VERIFICATION DOSSIER"
    report_data: Dict[str, Any] = Field(default_factory=dict)
    integrity_hash: str  # SHA-256 of canonical report JSON
    version: int = 1
    is_archived: bool = False
    available_formats: List[str] = Field(default_factory=lambda: ["pdf", "docx", "json", "html"])


class ReportSummary(BaseModel):
    id: str
    document_id: str
    document_name: str
    category: str
    status: str
    risk_score: int
    risk_category: str
    created_at: datetime
    generated_by: str
    integrity_hash: str
    is_archived: bool = False
    available_formats: List[str]


class EmailDeliveryLog(BaseModel):
    id: str
    report_id: str
    recipient_email: str
    recipient_name: Optional[str] = None
    subject: str
    formats_attached: List[str]
    status: EmailDeliveryStatus = EmailDeliveryStatus.QUEUED
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    error_message: Optional[str] = None
    delivery_proof: Optional[Dict[str, Any]] = None


class ReportSchedule(BaseModel):
    id: str
    name: str
    frequency: str  # "daily", "weekly", "monthly"
    report_type: str  # "all", "high_risk_only", "batch_summary"
    recipient_emails: List[str]
    is_active: bool = True
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

