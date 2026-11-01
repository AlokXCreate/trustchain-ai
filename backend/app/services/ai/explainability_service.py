"""
TrustChain AI - Explainable AI (XAI) & Visual Evidence Service
Synthesizes explainable narratives, maps bounding coordinates for OCR & tamper overlays,
and details specific feature contributions.
"""

from typing import Dict, Any, List


class ExplainabilityService:
    """
    Translates raw algorithmic metrics into human-interpretable verification findings,
    bounding box visualizations, and evidence cards.
    """

    def generate_explanation_dossier(
        self,
        document_id: str,
        ocr_result: Dict[str, Any],
        classification: Dict[str, Any],
        ml_analysis: Dict[str, Any],
        forensics: Dict[str, Any],
        metadata_analysis: Dict[str, Any],
        consistency: Dict[str, Any],
        risk_assessment: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Creates a unified explainability dossier for the frontend Verification Workspace.
        """
        findings = []

        # 1. Consistency Findings
        for c_find in consistency.get("findings", []):
            findings.append({
                "id": f"find_{c_find['rule_id']}",
                "category": "Cross-Field Consistency",
                "severity": c_find["severity"],
                "title": c_find["expected_condition"],
                "description": c_find["explanation"],
                "observed_value": str(c_find["observed_value"]),
                "evidence_source": c_find["evidence_source"],
                "recommended_action": c_find["recommended_action"],
                "bounding_box": None,
                "confidence": 0.95
            })

        # 2. Forensics Findings
        for s_reg in forensics.get("suspicious_regions", []):
            findings.append({
                "id": f"find_forensics_{len(findings) + 1}",
                "category": "Visual Forensics",
                "severity": s_reg.get("severity", "medium"),
                "title": "Compression Artifact Anomaly",
                "description": s_reg.get("description", "Potential local splice or digital modification detected."),
                "observed_value": "Error Level Analysis residual deviation",
                "evidence_source": "Error Level Analysis (ELA) filter",
                "recommended_action": "Zoom into highlighted box in Verification Workspace to visually inspect pixels.",
                "bounding_box": s_reg.get("bounding_box"),
                "confidence": 0.82
            })

        # 3. Metadata Findings
        for m_find in metadata_analysis.get("findings", []):
            if "editing software" in m_find.lower() or "inconsistency" in m_find.lower():
                findings.append({
                    "id": f"find_meta_{len(findings) + 1}",
                    "category": "Metadata Inspection",
                    "severity": "medium",
                    "title": "Software or Timestamp Discrepancy",
                    "description": m_find,
                    "observed_value": str(metadata_analysis.get("suspicious_software_list", [])),
                    "evidence_source": "File EXIF / PDF Dictionary",
                    "recommended_action": "Check whether applicant created document through third-party design tool.",
                    "bounding_box": None,
                    "confidence": 0.90
                })

        # 4. ML Feature Contributions
        for contrib in ml_analysis.get("top_contributing_features", []):
            findings.append({
                "id": f"find_ml_{contrib['feature_name']}",
                "category": "Machine Learning Anomaly",
                "severity": "medium",
                "title": f"Feature Deviation: {contrib['feature_name']}",
                "description": contrib["explanation"],
                "observed_value": str(contrib["observed_value"]),
                "evidence_source": f"Random Forest Model ({ml_analysis.get('model_version')})",
                "recommended_action": "Corroborate with secondary document or institutional registrar.",
                "bounding_box": None,
                "confidence": round(contrib.get("importance_weight", 0.1) * 2.5, 2)
            })

        # Sort findings by severity: critical -> high -> medium -> low
        severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        findings.sort(key=lambda f: severity_order.get(f["severity"].lower(), 4))

        # Prepare visual overlays
        ocr_boxes = []
        for p in ocr_result.get("pages", []):
            for block in p.get("text_blocks", []):
                if block.get("bounding_box"):
                    ocr_boxes.append({
                        "id": block.get("id"),
                        "page": p.get("page_number", 1),
                        "text": block.get("text"),
                        "confidence": block.get("confidence"),
                        "bounding_box": block.get("bounding_box")
                    })

        tamper_boxes = []
        for s_reg in forensics.get("suspicious_regions", []):
            if s_reg.get("bounding_box"):
                tamper_boxes.append({
                    "type": s_reg.get("type"),
                    "severity": s_reg.get("severity"),
                    "bounding_box": s_reg.get("bounding_box"),
                    "description": s_reg.get("description")
                })

        # Seal and signature overlays
        for seal in forensics.get("seal_detection", {}).get("regions", []):
            if seal.get("bounding_box"):
                tamper_boxes.append({
                    "type": "seal",
                    "severity": "positive",
                    "bounding_box": seal.get("bounding_box"),
                    "description": "Institutional Seal / Stamp detected"
                })

        for sig in forensics.get("signature_detection", {}).get("regions", []):
            if sig.get("bounding_box"):
                tamper_boxes.append({
                    "type": "signature",
                    "severity": "positive",
                    "bounding_box": sig.get("bounding_box"),
                    "description": "Authorized Signature Stroke detected"
                })

        return {
            "document_id": document_id,
            "overall_summary": risk_assessment.get("explanation"),
            "risk_score": risk_assessment.get("risk_score"),
            "risk_category": risk_assessment.get("category_label"),
            "findings_count": len(findings),
            "findings": findings,
            "visual_overlays": {
                "ocr_boxes": ocr_boxes,
                "tamper_boxes": tamper_boxes,
                "ela_preview_base64": forensics.get("error_level_analysis", {}).get("ela_preview_base64", "")
            },
            "component_contributions": risk_assessment.get("component_breakdown", {}),
            "disclaimer": risk_assessment.get("disclaimer")
        }


# Global singleton
explainability_service = ExplainabilityService()
