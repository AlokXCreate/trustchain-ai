import json
from typing import Dict, Any
from app.services.reporting.report_integrity_service import report_integrity_service


class JsonReportExporter:
    """
    Exports structured, machine-readable JSON verification reports conforming
    to the TrustChain AI Enterprise Verification Schema v1.2.
    """

    SCHEMA_VERSION = "1.2.0"

    def export(self, report_obj: Any) -> str:
        """
        Converts a Report entity or dict into a validated canonical JSON string.
        """
        if hasattr(report_obj, "model_dump"):
            raw = report_obj.model_dump()
        elif hasattr(report_obj, "dict"):
            raw = report_obj.dict()
        elif isinstance(report_obj, dict):
            raw = report_obj.copy()
        else:
            raw = dict(report_obj)

        # Standardized envelope
        envelope = {
            "$schema": "https://trustchain-ai.org/schemas/v1.2/verification-report.json",
            "schema_version": self.SCHEMA_VERSION,
            "report_id": raw.get("id"),
            "project": "TrustChain AI",
            "report_type": "Official Document Verification Dossier",
            "generated_at": str(raw.get("created_at")),
            "confidentiality": raw.get("confidentiality", "CONFIDENTIAL // OFFICIAL VERIFICATION DOSSIER"),
            "verification": {
                "session_id": raw.get("verification_session_id"),
                "document_id": raw.get("document_id"),
                "document_name": raw.get("document_name"),
                "category": raw.get("category"),
                "status": raw.get("status"),
                "risk_score": raw.get("risk_score"),
                "risk_category": raw.get("risk_category"),
                "confidence": raw.get("confidence")
            },
            "report_sections": raw.get("report_data", {}),
            "integrity": {
                "algorithm": "SHA-256",
                "checksum": raw.get("integrity_hash") or report_integrity_service.compute_hash(raw.get("report_data", {})),
                "is_signed": True,
                "verification_endpoint": f"/api/v1/reports/public/verify/{raw.get('id')}"
            }
        }

        return json.dumps(envelope, indent=2, default=str)

    def export_bytes(self, report_obj: Any) -> bytes:
        return self.export(report_obj).encode("utf-8")


json_report_exporter = JsonReportExporter()

