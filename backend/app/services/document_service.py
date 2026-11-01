import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from app.models.entities import Document
from app.models.enums import DocumentCategory, VerificationStatus, AuditEventType
from app.services.audit_service import audit_service


class DocumentService:
    def __init__(self):
        self._documents: List[Document] = []
        self._seed_demo_documents()

    def list_documents(
        self,
        user_id: Optional[str] = None,
        category: Optional[DocumentCategory] = None,
        status: Optional[VerificationStatus] = None,
        search: Optional[str] = None,
        is_admin_or_verifier: bool = False
    ) -> List[Document]:
        results = self._documents.copy()
        # If user is not admin or verifier, only show their own documents or demo documents
        if not is_admin_or_verifier and user_id:
            results = [d for d in results if d.uploaded_by == user_id or d.is_demo]
        if category:
            results = [d for d in results if d.category == category]
        if status:
            results = [d for d in results if d.status == status]
        if search:
            s = search.lower()
            results = [
                d for d in results
                if s in d.name.lower() or (d.issuer_name and s in d.issuer_name.lower()) or (d.certificate_number and s in d.certificate_number.lower())
            ]
        results.sort(key=lambda x: x.created_at, reverse=True)
        return results

    def get_by_id(self, document_id: str) -> Optional[Document]:
        for doc in self._documents:
            if doc.id == document_id:
                return doc
        return None

    def get_document(self, document_id: str) -> Optional[Document]:
        """Convenience alias for get_by_id."""
        return self.get_by_id(document_id)

    def create_document(
        self,
        name: str,
        category: DocumentCategory,
        file_type: str,
        file_size_bytes: int,
        file_path: str,
        file_url: Optional[str],
        uploaded_by: str,
        uploader_name: Optional[str],
        issuer_name: Optional[str] = None,
        certificate_number: Optional[str] = None,
        issue_date: Optional[str] = None,
        expiration_date: Optional[str] = None,
    ) -> Document:
        doc = Document(
            id=f"doc_{uuid.uuid4().hex[:10]}",
            name=name,
            category=category,
            file_type=file_type,
            file_size_bytes=file_size_bytes,
            file_path=file_path,
            file_url=file_url,
            issuer_name=issuer_name,
            certificate_number=certificate_number,
            issue_date=issue_date,
            expiration_date=expiration_date,
            uploaded_by=uploaded_by,
            uploader_name=uploader_name,
            status=VerificationStatus.UPLOADED,
            is_demo=False,
            created_at=datetime.utcnow()
        )
        self._documents.append(doc)

        audit_service.log_event(
            user_id=uploaded_by,
            user_name=uploader_name,
            event_type=AuditEventType.DOCUMENT_UPLOAD,
            resource_id=doc.id,
            resource_type="document",
            event_details=f"Uploaded document '{doc.name}' ({doc.category.value})",
            metadata={"file_size": file_size_bytes, "file_type": file_type}
        )
        return doc

    def delete_document(self, document_id: str, user_id: str, user_name: str, is_admin: bool = False) -> bool:
        doc = self.get_by_id(document_id)
        if not doc:
            return False
        if not is_admin and doc.uploaded_by != user_id:
            return False

        self._documents = [d for d in self._documents if d.id != document_id]
        audit_service.log_event(
            user_id=user_id,
            user_name=user_name,
            event_type=AuditEventType.DOCUMENT_DELETION,
            resource_id=document_id,
            resource_type="document",
            event_details=f"Deleted document record '{doc.name}'"
        )
        return True

    def _seed_demo_documents(self):
        demo_docs = [
            Document(
                id="doc_demo_degree_01",
                name="Stanford_University_BS_Computer_Science.pdf",
                category=DocumentCategory.DEGREE,
                file_type="application/pdf",
                file_size_bytes=2458000,
                file_path="uploads/demo_degree_01.pdf",
                file_url="/api/v1/documents/demo/stanford-degree.pdf",
                issuer_name="Stanford University",
                certificate_number="STAN-CS-2024-8841",
                issue_date="2024-06-16",
                uploaded_by="usr_indiv_01",
                uploader_name="Alex Mercer",
                status=VerificationStatus.VERIFIED,
                verification_result_id="res_demo_01",
                is_demo=True,
                created_at=datetime.utcnow() - timedelta(days=7)
            ),
            Document(
                id="doc_demo_marksheet_02",
                name="Official_Academic_Transcript_Sem8.pdf",
                category=DocumentCategory.MARKSHEET,
                file_type="application/pdf",
                file_size_bytes=1840000,
                file_path="uploads/demo_marksheet_02.pdf",
                file_url="/api/v1/documents/demo/transcript-sem8.pdf",
                issuer_name="Massachusetts Institute of Technology",
                certificate_number="MIT-TR-2025-0194",
                issue_date="2025-05-30",
                uploaded_by="usr_indiv_01",
                uploader_name="Alex Mercer",
                status=VerificationStatus.VERIFIED,
                verification_result_id="res_demo_02",
                is_demo=True,
                created_at=datetime.utcnow() - timedelta(days=4)
            ),
            Document(
                id="doc_demo_internship_03",
                name="Google_DeepMind_Research_Internship_Certificate.png",
                category=DocumentCategory.INTERNSHIP,
                file_type="image/png",
                file_size_bytes=985000,
                file_path="uploads/demo_internship_03.png",
                file_url="/api/v1/documents/demo/internship-cert.png",
                issuer_name="Google DeepMind",
                certificate_number="DM-INT-2025-77",
                issue_date="2025-09-01",
                uploaded_by="usr_indiv_01",
                uploader_name="Alex Mercer",
                status=VerificationStatus.ANALYZED,
                verification_result_id="res_demo_03",
                is_demo=True,
                created_at=datetime.utcnow() - timedelta(days=2)
            ),
            Document(
                id="doc_demo_suspicious_04",
                name="Dubious_FastTrack_Diploma_Certificate.pdf",
                category=DocumentCategory.SKILL,
                file_type="application/pdf",
                file_size_bytes=620000,
                file_path="uploads/demo_suspicious_04.pdf",
                file_url="/api/v1/documents/demo/suspicious-cert.pdf",
                issuer_name="Global Tech Skills Academy",
                certificate_number="FAKE-CERT-991",
                issue_date="2026-01-15",
                uploaded_by="usr_verif_01",
                uploader_name="Marcus Chen",
                status=VerificationStatus.REVIEW_REQUIRED,
                verification_result_id="res_demo_04",
                is_demo=True,
                created_at=datetime.utcnow() - timedelta(hours=14)
            ),
            Document(
                id="doc_demo_experience_05",
                name="Amazon_AWS_Senior_Engineer_Experience_Letter.pdf",
                category=DocumentCategory.EXPERIENCE,
                file_type="application/pdf",
                file_size_bytes=1120000,
                file_path="uploads/demo_exp_05.pdf",
                file_url="/api/v1/documents/demo/aws-experience.pdf",
                issuer_name="Amazon Web Services Inc.",
                certificate_number="AWS-EXP-2025-994",
                issue_date="2025-12-15",
                uploaded_by="usr_indiv_01",
                uploader_name="Alex Mercer",
                status=VerificationStatus.VERIFIED,
                verification_result_id="res_demo_05",
                is_demo=True,
                created_at=datetime.utcnow() - timedelta(days=12)
            ),
        ]
        self._documents.extend(demo_docs)


document_service = DocumentService()
