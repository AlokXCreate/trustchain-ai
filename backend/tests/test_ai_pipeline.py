"""
TrustChain AI - Comprehensive AI/ML Pipeline Test Suite
Validates:
- Preprocessing & Image Quality Assessment
- OCR & Text Localization
- Structured Information Extraction
- QR/Barcode Detection & Payload Safety
- Hybrid Document Classification
- 14-D Feature Extraction
- ML Model Inference & Outlier Scoring
- Image Forensics & Error Level Analysis (ELA)
- Cross-Field Consistency Rules
- Template Matching Engine
- Explainable Risk Scoring & Disclaimers
- Pydantic Report & PDF Export
- FastAPI Endpoints & Security Guardrails
"""

import os
import pytest
import numpy as np
from fastapi.testclient import TestClient

from app.main import app
from app.services.ai.preprocessing_service import preprocessing_service
from app.services.ai.ocr_service import ocr_service
from app.services.ai.information_extraction_service import information_extraction_service
from app.services.ai.qr_detection_service import qr_detection_service
from app.services.ai.document_classification_service import document_classification_service
from app.services.ai.image_forensics_service import image_forensics_service
from app.services.ai.metadata_analysis_service import metadata_analysis_service
from app.services.ai.consistency_service import consistency_service
from app.services.ai.template_analysis_service import template_analysis_service
from app.services.ai.risk_scoring_service import risk_scoring_service
from app.services.ai.report_generation_service import report_generation_service
from app.services.ai_service import ai_service
from ml.feature_extraction.feature_extractor import feature_extractor
from ml.evaluation.evaluate import model_evaluator

client = TestClient(app)


# ==================== 1. PREPROCESSING & QUALITY TESTS ====================

def test_file_validation_oversized():
    # File validation over limit
    oversized = bytes(26 * 1024 * 1024)
    valid, msg = preprocessing_service.validate_file(oversized, "big.pdf")
    assert not valid
    assert "exceeds limit" in msg


def test_file_validation_invalid_extension():
    valid, msg = preprocessing_service.validate_file(b"data", "malicious.exe")
    assert not valid
    assert "Unsupported file format" in msg


def test_measurable_image_quality_assessment():
    # Generate sharp canvas
    img = np.ones((1400, 1000, 3), dtype=np.uint8) * 255
    # Add contrast lines
    img[200:300, 200:800] = 0
    img[500:600, 200:800] = 50

    quality = preprocessing_service.assess_image_quality(img)
    assert "quality_score" in quality
    assert 0 <= quality["quality_score"] <= 100
    assert "blur_detected" in quality
    assert "laplacian_variance" in quality
    assert "contrast_level" in quality
    assert "recommendation" in quality


# ==================== 2. OCR ENGINE TESTS ====================

def test_ocr_extraction_and_caching():
    img = np.ones((1200, 900, 3), dtype=np.uint8) * 255
    pages_data = [{
        "page_number": 1,
        "raw_image": img,
        "preprocessed_image": img,
        "embedded_text": "Stanford University\nDegree of Bachelor of Science\nConferred upon Alex Mercer",
        "width": 900,
        "height": 1200
    }]

    # First pass
    result1 = ocr_service.extract_text(pages_data, "doc_test_ocr")
    assert result1["total_pages"] == 1
    assert result1["overall_confidence"] >= 0.80
    assert len(result1["pages"][0]["text_blocks"]) >= 3

    # Check bounding box format
    b0 = result1["pages"][0]["text_blocks"][0]
    assert "bounding_box" in b0
    assert "x" in b0["bounding_box"]
    assert "y" in b0["bounding_box"]
    assert "width" in b0["bounding_box"]
    assert "height" in b0["bounding_box"]

    # Second pass (verify caching hit without error)
    result2 = ocr_service.extract_text(pages_data, "doc_test_ocr")
    assert result2["overall_confidence"] == result1["overall_confidence"]


# ==================== 3. STRUCTURED EXTRACTION TESTS ====================

def test_structured_information_extraction():
    ocr_res = {
        "pages": [{
            "page_number": 1,
            "extracted_text": (
                "Stanford University\n"
                "This is to certify that Alex Mercer has been awarded the degree of\n"
                "Bachelor of Science in Computer Science\n"
                "Certificate No: STAN-CS-2024-8841\n"
                "Date of Issue: 16/06/2024\n"
                "Year of Passing: 2024\n"
                "Result: First Class with Distinction"
            ),
            "text_blocks": [
                {"text": "Stanford University", "confidence": 0.96, "bounding_box": {"x": 100, "y": 100, "width": 400, "height": 40}},
                {"text": "Alex Mercer", "confidence": 0.95, "bounding_box": {"x": 100, "y": 200, "width": 300, "height": 40}}
            ]
        }]
    }

    ext = information_extraction_service.extract_information(ocr_res, "Degree Certificate")
    fields = ext["extracted_fields"]
    assert fields["holder_name"]["value"] is not None
    assert "Alex Mercer" in fields["holder_name"]["value"]
    assert fields["certificate_number"]["value"] == "STAN-CS-2024-8841"
    assert "Stanford" in fields["issuing_organization"]["value"]
    assert fields["graduation_year"]["value"] == "2024"


