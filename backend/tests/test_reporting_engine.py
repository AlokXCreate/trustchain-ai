import sys
import os
import json
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.reporting.report_service import report_service
from app.services.reporting.email_service import email_service
from app.services.reporting.report_integrity_service import report_integrity_service
from app.services.reporting.pdf_generator import pdf_report_generator
from app.services.reporting.word_generator import word_report_generator
from app.services.reporting.json_exporter import json_report_exporter
from app.services.reporting.html_report_generator import html_report_generator
from app.models.entities import Document, VerificationResult, VerificationStep
from app.models.enums import DocumentCategory, VerificationStatus


def test_seeded_reports_exist():
    reports, total = report_service.list_reports()
    assert total >= 3
    assert len(reports) >= 3
    assert any(r.id == "TC-REP-2026-00101" for r in reports)


def test_pdf_generation_bytes():
    rep = report_service.get_report("TC-REP-2026-00101")
    assert rep is not None
    pdf_bytes = pdf_report_generator.generate(rep)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 2000
    assert pdf_bytes.startswith(b"%PDF")


def test_docx_generation_bytes():
    rep = report_service.get_report("TC-REP-2026-00101")
    assert rep is not None
    docx_bytes = word_report_generator.generate(rep)
    assert isinstance(docx_bytes, bytes)
    assert len(docx_bytes) > 5000
    # ZIP signature for docx
    assert docx_bytes.startswith(b"PK")


def test_json_export_schema():
    rep = report_service.get_report("TC-REP-2026-00101")
    assert rep is not None
    json_str = json_report_exporter.export(rep)
    data = json.loads(json_str)
    assert data["schema_version"] == "1.2.0"
    assert data["report_id"] == "TC-REP-2026-00101"
    assert "verification" in data
    assert "integrity" in data
    assert data["integrity"]["algorithm"] == "SHA-256"


def test_html_report_generation():
    rep = report_service.get_report("TC-REP-2026-00101")
    assert rep is not None
    html_str = html_report_generator.generate(rep)
    assert "<!DOCTYPE html>" in html_str
    assert "TRUSTCHAIN AI" in html_str
    assert rep.id in html_str
    assert "Error Level Analysis" in html_str


def test_report_integrity_verification():
    rep = report_service.get_report("TC-REP-2026-00101")
    assert rep is not None
    is_valid, current_hash = report_integrity_service.verify_integrity(rep.report_data, rep.integrity_hash)
    assert is_valid is True
    assert len(current_hash) == 64

    # Simulate tampering with report data
    tampered_data = rep.report_data.copy()
    tampered_data["fraud_risk_assessment"] = {"final_risk_score": 99}
    is_valid_tampered, _ = report_integrity_service.verify_integrity(tampered_data, rep.integrity_hash)
    assert is_valid_tampered is False


def test_report_comparison():
    diff = report_service.compare_reports("TC-REP-2026-00101", "TC-REP-2026-00103")
    assert "error" not in diff
    assert "metrics" in diff
    assert diff["metrics"]["risk_score_delta"] == 74
    assert diff["metrics"]["status_changed"] is True
    assert len(diff["field_comparisons"]) > 0


def test_email_validation_and_sandbox_safety():
    # Test invalid email rejection
    success, msg, log_entry = email_service.send_report_email(
        report_id="TC-REP-2026-00101",
        recipient_email="not-an-email"
    )
    assert success is False
    assert "Invalid recipient" in msg

    # Test valid email with unconfigured SMTP reports diagnostic guidance honestly
    success, msg, log_entry = email_service.send_report_email(
        report_id="TC-REP-2026-00101",
        recipient_email="verifier@university.edu"
    )
    # When SMTP is not configured, it returns honest status
    if not email_service.is_smtp_configured():
        assert success is False
        assert "SMTP server is not configured" in msg
        assert log_entry.status.value == "failed"


def test_auto_report_generation_from_verification():
    doc = Document(
        id="doc_test_report_auto",
        name="Degree_Certificate_Test.pdf",
        category=DocumentCategory.DEGREE,
        file_type="PDF",
        file_size_bytes=1024 * 1024,
        file_path="uploads/test.pdf",
        uploaded_by="usr_test"
    )
    result = VerificationResult(
        id="res_test_auto",
        document_id=doc.id,
        status=VerificationStatus.VERIFIED,
        risk_score=0.10,
        confidence=0.96,
        extracted_data={"candidate_name": "Test Student", "degree": "B.Tech AI & DS"},
        anomaly_findings=[],
        blockchain_status="Anchored on Polygon Testnet",
        steps=[]
    )

    new_report = report_service.create_report_for_verification(
        doc=doc,
        result=result,
        user_id="usr_test",
        user_name="Test Operator",
        custom_report_id="TC-REP-2026-AUTOTEST"
    )

    assert new_report.id == "TC-REP-2026-AUTOTEST"
    assert new_report.risk_score == 10
    assert new_report.risk_category == "Low Risk"
    assert new_report.document_name == doc.name

    # Check that it exists in report service listing
    fetched = report_service.get_report("TC-REP-2026-AUTOTEST")
    assert fetched is not None
    assert fetched.integrity_hash == new_report.integrity_hash


if __name__ == "__main__":
    print("Running Reporting Engine Unit Tests...")
    test_seeded_reports_exist()
    test_pdf_generation_bytes()
    test_docx_generation_bytes()
    test_json_export_schema()
    test_html_report_generation()
    test_report_integrity_verification()
    test_report_comparison()
    test_email_validation_and_sandbox_safety()
    test_auto_report_generation_from_verification()
    print("ALL REPORTING TESTS PASSED PERFECTLY!")

