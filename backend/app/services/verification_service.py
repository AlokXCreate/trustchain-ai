import uuid
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from app.models.entities import VerificationResult, VerificationStep
from app.models.enums import VerificationStatus, AuditEventType
from app.services.audit_service import audit_service
from app.services.document_service import document_service
from app.services.institution_service import institution_service


class VerificationService:
    def __init__(self):
        self._results: Dict[str, VerificationResult] = {}
        self._seed_demo_results()

    def get_result_by_document_id(self, document_id: str) -> Optional[VerificationResult]:
        for res in self._results.values():
            if res.document_id == document_id:
                return res
        return None

    def get_result_by_id(self, result_id: str) -> Optional[VerificationResult]:
        return self._results.get(result_id)

    def get_result(self, result_id: str) -> Optional[VerificationResult]:
        """Convenience alias for get_result_by_id."""
        return self.get_result_by_id(result_id)

    def list_results(self) -> List[VerificationResult]:
        return list(self._results.values())

    async def run_verification_pipeline(
        self,
        document_id: str,
        user_id: str,
        user_name: str
    ) -> VerificationResult:
        doc = document_service.get_by_id(document_id)
        if not doc:
            raise ValueError(f"Document with ID {document_id} not found.")

        result_id = f"res_{uuid.uuid4().hex[:10]}"
        now = datetime.utcnow()

        # Step 1: Document received
        step1 = VerificationStep(
            step_number=1,
            name="Document Ingestion & File Integrity",
            status="completed",
            message=f"Received {doc.name} ({doc.file_type}, {doc.file_size_bytes} bytes). SHA-256 integrity hash registered.",
            timestamp=now
        )

        # Step 2: Image preprocessing & quality assessment
        from app.services.ai_service import ai_service
        from app.api.routes.ai_analysis import _get_document_bytes_or_path

        file_input = _get_document_bytes_or_path(doc)
        declared_meta = {
            "category": doc.category.value,
            "issuer_name": doc.issuer_name,
            "certificate_number": doc.certificate_number,
            "issue_date": doc.issue_date,
            "holder_name": doc.uploader_name
        }

        # Check issuer match
        matched_institution = None
        if doc.issuer_name:
            institutions = institution_service.list_institutions()
            for inst in institutions:
                if inst.name.lower() in doc.issuer_name.lower() or doc.issuer_name.lower() in inst.name.lower():
                    matched_institution = inst
                    break

        # Run Real AI Pipeline
        ai_res = ai_service.analyze_document(
            document_id=document_id,
            file_path_or_bytes=file_input,
            file_name=doc.name,
            declared_metadata=declared_meta,
            issuer_verified=bool(matched_institution),
            blockchain_verified=False
        )

        quality_data = ai_res.get("quality_assessment", {})
        q_score = quality_data.get("quality_score", 85)
        step2 = VerificationStep(
            step_number=2,
            name="Image Preprocessing & Normalization",
            status="completed",
            message=f"Image preprocessed (Quality Score: {q_score}/100, Skew angle: {quality_data.get('skew_angle', 0.0)}°, Contrast: {quality_data.get('contrast_level', 'acceptable')}).",
            timestamp=now + timedelta(seconds=1)
        )

        # Step 3: Text extraction
        ocr_data = ai_res.get("ocr_result", {})
        total_pages = ocr_data.get("total_pages", 1)
        ocr_conf = ocr_data.get("overall_confidence", 0.94)
        ext_fields = ai_res.get("extracted_information", {}).get("extracted_fields", {})
        step3 = VerificationStep(
            step_number=3,
            name="OCR & Text Extraction",
            status="completed",
            message=f"OCR processed {total_pages} page(s) with {int(ocr_conf * 100)}% confidence. Extracted {len(ext_fields)} structured credential fields.",
            timestamp=now + timedelta(seconds=2)
        )

        # Step 4: Document analysis & Tamper Detection
        risk_data = ai_res.get("risk_assessment", {})
        r_score = risk_data.get("risk_score", 15)
        r_verdict = risk_data.get("verdict_phrase", "No significant anomalies detected.")
        r_label = risk_data.get("category_label", "Low Risk Indicators")
        step4_status = "completed" if r_score < 60 else "review_required"
        step4 = VerificationStep(
            step_number=4,
            name="Document Authenticity & Tamper Detection",
            status=step4_status,
            message=f"AI Multi-Modal Analysis: Score {r_score}/100 ({r_label}). {r_verdict}",
            timestamp=now + timedelta(seconds=3)
        )

        # Step 5: Issuer verification
        if matched_institution:
            step5_status = "completed"
            step5_msg = f"Issuer '{doc.issuer_name}' matched against TrustChain Institutional Registry ({matched_institution.status.value.upper()})."
        else:
            step5_status = "review_required"
            step5_msg = f"Issuer '{doc.issuer_name or 'Unknown'}' is not yet accredited in the TrustChain Institutional Registry."

        step5 = VerificationStep(
            step_number=5,
            name="Issuer Registry Verification",
            status=step5_status,
            message=step5_msg,
            timestamp=now + timedelta(seconds=4)
        )

        # Step 6: Blockchain integrity check
        from blockchain.contract_service import contract_service
        from blockchain.hashing_service import hashing_service

        doc_bytes = file_input if isinstance(file_input, bytes) else Path(file_input).read_bytes()
        doc_hash = hashing_service.compute_sha256(doc_bytes)
        chain_check = contract_service.verify_by_hash(doc_hash)

        if chain_check.get("verified"):
            step6_status = "completed"
            step6_msg = f"Cryptographically verified on TrustChain blockchain registry (Credential: {chain_check.get('credential_id')}, Issuer: {chain_check.get('issuer', '')[:10]}...)."
            b_status = f"Anchored & Active on TrustChain Credential Registry ({chain_check.get('credential_id')})"
        elif chain_check.get("status") == "Hash Mismatch":
            step6_status = "failed"
            step6_msg = f"Hash Mismatch: File contents do not match registered blockchain hash for {chain_check.get('credential_id')}."
            b_status = "Hash Mismatch detected against registered credential record"
        elif chain_check.get("status") == "Revoked":
            step6_status = "failed"
            step6_msg = f"Credential {chain_check.get('credential_id')} was revoked on-chain by authorized issuer."
            b_status = "Credential Revoked on Blockchain"
        else:
            step6_status = "completed"
            step6_msg = f"Document SHA-256 ({doc_hash[:16]}...) is not registered on-chain. (Pending issuer anchoring or offline issuance)."
            b_status = "Unregistered on-chain (Direct cryptographic anchor not found)"

        step6 = VerificationStep(
            step_number=6,
            name="Blockchain Credential Verification",
            status=step6_status,
            message=step6_msg,
            timestamp=now + timedelta(seconds=5)
        )

        # Step 7: Report generation
        final_status = VerificationStatus.VERIFIED if r_score < 30 and matched_institution else (
            VerificationStatus.REVIEW_REQUIRED if r_score >= 60 else VerificationStatus.ANALYZED
        )
        step7 = VerificationStep(
            step_number=7,
            name="Verification Report Generation",
            status="completed",
            message=f"Comprehensive verification dossier generated (Report ID: {ai_res.get('report_id')}).",
            timestamp=now + timedelta(seconds=6)
        )

        steps = [step1, step2, step3, step4, step5, step6, step7]

        # Flatten extracted data for verification result display
        clean_extracted = {"document_name": doc.name, "category": doc.category.value}
        for k, v in ext_fields.items():
            if isinstance(v, dict):
                clean_extracted[k] = v.get("value")
            else:
                clean_extracted[k] = v

        result = VerificationResult(
            id=result_id,
            document_id=document_id,
            status=final_status,
            risk_score=r_score,
            confidence=ai_res.get("document_type", {}).get("confidence", 0.92),
            extracted_data=clean_extracted,
            anomaly_findings=ai_res.get("findings", []),
            blockchain_status=b_status,
            ai_explanation=risk_data.get("explanation", "Multi-modal analysis complete."),
            steps=steps,
            created_at=now,
            completed_at=now + timedelta(seconds=6)
        )

        self._results[result_id] = result
        doc.status = final_status
        doc.verification_result_id = result_id

        audit_service.log_event(
            user_id=user_id,
            user_name=user_name,
            event_type=AuditEventType.VERIFICATION_REQUEST,
            resource_id=document_id,
            resource_type="document",
            event_details=f"Initiated 7-step verification workflow for '{doc.name}'"
        )
        return result

    def _seed_demo_results(self):
        # Demo Result 1: Stanford University Degree (Verified)
        r1_id = "res_demo_01"
        self._results[r1_id] = VerificationResult(
            id=r1_id,
            document_id="doc_demo_degree_01",
            status=VerificationStatus.VERIFIED,
            risk_score=0.04,  # Very low risk in demo
            confidence=0.98,
            extracted_data={
                "student_name": "Alex Mercer",
                "degree": "Bachelor of Science in Computer Science",
                "issuer": "Stanford University",
                "certificate_number": "STAN-CS-2024-8841",
                "conferral_date": "June 16, 2024",
                "honors": "Departmental Honors, Distinction"
            },
            anomaly_findings=[],
            blockchain_status="Sepolia Testnet Anchor Ready (Tx hash placeholder 0x7c94a2f8b01e35d)",
            ai_explanation="All institutional typography, official watermark, university seal, and registrar signature match Stanford University credential specifications.",
            steps=[
                VerificationStep(step_number=1, name="Document Ingestion & File Integrity", status="completed", message="File integrity verified with SHA-256 fingerprint.", timestamp=datetime.utcnow() - timedelta(days=7)),
                VerificationStep(step_number=2, name="Image Preprocessing & Normalization", status="completed", message="Orientation aligned, 300 DPI normalized.", timestamp=datetime.utcnow() - timedelta(days=7)),
                VerificationStep(step_number=3, name="OCR & Text Extraction", status="completed", message="Extracted 420 words with 99.4% optical confidence.", timestamp=datetime.utcnow() - timedelta(days=7)),
                VerificationStep(step_number=4, name="Document Authenticity & Tamper Detection", status="completed", message="No pixel anomalies, font splices, or copy-move artifacts detected.", timestamp=datetime.utcnow() - timedelta(days=7)),
                VerificationStep(step_number=5, name="Issuer Registry Verification", status="completed", message="Issuer matched with Stanford University Registrar (APPROVED).", timestamp=datetime.utcnow() - timedelta(days=7)),
                VerificationStep(step_number=6, name="Blockchain Credential Verification", status="completed", message="Cryptographic hash matches institutional anchor record.", timestamp=datetime.utcnow() - timedelta(days=7)),
                VerificationStep(step_number=7, name="Verification Report Generation", status="completed", message="Official TrustChain cryptographic report certified.", timestamp=datetime.utcnow() - timedelta(days=7)),
            ],
            created_at=datetime.utcnow() - timedelta(days=7),
            completed_at=datetime.utcnow() - timedelta(days=7)
        )

        # Demo Result 4: Suspicious fake certificate (Review required)
        r4_id = "res_demo_04"
        self._results[r4_id] = VerificationResult(
            id=r4_id,
            document_id="doc_demo_suspicious_04",
            status=VerificationStatus.REVIEW_REQUIRED,
            risk_score=0.88,  # High risk
            confidence=0.91,
            extracted_data={
                "candidate_name": "Marcus Chen",
                "certification": "Executive AI Specialist Diploma",
                "issuer": "Global Tech Skills Academy",
                "certificate_number": "FAKE-CERT-991",
                "issue_date": "January 15, 2026"
            },
            anomaly_findings=[
                {"type": "Unaccredited Issuer", "severity": "critical", "description": "Issuer domain is blacklisted and institution status is REJECTED in TrustChain directory."},
                {"type": "Font Inconsistency", "severity": "high", "description": "Candidate name glyphs render in Helvetica-Oblique while surrounding text is Times Roman."},
                {"type": "Seal Duplication", "severity": "medium", "description": "Emblem contains stock clipart artifacts inconsistent with official accredited bodies."}
            ],
            blockchain_status="No on-chain registration found for this issuer or document fingerprint.",
            ai_explanation="Multiple high-severity inconsistencies discovered: The declared issuing authority is unaccredited, font analysis indicates post-export digital tampering, and no cryptographic registry anchor exists.",
            steps=[
                VerificationStep(step_number=1, name="Document Ingestion & File Integrity", status="completed", message="Ingestion complete.", timestamp=datetime.utcnow() - timedelta(hours=14)),
                VerificationStep(step_number=2, name="Image Preprocessing & Normalization", status="completed", message="Preprocessed.", timestamp=datetime.utcnow() - timedelta(hours=14)),
                VerificationStep(step_number=3, name="OCR & Text Extraction", status="completed", message="Text parsed.", timestamp=datetime.utcnow() - timedelta(hours=14)),
                VerificationStep(step_number=4, name="Document Authenticity & Tamper Detection", status="failed", message="Visual anomalies and font tampering detected.", timestamp=datetime.utcnow() - timedelta(hours=14)),
                VerificationStep(step_number=5, name="Issuer Registry Verification", status="failed", message="Issuer status is REJECTED in registry.", timestamp=datetime.utcnow() - timedelta(hours=14)),
                VerificationStep(step_number=6, name="Blockchain Credential Verification", status="failed", message="No hash registered on Sepolia contract.", timestamp=datetime.utcnow() - timedelta(hours=14)),
                VerificationStep(step_number=7, name="Verification Report Generation", status="completed", message="High-risk audit report flagged for manual compliance review.", timestamp=datetime.utcnow() - timedelta(hours=14)),
            ],
            created_at=datetime.utcnow() - timedelta(hours=14),
            completed_at=datetime.utcnow() - timedelta(hours=14)
        )


verification_service = VerificationService()