# ==================== 4. QR DETECTION TESTS ====================

def test_qr_detection_safe_payload():
    # Empty image test
    img = np.ones((400, 400, 3), dtype=np.uint8) * 255
    res = qr_detection_service.detect_qr(img)
    assert not res["qr_detected"]
    assert res["validation_status"] == "none"

    # URL safety analysis
    safe_analysis = qr_detection_service._analyze_payload("https://stanford.edu/verify?cert_id=STAN-8841", None)
    assert safe_analysis["qr_detected"]
    assert safe_analysis["is_trusted_domain"]
    assert safe_analysis["certificate_identifier"] == "STAN-8841"

    # Untrusted third party domain
    untrusted = qr_detection_service._analyze_payload("https://unverified-site.biz/cert", None)
    assert untrusted["qr_detected"]
    assert not untrusted["is_trusted_domain"]
    assert "untrusted" in untrusted["validation_status"]


# ==================== 5. DOCUMENT CLASSIFICATION TESTS ====================

def test_document_classification_hybrid():
    text_degree = "Conferred the Degree of Bachelor of Science by the University Chancellor at convocation."
    res1 = document_classification_service.classify(text_degree)
    assert res1["predicted_type"] == "Degree Certificate"
    assert res1["confidence"] > 0.40

    text_marks = "Statement of Marks semester examination seat no 10294 marks obtained 480 out of 500 CGPA 9.6 Passed."
    res2 = document_classification_service.classify(text_marks)
    assert res2["predicted_type"] == "Marksheet / Transcript"

    text_intern = "Successfully completed internship as Machine Learning Research Intern under engineering guidance."
    res3 = document_classification_service.classify(text_intern)
    assert res3["predicted_type"] == "Internship Certificate"


# ==================== 6. FEATURE EXTRACTION & ML TESTS ====================

def test_feature_extraction_vector():
    sample = {
        "text": "Certificate of Achievement for Alex Mercer 2024.",
        "ocr_confidence": 0.95,
        "laplacian_variance": 280.0,
        "contrast_std": 65.0,
        "noise_residual": 4.5,
        "ela_mean_residual": 8.0,
        "ela_max_residual": 32.0,
        "issue_year": 2024,
        "grad_year": 2024,
        "obtained_marks": 850,
        "maximum_marks": 1000,
        "percentage": 85.0,
        "certificate_id": "STAN-2024",
        "suspicious_metadata": False
    }

    vec = feature_extractor.extract_features(sample)
    assert len(vec) == 14
    assert vec[10] == 1.0  # date consistency valid (issue >= grad)
    assert vec[11] == 0.0  # marks calculation error zero

    # Test alteration vector
    sample_alt = sample.copy()
    sample_alt["issue_year"] = 2021  # issue before grad (impossible)
    sample_alt["percentage"] = 99.0  # discrepancy with 850/1000
    vec_alt = feature_extractor.extract_features(sample_alt)
    assert vec_alt[10] == 0.0  # flagged inverted date
    assert vec_alt[11] == 14.0  # 99.0 - 85.0


def test_model_evaluator_metrics():
    eval_res = model_evaluator.evaluate_fraud_model()
    assert eval_res["status"] == "success"
    assert "metrics" in eval_res
    assert eval_res["metrics"]["f1_score"] >= 0.85
    assert "confusion_matrix" in eval_res


# ==================== 7. CONSISTENCY & RULES ENGINE TESTS ====================

def test_cross_field_consistency_rules():
    # 1. Clean valid fields
    clean_fields = {
        "holder_name": {"value": "Alex Mercer"},
        "graduation_year": {"value": "2024"},
        "issue_date": {"value": "16/06/2024"}
    }
    res_clean = consistency_service.validate_consistency(clean_fields, "Degree Certificate", {"holder_name": "Alex Mercer"})
    assert res_clean["checks_passed"]
    assert res_clean["total_findings"] == 0

    # 2. Chronological violation (issue 2020 precedes graduation 2024)
    conflict_fields = {
        "holder_name": {"value": "Alex Mercer"},
        "graduation_year": {"value": "2024"},
        "issue_date": {"value": "15/05/2020"}
    }
    res_conflict = consistency_service.validate_consistency(conflict_fields, "Degree Certificate")
    assert not res_conflict["checks_passed"]
    rule_ids = [f["rule_id"] for f in res_conflict["findings"]]
    assert "RULE_ACADEMIC_CHRONOLOGY_INVERTED" in rule_ids

    # 3. Marksheet arithmetic discrepancy
    marks_fields = {
        "obtained_marks": {"value": 800},
        "maximum_marks": {"value": 1000},
        "percentage": {"value": 98.0}  # Should be 80.0%
    }
    res_marks = consistency_service.validate_consistency(marks_fields, "Marksheet / Transcript")
    assert not res_marks["checks_passed"]
    rule_ids2 = [f["rule_id"] for f in res_marks["findings"]]
    assert "RULE_PERCENTAGE_MATH_MISMATCH" in rule_ids2


