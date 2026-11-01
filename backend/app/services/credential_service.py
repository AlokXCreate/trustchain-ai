import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Tuple
from app.models.entities import Credential
from app.models.enums import CredentialStatus, DocumentCategory, AuditEventType
from app.schemas.schemas import CredentialCreateRequest
from app.services.audit_service import audit_service


class CredentialService:
    def __init__(self):
        self._credentials: List[Credential] = []
        self._seed_demo_credentials()

    def list_credentials(
        self,
        holder_email: Optional[str] = None,
        institution_id: Optional[str] = None,
        status: Optional[CredentialStatus] = None
    ) -> List[Credential]:
        results = self._credentials.copy()
        if holder_email:
            results = [c for c in results if c.holder_email == holder_email]
        if institution_id:
            results = [c for c in results if c.institution_id == institution_id]
        if status:
            results = [c for c in results if c.status == status]
        results.sort(key=lambda x: x.created_at, reverse=True)
        return results

    def get_by_credential_id(self, cred_id: str) -> Optional[Credential]:
        clean_id = cred_id.strip().upper()
        for c in self._credentials:
            if c.credential_id.upper() == clean_id or c.id == cred_id:
                return c
        return None

    def issue_credential(
        self,
        data: CredentialCreateRequest,
        issuer_institution_name: str,
        institution_id: str,
        issuer_user_id: str,
        issuer_user_name: str
    ) -> Credential:
        cred_num = f"TC-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"
        qr_payload = f"https://trustchain.ai/verify-credential?id={cred_num}"

        # Cryptographically register credential on blockchain
        from blockchain.contract_service import contract_service
        from blockchain.hashing_service import hashing_service

        doc_hash_seed = f"{cred_num}:{data.holder_name}:{issuer_institution_name}:{data.issue_date}:{uuid.uuid4().hex}"
        doc_hash = hashing_service.compute_sha256(doc_hash_seed.encode())

        reg_res = contract_service.register_credential(
            credential_id=cred_num,
            document_hash=doc_hash,
            credential_type=data.credential_type.value if hasattr(data.credential_type, "value") else str(data.credential_type)
        )
        tx_hash = reg_res.get("credential", {}).get("transaction_hash") if reg_res.get("success") else None

        credential = Credential(
            id=f"cred_{uuid.uuid4().hex[:8]}",
            credential_id=cred_num,
            holder_name=data.holder_name,
            holder_email=data.holder_email,
            issuing_institution=issuer_institution_name,
            institution_id=institution_id,
            credential_type=data.credential_type,
            program_or_course=data.program_or_course,
            issue_date=data.issue_date,
            expiration_date=data.expiration_date,
            status=CredentialStatus.ACTIVE,
            blockchain_tx_hash=tx_hash,
            qr_payload=qr_payload,
            grade_or_score=data.grade_or_score,
            skills=data.skills,
            metadata={**data.metadata, "document_hash": f"0x{doc_hash}"},
            created_at=datetime.utcnow()
        )
        self._credentials.append(credential)

        audit_service.log_event(
            user_id=issuer_user_id,
            user_name=issuer_user_name,
            event_type=AuditEventType.CREDENTIAL_ISSUANCE,
            resource_id=credential.credential_id,
            resource_type="credential",
            event_details=f"Issued verified digital credential {credential.credential_id} to {credential.holder_name}",
            metadata={"institution": issuer_institution_name, "type": credential.credential_type.value}
        )
        return credential

    def revoke_credential(
        self,
        credential_id: str,
        reason: str,
        user_id: str,
        user_name: str
    ) -> Optional[Credential]:
        cred = self.get_by_credential_id(credential_id)
        if not cred:
            return None

        cred.status = CredentialStatus.REVOKED

        from blockchain.contract_service import contract_service
        contract_service.revoke_credential(credential_id, reason=reason)

        audit_service.log_event(
            user_id=user_id,
            user_name=user_name,
            event_type=AuditEventType.CREDENTIAL_REVOCATION,
            resource_id=cred.credential_id,
            resource_type="credential",
            event_details=f"Revoked credential {cred.credential_id}. Reason: {reason}"
        )
        return cred

    def verify_credential(self, cred_id: str) -> Tuple[bool, Optional[Credential], str]:
        cred = self.get_by_credential_id(cred_id)
        if not cred:
            return False, None, "Credential ID not found in TrustChain registry."
        if cred.status == CredentialStatus.REVOKED:
            return False, cred, "This credential was revoked by the issuing institution."
        if cred.status == CredentialStatus.EXPIRED:
            return False, cred, "This credential has expired."
        return True, cred, "Credential verified as authentic in the TrustChain registry."

    def _seed_demo_credentials(self):
        demo_creds = [
            Credential(
                id="cred_ms_2026_01",
                credential_id="TC-2026-MIT941",
                holder_name="Alex Mercer",
                holder_email="individual@trustchain.ai",
                issuing_institution="Massachusetts Institute of Technology (MIT)",
                institution_id="inst_mit_01",
                credential_type=DocumentCategory.DEGREE,
                program_or_course="Master of Science in Electrical Engineering & CS",
                issue_date="2025-06-15",
                status=CredentialStatus.ACTIVE,
                blockchain_tx_hash="0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f",
                qr_payload="https://trustchain.ai/verify-credential?id=TC-2026-MIT941",
                grade_or_score="GPA 4.0 / Summa Cum Laude",
                skills=["Distributed Systems", "Cryptography", "Machine Learning", "Computer Architecture"],
                created_at=datetime.utcnow() - timedelta(days=60)
            ),
            Credential(
                id="cred_cert_stan_02",
                credential_id="TC-2026-STA302",
                holder_name="Alex Mercer",
                holder_email="individual@trustchain.ai",
                issuing_institution="Stanford University Registrar",
                institution_id="inst_stanford_02",
                credential_type=DocumentCategory.TRAINING,
                program_or_course="Advanced Deep Learning & Neural Network Verification",
                issue_date="2025-11-20",
                status=CredentialStatus.ACTIVE,
                blockchain_tx_hash="0x7b2f4c1e8a9d0f3a5c6e2b4d1a9f0e8c3b5a7d9e1f4a6b8c0e2d4f6a8b0c2e4a",
                qr_payload="https://trustchain.ai/verify-credential?id=TC-2026-STA302",
                grade_or_score="Distinction (98%)",
                skills=["Deep Learning", "PyTorch", "Model Interpretability"],
                created_at=datetime.utcnow() - timedelta(days=35)
            ),
            Credential(
                id="cred_revoked_03",
                credential_id="TC-2025-REV811",
                holder_name="James Foster",
                holder_email="james.foster@example.com",
                issuing_institution="Massachusetts Institute of Technology (MIT)",
                institution_id="inst_mit_01",
                credential_type=DocumentCategory.INTERNSHIP,
                program_or_course="Quantum Computing Research Internship",
                issue_date="2025-01-10",
                status=CredentialStatus.REVOKED,
                blockchain_tx_hash="0x3e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f4a9d72e81b6f0c3a5982e4f019c8d2",
                qr_payload="https://trustchain.ai/verify-credential?id=TC-2025-REV811",
                grade_or_score="Withdrawn",
                skills=["Quantum Logic"],
                created_at=datetime.utcnow() - timedelta(days=95)
            ),
        ]
        self._credentials.extend(demo_creds)


credential_service = CredentialService()
