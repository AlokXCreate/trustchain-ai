export type UserRole = 'individual' | 'institution' | 'verifier' | 'admin';

export type DocumentCategory = 
  | 'degree' 
  | 'marksheet' 
  | 'internship' 
  | 'training' 
  | 'experience' 
  | 'skill' 
  | 'other';

export type VerificationStatus = 
  | 'uploaded' 
  | 'queued' 
  | 'processing' 
  | 'analyzed' 
  | 'verified' 
  | 'review_required' 
  | 'failed' 
  | 'error';

export type CredentialStatus = 
  | 'active' 
  | 'revoked' 
  | 'expired' 
  | 'pending' 
  | 'not_registered';

export type InstitutionStatus = 
  | 'pending' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'suspended';

export type AuditEventType = 
  | 'login' 
  | 'document_upload' 
  | 'document_deletion' 
  | 'verification_request' 
  | 'verification_completion' 
  | 'credential_issuance' 
  | 'credential_revocation' 
  | 'institution_approval' 
  | 'permission_change' 
  | 'report_generation';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_name?: string;
  organization_type?: string;
  designation?: string;
  country?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  file_type: string;
  file_size_bytes: number;
  file_url?: string;
  issuer_name?: string;
  certificate_number?: string;
  issue_date?: string;
  expiration_date?: string;
  uploaded_by: string;
  uploader_name?: string;
  status: VerificationStatus;
  verification_result_id?: string;
  is_demo?: boolean;
  created_at: string;
}

