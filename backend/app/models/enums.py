from enum import Enum


class UserRole(str, Enum):
    INDIVIDUAL = "individual"
    INSTITUTION = "institution"
    VERIFIER = "verifier"
    ADMIN = "admin"


class DocumentCategory(str, Enum):
    DEGREE = "degree"
    MARKSHEET = "marksheet"
    INTERNSHIP = "internship"
    TRAINING = "training"
    EXPERIENCE = "experience"
    SKILL = "skill"
    OTHER = "other"


class VerificationStatus(str, Enum):
    UPLOADED = "uploaded"
    QUEUED = "queued"
    PROCESSING = "processing"
    ANALYZED = "analyzed"
    VERIFIED = "verified"
    REVIEW_REQUIRED = "review_required"
    FAILED = "failed"
    ERROR = "error"


class CredentialStatus(str, Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"
    PENDING = "pending"
    NOT_REGISTERED = "not_registered"


class InstitutionStatus(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class AuditEventType(str, Enum):
    LOGIN = "login"
    DOCUMENT_UPLOAD = "document_upload"
    DOCUMENT_DELETION = "document_deletion"
    VERIFICATION_REQUEST = "verification_request"
    VERIFICATION_COMPLETION = "verification_completion"
    CREDENTIAL_ISSUANCE = "credential_issuance"
    CREDENTIAL_REVOCATION = "credential_revocation"
    INSTITUTION_APPROVAL = "institution_approval"
    PERMISSION_CHANGE = "permission_change"
    REPORT_GENERATION = "report_generation"
    KNOWLEDGE_SOURCE_UPLOAD = "knowledge_source_upload"
    KNOWLEDGE_SOURCE_DELETE = "knowledge_source_delete"
    RAG_QUERY = "rag_query"
    BLOCKCHAIN_REGISTRATION = "blockchain_registration"
    BLOCKCHAIN_VERIFY = "blockchain_verify"
    BLOCKCHAIN_REVOCATION = "blockchain_revocation"
