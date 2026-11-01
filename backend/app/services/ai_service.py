"""
TrustChain AI - Complete AI/ML Document Intelligence Orchestration Engine
Orchestrates preprocessing, OCR, structured extraction, image forensics,
metadata inspection, cross-field consistency, template layout matching,
ML anomaly detection, explainable risk scoring, and structured reporting.
"""

import os
from typing import Dict, Any, Optional

from app.services.ai.preprocessing_service import preprocessing_service
from app.services.ai.ocr_service import ocr_service
from app.services.ai.qr_detection_service import qr_detection_service
from app.services.ai.document_classification_service import document_classification_service
from app.services.ai.information_extraction_service import information_extraction_service
from app.services.ai.image_forensics_service import image_forensics_service
from app.services.ai.metadata_analysis_service import metadata_analysis_service
from app.services.ai.consistency_service import consistency_service
from app.services.ai.template_analysis_service import template_analysis_service
from app.services.ai.fraud_detection_service import fraud_detection_service
from app.services.ai.risk_scoring_service import risk_scoring_service
from app.services.ai.explainability_service import explainability_service
from app.services.ai.report_generation_service import (
    report_generation_service, StructuredVerificationReport
)


class AIDocumentIntelligenceEngine:
    """
    Main orchestrator for TrustChain AI Document Intelligence.
    Executes end-to-end pipeline and generates audit-ready verification reports.
    """

    def __init__(self):
        # In-memory storage for analysis results, reports, and user feedback
        self._analysis_cache: Dict[str, Dict[str, Any]] = {}
        self._reports: Dict[str, StructuredVerificationReport] = {}
        self._feedback_store: Dict[str, list] = {}

    @property
    def is_configured(self) -> bool:
        return True

    def analyze_document(
        self,
        document_id: str,
        file_path_or_bytes: Any,
        file_name: str = "document",
        declared_metadata: Optional[Dict[str, Any]] = None,
        issuer_verified: bool = False,
        blockchain_verified: bool = False
    ) -> Dict[str, Any]:
        """
        Executes complete 12-stage AI/ML Document Intelligence Pipeline:
        1. Ingestion & Validation
        2. Preprocessing & Quality Assessment
        3. OCR Multi-Page Text Extraction
        4. QR Code & Barcode Payload Detection
        5. Document Type Classification
        6. Structured Field Extraction
        7. Image Forensics & Error Level Analysis (ELA)
        8. Document Metadata & EXIF Analysis
        9. Cross-Field Mathematical & Chronological Consistency
        10. Spatial Template & Layout Comparison
        11. ML Fraud Pattern & Statistical Outlier Scoring
        12. Explainable Evidence Aggregation & Risk Scoring
        """
        declared = declared_metadata or {}

        # Stage 1 & 2: Preprocessing & Quality Assessment
        prep_result = preprocessing_service.process_document(file_path_or_bytes, file_name)
        if not prep_result.get("success"):
            return {
                "document_id": document_id,
                "status": "failed",
                "error": prep_result.get("error", "Document preprocessing failed.")
            }

        pages = prep_result.get("pages", [])
        quality_summary = prep_result.get("quality_summary", {})

        # Stage 3: OCR Multi-page Text Extraction
        ocr_result = ocr_service.extract_text(pages, document_id)
        full_text = "\n".join([p.get("extracted_text", "") for p in ocr_result.get("pages", [])])

        # Stage 4: QR Code & Barcode Detection
        first_page_img = pages[0].get("raw_image") if pages else None
        qr_result = qr_detection_service.detect_qr(first_page_img)

        # Stage 5: Document Type Classification
        classification_result = document_classification_service.classify(
            full_text, declared_category=declared.get("category")
        )
        predicted_category = classification_result.get("predicted_type", "Degree Certificate")
        category_conf = classification_result.get("confidence", 0.90)

        # Stage 6: Structured Information Extraction
        extracted_info = information_extraction_service.extract_information(
            ocr_result,
            document_category=predicted_category,
            declared_metadata=declared
        )

        # Stage 7: Image Forensics & Tampering Analysis
        forensics_result = image_forensics_service.analyze_image(first_page_img)

        # Stage 8: Metadata & EXIF Analysis
        metadata_result = metadata_analysis_service.analyze_metadata(file_path_or_bytes, file_name)

        # Stage 9: Cross-Field Consistency Validation
        consistency_result = consistency_service.validate_consistency(
            extracted_info.get("extracted_fields", {}),
            document_category=predicted_category,
            declared_metadata=declared
        )

        # Stage 10: Spatial Template & Layout Analysis
        first_page_blocks = ocr_result.get("pages", [])[0].get("text_blocks", []) if ocr_result.get("pages") else []
        issuer_name = declared.get("issuer_name") or extracted_info.get("extracted_fields", {}).get("issuing_organization", {}).get("value")
        template_result = template_analysis_service.analyze_layout(
            ocr_blocks=first_page_blocks,
            institution_name=issuer_name,
            category=predicted_category
        )

        # Stage 11: ML Fraud Pattern & Anomaly Scoring
        ml_features_payload = {
            "text": full_text,
            "ocr_confidence": ocr_result.get("overall_confidence", 0.92),
            "laplacian_variance": quality_summary.get("laplacian_variance", 260.0),
            "contrast_std": quality_summary.get("contrast_std", 60.0),
            "noise_residual": quality_summary.get("noise_metric", 5.0),
            "ela_mean_residual": forensics_result.get("error_level_analysis", {}).get("mean_residual", 8.0),
            "ela_max_residual": forensics_result.get("error_level_analysis", {}).get("max_residual", 30.0),
            "issue_year": self._safe_int(extracted_info.get("extracted_fields", {}).get("issue_date", {}).get("value")),
            "grad_year": self._safe_int(extracted_info.get("extracted_fields", {}).get("graduation_year", {}).get("value")),
            "obtained_marks": self._safe_float(extracted_info.get("extracted_fields", {}).get("obtained_marks", {}).get("value")),
            "maximum_marks": self._safe_float(extracted_info.get("extracted_fields", {}).get("maximum_marks", {}).get("value")),
            "percentage": self._safe_float(extracted_info.get("extracted_fields", {}).get("percentage", {}).get("value")),
            "certificate_id": str(extracted_info.get("extracted_fields", {}).get("certificate_number", {}).get("value") or ""),
            "suspicious_metadata": metadata_result.get("suspicious_software_detected", False)
        }
        ml_result = fraud_detection_service.analyze(ml_features_payload)

        # Stage 12: Explainable Risk Scoring Engine
        risk_result = risk_scoring_service.calculate_risk_score(
            quality_assessment=quality_summary,
            ml_analysis=ml_result,
            image_forensics=forensics_result,
            metadata_analysis=metadata_result,
            consistency_checks=consistency_result,
            template_analysis=template_result,
            issuer_verified=issuer_verified,
            blockchain_verified=blockchain_verified
        )

        # Explainability & Visual Evidence Dossier
        xai_dossier = explainability_service.generate_explanation_dossier(
            document_id=document_id,
            ocr_result=ocr_result,
            classification=classification_result,
            ml_analysis=ml_result,
            forensics=forensics_result,
            metadata_analysis=metadata_result,
            consistency=consistency_result,
            risk_assessment=risk_result
        )

        # Generate Formal Structured Verification Report
        report = report_generation_service.generate_report(
            document_id=document_id,
            document_category=predicted_category,
            category_confidence=category_conf,
            extracted_info=extracted_info,
            quality=quality_summary,
            ml_analysis=ml_result,
            forensics=forensics_result,
            metadata_analysis=metadata_result,
            consistency=consistency_result,
            template_analysis=template_result,
            risk_assessment=risk_result,
            findings=xai_dossier.get("findings", []),
            issuer_status="verified" if issuer_verified else "pending",
            blockchain_status="verified" if blockchain_verified else "not_integrated"
        )

        # Cache results in memory
        self._reports[report.report_id] = report
        full_payload = {
            "document_id": document_id,
            "report_id": report.report_id,
            "status": "completed",
            "document_type": classification_result,
            "quality_assessment": quality_summary,
            "ocr_result": ocr_result,
            "qr_result": qr_result,
            "extracted_information": extracted_info,
            "image_forensics": forensics_result,
            "metadata_analysis": metadata_result,
            "consistency_checks": consistency_result,
            "template_analysis": template_result,
            "ml_analysis": ml_result,
            "risk_assessment": risk_result,
            "findings": xai_dossier.get("findings", []),
            "visual_overlays": xai_dossier.get("visual_overlays", {}),
            "report": report.model_dump(),
            "disclaimer": risk_result.get("disclaimer")
        }

        self._analysis_cache[document_id] = full_payload
        return full_payload

    def get_analysis_result(self, document_id: str) -> Optional[Dict[str, Any]]:
        return self._analysis_cache.get(document_id)

    def get_report(self, report_id: str) -> Optional[StructuredVerificationReport]:
        return self._reports.get(report_id)

    def add_user_feedback(self, report_id: str, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Records user feedback and OCR corrections without corrupting original raw analysis."""
        if report_id not in self._feedback_store:
            self._feedback_store[report_id] = []
        self._feedback_store[report_id].append(feedback_data)
        return {
            "success": True,
            "report_id": report_id,
            "feedback_count": len(self._feedback_store[report_id]),
            "message": "User feedback recorded for future model fine-tuning."
        }

    def _safe_int(self, val: Any) -> Optional[int]:
        if val is None:
            return None
        import re
        m = re.search(r"\b(19\d\d|20\d\d)\b", str(val))
        return int(m.group(1)) if m else None

    def _safe_float(self, val: Any) -> Optional[float]:
        try:
            return float(val) if val is not None else None
        except Exception:
            return None


# Global singleton engine
ai_service = AIDocumentIntelligenceEngine()