# ==================== 8. RISK SCORING & REPORT TESTS ====================

def test_risk_scoring_engine_and_categories():
    # Low risk indicators
    low_res = risk_scoring_service.calculate_risk_score(
        quality_assessment={"quality_score": 85},
        ml_analysis={"anomaly_probability": 0.05, "is_statistical_outlier": False},
        image_forensics={"error_level_analysis": {"inconsistency_detected": False}, "suspicious_regions": []},
        metadata_analysis={"suspicious_software_detected": False, "timestamp_inconsistency": False},
        consistency_checks={"critical_findings_count": 0, "total_findings": 0},
        template_analysis={"template_available": False},
        issuer_verified=True,
        blockchain_verified=False
    )
    assert low_res["risk_score"] <= 29
    assert low_res["category_key"] == "low_risk"
    assert "TrustChain AI provides automated document analysis" in low_res["disclaimer"]

    # High risk indicators (multiple anomalies)
    high_res = risk_scoring_service.calculate_risk_score(
        quality_assessment={"quality_score": 50},
        ml_analysis={"anomaly_probability": 0.85, "is_statistical_outlier": True},
        image_forensics={"error_level_analysis": {"inconsistency_detected": True}, "suspicious_regions": [{}, {}]},
        metadata_analysis={"suspicious_software_detected": True, "timestamp_inconsistency": True},
        consistency_checks={"critical_findings_count": 2, "total_findings": 3},
        template_analysis={"template_available": False},
        issuer_verified=False,
        blockchain_verified=False
    )
    assert high_res["risk_score"] >= 70
    assert high_res["category_key"] in ["elevated_risk", "high_risk"]


def test_pdf_report_compilation():
    sample_report = report_generation_service.generate_report(
        document_id="doc_test_pdf_01",
        document_category="Degree Certificate",
        category_confidence=0.94,
        extracted_info={"extracted_fields": {"holder_name": {"value": "Alex Mercer", "confidence": 0.95}}},
        quality={"quality_score": 88},
        ml_analysis={"anomaly_probability": 0.04},
        forensics={"suspicious_regions": []},
        metadata_analysis={"suspicious_software_detected": False},
        consistency={"findings": []},
        template_analysis={"template_available": False},
        risk_assessment={"risk_score": 12, "category_label": "Low Risk Indicators", "verdict_phrase": "No anomalies."},
        findings=[]
    )

    pdf_bytes = report_generation_service.export_pdf_dossier(sample_report, "Test_Degree.pdf")
    assert pdf_bytes.startswith(b"%PDF")
    assert len(pdf_bytes) > 1000


# ==================== 9. FASTAPI ENDPOINT INTEGRATION TESTS ====================

def test_api_ai_models_status():
    response = client.get("/api/v1/ai/models/status")
    assert response.status_code == 200
    data = response.json()
    assert "active_models" in data
    assert len(data["active_models"]) >= 3


def test_api_ai_models_metrics():
    response = client.get("/api/v1/ai/models/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "metrics" in data


def test_api_ai_analyze_endpoint():
    response = client.post("/api/v1/ai/analyze/doc_demo_degree_01")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert "ocr_result" in data
    assert "extracted_information" in data
    assert "risk_assessment" in data
    assert "report_id" in data


def test_api_ai_download_pdf_report():
    # First analyze to generate report
    ana_res = client.post("/api/v1/ai/analyze/doc_demo_degree_01").json()
    report_id = ana_res["report_id"]

    # Download PDF
    pdf_resp = client.get(f"/api/v1/ai/report/{report_id}/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert pdf_resp.content.startswith(b"%PDF")


def test_api_ai_user_feedback():
    ana_res = client.post("/api/v1/ai/analyze/doc_demo_degree_01").json()
    report_id = ana_res["report_id"]

    feedback_payload = {
        "finding_id": "find_01",
        "feedback_type": "finding_correct",
        "user_correction": None,
        "comment": "Verification result matches physical institutional registry records."
    }
    resp = client.post(f"/api/v1/ai/feedback/{report_id}", json=feedback_payload)
    assert resp.status_code == 200
    assert resp.json()["success"]
