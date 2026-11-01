"""
TrustChain AI - Structured Verification Report Generation Service
Validates verification dossiers against strict Pydantic schemas, produces
machine-readable JSON reports, and compiles audit-ready PDF dossiers.
"""

import io
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


class DocumentTypeInfo(BaseModel):
    predicted: str
    confidence: float


class RiskAssessmentReport(BaseModel):
    score: Optional[int] = None
    category: str
    verdict: str
    explanation: str


class StructuredVerificationReport(BaseModel):
    report_id: str
    document_id: str
    created_at: str
    document_type: DocumentTypeInfo
    extracted_information: Dict[str, Any] = Field(default_factory=dict)
    quality_assessment: Dict[str, Any] = Field(default_factory=dict)
    ml_analysis: Dict[str, Any] = Field(default_factory=dict)
    anomaly_findings: List[Dict[str, Any]] = Field(default_factory=list)
    consistency_checks: Dict[str, Any] = Field(default_factory=dict)
    metadata_analysis: Dict[str, Any] = Field(default_factory=dict)
    image_forensics: Dict[str, Any] = Field(default_factory=dict)
    template_analysis: Dict[str, Any] = Field(default_factory=dict)
    issuer_verification: Dict[str, Any] = Field(default_factory=lambda: {"status": "pending"})
    blockchain_verification: Dict[str, Any] = Field(default_factory=lambda: {"status": "not_integrated"})
    risk_assessment: RiskAssessmentReport
    recommended_actions: List[str] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    disclaimer: str


class ReportGenerationService:
    """
    Generates validated structured reports and audit-ready PDF certificates of analysis.
    """

    def generate_report(
        self,
        document_id: str,
        document_category: str,
        category_confidence: float,
        extracted_info: Dict[str, Any],
        quality: Dict[str, Any],
        ml_analysis: Dict[str, Any],
        forensics: Dict[str, Any],
        metadata_analysis: Dict[str, Any],
        consistency: Dict[str, Any],
        template_analysis: Dict[str, Any],
        risk_assessment: Dict[str, Any],
        findings: List[Dict[str, Any]],
        issuer_status: str = "pending",
        blockchain_status: str = "not_integrated"
    ) -> StructuredVerificationReport:
        """
        Creates and validates full structured report schema.
        """
        report_id = f"rep_{uuid.uuid4().hex[:12]}"
        now_iso = datetime.utcnow().isoformat() + "Z"

        recommended_actions = []
        if risk_assessment.get("action_recommendation"):
            recommended_actions.append(risk_assessment["action_recommendation"])
        for f in findings[:3]:
            if f.get("recommended_action") and f["recommended_action"] not in recommended_actions:
                recommended_actions.append(f["recommended_action"])

        limitations = [
            "Analysis findings are generated via statistical heuristics and computer vision models.",
            "Visual ELA compression variation highlights potential editing but is not proof of fraud.",
            "Official credential validation must be finalized by authorized issuing registries."
        ]

        report = StructuredVerificationReport(
            report_id=report_id,
            document_id=document_id,
            created_at=now_iso,
            document_type=DocumentTypeInfo(
                predicted=document_category,
                confidence=round(category_confidence, 2)
            ),
            extracted_information=extracted_info.get("extracted_fields", {}),
            quality_assessment=quality,
            ml_analysis=ml_analysis,
            anomaly_findings=findings,
            consistency_checks=consistency,
            metadata_analysis=metadata_analysis,
            image_forensics=forensics,
            template_analysis=template_analysis,
            issuer_verification={"status": issuer_status},
            blockchain_verification={"status": blockchain_status},
            risk_assessment=RiskAssessmentReport(
                score=risk_assessment.get("risk_score"),
                category=risk_assessment.get("category_label", "Moderate Risk Indicators"),
                verdict=risk_assessment.get("verdict_phrase", "Additional verification recommended."),
                explanation=risk_assessment.get("explanation", "")
            ),
            recommended_actions=recommended_actions,
            limitations=limitations,
            disclaimer=risk_assessment.get(
                "disclaimer",
                "TrustChain AI provides automated document analysis and preliminary risk assessment."
            )
        )

        return report

    def export_pdf_dossier(self, report: StructuredVerificationReport, document_name: str = "Document") -> bytes:
        """
        Builds a multi-page audit-grade PDF verification certificate using ReportLab.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Title"],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor("#0f172a"),
            alignment=0
        )
        subtitle_style = ParagraphStyle(
            "DocSub",
            parent=styles["Normal"],
            fontSize=10,
            textColor=colors.HexColor("#475569")
        )
        heading_style = ParagraphStyle(
            "DocHeading",
            parent=styles["Heading2"],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#1e293b"),
            spaceBefore=14,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            "DocBody",
            parent=styles["Normal"],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#334155")
        )

        elements = []

        # Header Title
        elements.append(Paragraph("TRUSTCHAIN AI — DOCUMENT VERIFICATION DOSSIER", title_style))
        elements.append(Paragraph(f"Report ID: {report.report_id} | Generated: {report.created_at}", subtitle_style))
        elements.append(Spacer(1, 15))

        # Executive Summary Box
        summary_data = [
            ["Document Target", document_name],
            ["Document Classification", f"{report.document_type.predicted} ({int(report.document_type.confidence * 100)}% conf)"],
            ["Risk Assessment Score", f"{report.risk_assessment.score}/100 — {report.risk_assessment.category}"],
            ["Preliminary Verdict", report.risk_assessment.verdict],
            ["Issuer Status", report.issuer_verification.get("status", "pending").upper()],
            ["Blockchain Status", report.blockchain_verification.get("status", "pending").upper()]
        ]
        summary_table = Table(summary_data, colWidths=[160, 360])
        summary_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#475569")),
            ("TEXTCOLOR", (1, 0), (1, -1), colors.HexColor("#0f172a")),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0"))
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 15))

        # Extracted Information
        elements.append(Paragraph("Structured Information Extracted", heading_style))
        field_rows = [["Field", "Extracted Value", "Confidence"]]
        for k, v in list(report.extracted_information.items())[:6]:
            val = v.get("value") if isinstance(v, dict) else v
            conf = v.get("confidence", 0.9) if isinstance(v, dict) else 0.9
            field_rows.append([
                k.replace("_", " ").title(),
                str(val) if val is not None else "[Unavailable]",
                f"{int(float(conf) * 100)}%" if val is not None else "N/A"
            ])
        field_table = Table(field_rows, colWidths=[140, 300, 80])
        field_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4)
        ]))
        elements.append(field_table)
        elements.append(Spacer(1, 15))

        # Findings Panel
        elements.append(Paragraph(f"Audited Verification Findings ({len(report.anomaly_findings)})", heading_style))
        if report.anomaly_findings:
            finding_rows = [["Severity", "Finding Title", "Source"]]
            for f in report.anomaly_findings[:5]:
                finding_rows.append([
                    f.get("severity", "medium").upper(),
                    f.get("title", "Finding"),
                    f.get("evidence_source", "AI Engine")
                ])
            find_table = Table(finding_rows, colWidths=[80, 320, 120])
            find_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4)
            ]))
            elements.append(find_table)
        else:
            elements.append(Paragraph("No significant visual, statistical, or mathematical discrepancies detected.", body_style))
        elements.append(Spacer(1, 15))

        # Mandatory Disclaimer
        elements.append(Paragraph("Institutional Verification Disclaimer", heading_style))
        elements.append(Paragraph(report.disclaimer, body_style))

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()


# Global singleton
report_generation_service = ReportGenerationService()