export interface VerificationStep {
  step_number: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'awaiting_service' | 'review_required';
  message: string;
  timestamp?: string;
  details?: Record<string, any>;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OCRTextBlock {
  id: string;
  page?: number;
  text: string;
  confidence: number;
  bounding_box: BoundingBox;
}

export interface TamperRegion {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'positive';
  bounding_box: BoundingBox;
  description: string;
}

export interface AnomalyFinding {
  id?: string;
  category?: string;
  type?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title?: string;
  description: string;
  observed_value?: string;
  evidence_source?: string;
  recommended_action?: string;
  bounding_box?: BoundingBox | null;
  confidence?: number;
}

export interface AIAnalysisResult {
  document_id: string;
  report_id: string;
  status: string;
  document_type: {
    predicted_type: string;
    confidence: number;
    alternatives: Array<{ type: string; confidence: number }>;
  };
  quality_assessment: {
    quality_score: number;
    blur_detected: boolean;
    low_resolution: boolean;
    skew_detected: boolean;
    skew_angle?: number;
    contrast_level: string;
    noise_metric?: number;
    laplacian_variance?: number;
    recommendation: string;
  };
  ocr_result: {
    total_pages: number;
    overall_confidence: number;
    pages: Array<{
      page_number: number;
      extracted_text: string;
      text_blocks: OCRTextBlock[];
    }>;
  };
  qr_result?: {
    qr_detected: boolean;
    qr_content?: string;
    decoded_url?: string;
    certificate_identifier?: string;
    validation_status: string;
    is_trusted_domain: boolean;
    risk_notes: string[];
  };
  extracted_information: {
    extracted_fields: Record<string, {
      field_name: string;
      value: any;
      confidence: number;
      source_text?: string;
    }>;
  };
  image_forensics: {
    error_level_analysis: {
      mean_residual: number;
      max_residual: number;
      inconsistency_detected: boolean;
      ela_preview_base64?: string;
    };
    seal_detection: { seal_detected: boolean; count: number };
    signature_detection: { signature_detected: boolean; count: number };
    suspicious_regions: TamperRegion[];
  };
  risk_assessment: {
    risk_score: number;
    category_key: string;
    category_label: string;
    verdict_phrase: string;
    action_recommendation: string;
    explanation: string;
    component_breakdown?: Record<string, any>;
    risk_factors: string[];
    positive_factors: string[];
    disclaimer: string;
  };
  findings: AnomalyFinding[];
  visual_overlays: {
    ocr_boxes: OCRTextBlock[];
    tamper_boxes: TamperRegion[];
    ela_preview_base64?: string;
  };
  disclaimer: string;
}

export interface VerificationResult {
  id: string;
  document_id: string;
  status: VerificationStatus;
  risk_score?: number | null;
  confidence?: number | null;
  extracted_data: Record<string, any>;
  anomaly_findings: AnomalyFinding[];
  blockchain_status: string;
  blockchain_tx_hash?: string | null;
  ai_explanation?: string | null;
  steps: VerificationStep[];
  created_at: string;
  completed_at?: string | null;
}

export interface Credential {
  id: string;
  credential_id: string;
  holder_name: string;
  holder_email?: string;
  issuing_institution: string;
  institution_id?: string;
  credential_type: DocumentCategory;
  program_or_course: string;
  issue_date: string;
  expiration_date?: string;
  status: CredentialStatus;
  blockchain_tx_hash?: string | null;
  qr_payload: string;
  grade_or_score?: string;
  skills: string[];
  created_at: string;
}

export interface Institution {
  id: string;
  name: string;
  official_domain: string;
  organization_type: string;
  registration_number: string;
  website: string;
  address: string;
  contact_email: string;
  status: InstitutionStatus;
  approval_date?: string | null;
  credentials_issued_count: number;
  verification_count: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  event_type: AuditEventType;
  resource_id?: string;
  resource_type?: string;
  event_details: string;
  ip_address?: string;
  tamper_evident_hash: string;
  blockchain_tx_ref?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant';
  content: string;
  sources: string[];
  citations?: RAGCitation[];
  evidence_sufficiency?: 'high' | 'moderate' | 'insufficient';
  timestamp: string;
}

export interface BatchItem {
  id: string;
  batch_name: string;
  uploaded_by: string;
  total_documents: number;
  processed_documents: number;
  verified_count: number;
  flagged_count: number;
  failed_count: number;
  status: string;
  created_at: string;
  completed_at?: string;
}

export interface DashboardMetrics {
  total_documents_analyzed: number;
  verified_credentials: number;
  documents_requiring_review: number;
  verification_requests: number;
  blockchain_verified_documents: number;
  verification_success_rate: number;
  monthly_activity: Array<{ month: string; verified: number; flagged: number; pending: number }>;
  category_distribution: Array<{ category: string; count: number }>;
  status_distribution: Array<{ name: string; value: number; color: string }>;
  recent_activity: Array<{
    id: string;
    document_name: string;
    category: string;
    upload_date: string;
    status: string;
    risk_score?: number | null;
    blockchain_status: string;
    issuer: string;
  }>;
}

export interface RAGCitation {
  citation_type: 'knowledge_base' | 'verification_report';
  source_title: string;
  institution: string;
  category: string;
  page_number: number;
  excerpt: string;
  similarity_score?: number;
}

export interface RAGChatResponse {
  answer: string;
  citations: RAGCitation[];
  evidence_sufficiency: 'high' | 'moderate' | 'insufficient';
  grounded: boolean;
  retrieved_chunks_count?: number;
  document_context_attached?: boolean;
  model: string;
}

export interface KnowledgeBaseSource {
  source_id: string;
  title: string;
  institution: string;
  category: string;
  description: string;
  trust_status: string;
  chunk_count: number;
  created_at: number;
  updated_at: number;
  source_type: string;
  filename?: string;
  file_size_bytes?: number;
}

export interface BlockchainStatusResponse {
  connected: boolean;
  network: string;
  rpc_url: string;
  chain_id: number;
  contract_address: string;
  contract_ready: boolean;
  latest_block?: number;
  total_registered: number;
  mode: string;
  description: string;
}

export interface BlockchainVerifyResponse {
  verified: boolean;
  status: 'Verified' | 'Hash Mismatch' | 'Revoked' | 'Expired' | 'Unregistered';
  credential_id?: string;
  document_hash?: string;
  computed_sha256?: string;
  hash_matches?: boolean | null;
  is_active?: boolean;
  is_revoked?: boolean;
  is_expired?: boolean;
  issuer?: string;
  issue_timestamp?: number;
  expiration_timestamp?: number;
  credential_type?: string;
  transaction_hash?: string;
  block_number?: number;
  message?: string;
  credential?: any;
  filename?: string;
  file_size_bytes?: number;
}
