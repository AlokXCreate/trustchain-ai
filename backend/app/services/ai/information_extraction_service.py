"""
TrustChain AI - Structured Information Extraction Service
Extracts domain-specific fields from OCR text blocks and visual cues
using configurable pattern matching and heuristic rules.
Never fabricates missing values; explicitly marks unavailable fields.
"""

import re
from typing import Dict, Any, List, Optional


class InformationExtractionService:
    """
    Extracts key credential fields according to document category schemas:
    Degree Certificate, Marksheet, Internship, Training/Skill, Experience Letter.
    """

    def __init__(self):
        pass

    def extract_information(
        self,
        ocr_result: Dict[str, Any],
        document_category: str = "Degree Certificate",
        declared_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Extracts structured information from multi-page OCR text blocks.
        """
        declared = declared_metadata or {}
        pages = ocr_result.get("pages", [])
        
        # Combine all page texts
        full_text = "\n".join([p.get("extracted_text", "") for p in pages])
        all_blocks = []
        for p in pages:
            for b in p.get("text_blocks", []):
                all_blocks.append({**b, "page_number": p.get("page_number", 1)})

        fields: Dict[str, Dict[str, Any]] = {}

        # 1. Common Fields
        fields["holder_name"] = self._extract_holder_name(full_text, all_blocks, declared.get("holder_name"))
        fields["certificate_number"] = self._extract_certificate_number(full_text, all_blocks, declared.get("certificate_number"))
        fields["issuing_organization"] = self._extract_issuer(full_text, all_blocks, declared.get("issuer_name"))
        fields["issue_date"] = self._extract_issue_date(full_text, all_blocks, declared.get("issue_date"))
        fields["registration_number"] = self._extract_registration_number(full_text, all_blocks)

        cat_normalized = document_category.lower()

        # 2. Category-Specific Fields
        if "degree" in cat_normalized or "academic" in cat_normalized:
            fields.update(self._extract_degree_fields(full_text, all_blocks))
        elif "mark" in cat_normalized or "transcript" in cat_normalized:
            fields.update(self._extract_marksheet_fields(full_text, all_blocks))
        elif "intern" in cat_normalized:
            fields.update(self._extract_internship_fields(full_text, all_blocks))
        elif "experience" in cat_normalized:
            fields.update(self._extract_experience_fields(full_text, all_blocks))
        elif "train" in cat_normalized or "skill" in cat_normalized:
            fields.update(self._extract_training_fields(full_text, all_blocks))
        else:
            # Generic certificate fields
            fields.update(self._extract_degree_fields(full_text, all_blocks))

        return {
            "document_category": document_category,
            "extracted_fields": fields,
            "fields_found_count": sum(1 for f in fields.values() if f.get("value") is not None),
            "fields_total_count": len(fields)
        }

    # ==================== Common Extractors ====================

    def _extract_holder_name(
        self,
        full_text: str,
        blocks: List[Dict[str, Any]],
        declared_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Extracts candidate/holder name."""
        # 1. Check if declared name is explicitly in text
        if declared_name:
            for b in blocks:
                if declared_name.lower() in b["text"].lower():
                    return {
                        "field_name": "holder_name",
                        "value": declared_name,
                        "confidence": 0.98,
                        "source_page": b.get("page_number", 1),
                        "source_text": b["text"],
                        "bounding_box": b.get("bounding_box")
                    }

        # 2. Regex patterns on full text and blocks
        patterns = [
            r"(?:certify that|awarded to|conferred upon|presented to|Mr\.|Ms\.|Mrs\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})",
            r"(?:Name of Student|Student Name|Candidate Name|Employee Name)\s*[:\-]\s*([A-Z][a-zA-Z\s]{3,35})",
            r"This is to certify that\s+([A-Z][a-zA-Z\s]{3,35})\s+(?:has|of|son|daughter)"
        ]

        for p in patterns:
            match = re.search(p, full_text, re.IGNORECASE)
            if match:
                val = match.group(1).strip()
                # Find matching block
                for b in blocks:
                    if val.lower() in b["text"].lower():
                        return {
                            "field_name": "holder_name",
                            "value": val,
                            "confidence": 0.92,
                            "source_page": b.get("page_number", 1),
                            "source_text": b["text"],
                            "bounding_box": b.get("bounding_box")
                        }
                return {
                    "field_name": "holder_name",
                    "value": val,
                    "confidence": 0.88,
                    "source_page": 1,
                    "source_text": match.group(0),
                    "bounding_box": None
                }

        # Value not found
        return {
            "field_name": "holder_name",
            "value": declared_name if declared_name else None,
            "confidence": 0.50 if declared_name else 0.0,
            "source_page": None,
            "source_text": "Field unavailable in OCR extracted text",
            "bounding_box": None
        }

    def _extract_certificate_number(
        self,
        full_text: str,
        blocks: List[Dict[str, Any]],
        declared_num: Optional[str] = None
    ) -> Dict[str, Any]:
        """Extracts certificate / credential ID."""
        patterns = [
            r"(?:Certificate\s*(?:No|Number|ID|#)|Cert\s*#|Reg(?:\.|istration)?\s*No|Serial\s*No)\s*[:\-]?\s*([A-Z0-9\-\/]{4,25})",
            r"\b(CERT-[A-Z0-9\-]{5,20})\b",
            r"\b([A-Z]{2,4}\/[0-9]{4}\/[0-9]{3,8})\b",
            r"\b(DEG-[0-9]{4}-[0-9]{3,8})\b"
        ]
        for p in patterns:
            match = re.search(p, full_text, re.IGNORECASE)
            if match:
                val = match.group(1).strip()
                for b in blocks:
                    if val.lower() in b["text"].lower():
                        return {
                            "field_name": "certificate_number",
                            "value": val,
                            "confidence": 0.94,
                            "source_page": b.get("page_number", 1),
                            "source_text": b["text"],
                            "bounding_box": b.get("bounding_box")
                        }
                return {
                    "field_name": "certificate_number",
                    "value": val,
                    "confidence": 0.89,
                    "source_page": 1,
                    "source_text": match.group(0),
                    "bounding_box": None
                }

        return {
            "field_name": "certificate_number",
            "value": declared_num if declared_num else None,
            "confidence": 0.60 if declared_num else 0.0,
            "source_page": None,
            "source_text": "Certificate number unavailable in OCR text",
            "bounding_box": None
        }

    def _extract_issuer(
        self,
        full_text: str,
        blocks: List[Dict[str, Any]],
        declared_issuer: Optional[str] = None
    ) -> Dict[str, Any]:
        """Extracts issuing institution or organization."""
        if declared_issuer:
            for b in blocks:
                if declared_issuer.lower() in b["text"].lower():
                    return {
                        "field_name": "issuing_organization",
                        "value": declared_issuer,
                        "confidence": 0.96,
                        "source_page": b.get("page_number", 1),
                        "source_text": b["text"],
                        "bounding_box": b.get("bounding_box")
                    }

        patterns = [
            r"([A-Z][a-zA-Z\s]{3,40}(?:University|Institute|College|Academy|Corporation|Technologies|Labs|Inc\.|LLC|Ltd\b))",
            r"(?:Issued by|Organization|University)\s*[:\-]\s*([A-Z][a-zA-Z\s]{3,40})"
        ]
        for p in patterns:
            match = re.search(p, full_text)
            if match:
                val = match.group(1).strip()
                for b in blocks:
                    if val.lower() in b["text"].lower():
                        return {
                            "field_name": "issuing_organization",
                            "value": val,
                            "confidence": 0.90,
                            "source_page": b.get("page_number", 1),
                            "source_text": b["text"],
                            "bounding_box": b.get("bounding_box")
                        }
                return {
                    "field_name": "issuing_organization",
                    "value": val,
                    "confidence": 0.85,
                    "source_page": 1,
                    "source_text": match.group(0),
                    "bounding_box": None
                }

        return {
            "field_name": "issuing_organization",
            "value": declared_issuer if declared_issuer else None,
            "confidence": 0.50 if declared_issuer else 0.0,
            "source_page": None,
            "source_text": "Issuer unavailable in OCR text",
            "bounding_box": None
        }

    def _extract_issue_date(
        self,
        full_text: str,
        blocks: List[Dict[str, Any]],
        declared_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Extracts issuance date."""
        patterns = [
            r"(?:Date of Issue|Issue Date|Dated|Date)\s*[:\-]?\s*([0-9]{1,2}[/\-\.][0-9]{1,2}[/\-\.][0-9]{2,4})",
            r"(?:Date of Issue|Issue Date|Dated|Date)\s*[:\-]?\s*([A-Za-z]+\s+[0-9]{1,2},?\s+[0-9]{4})",
            r"\b([0-9]{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+[0-9]{4})\b",
            r"\b([0-9]{4}-[0-9]{2}-[0-9]{2})\b"
        ]
        for p in patterns:
            match = re.search(p, full_text, re.IGNORECASE)
            if match:
                val = match.group(1).strip()
                for b in blocks:
                    if val.lower() in b["text"].lower():
                        return {
                            "field_name": "issue_date",
                            "value": val,
                            "confidence": 0.93,
                            "source_page": b.get("page_number", 1),
                            "source_text": b["text"],
                            "bounding_box": b.get("bounding_box")
                        }
                return {
                    "field_name": "issue_date",
                    "value": val,
                    "confidence": 0.87,
                    "source_page": 1,
                    "source_text": match.group(0),
                    "bounding_box": None
                }

        return {
            "field_name": "issue_date",
            "value": declared_date if declared_date else None,
            "confidence": 0.60 if declared_date else 0.0,
            "source_page": None,
            "source_text": "Issue date unavailable in OCR text",
            "bounding_box": None
        }

    def _extract_registration_number(self, full_text: str, blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        patterns = [
            r"(?:Enrollment|Registration|Roll|Seat|PRN)\s*(?:No|Number|#)\s*[:\-]?\s*([A-Z0-9\-]{4,20})"
        ]
        for p in patterns:
            match = re.search(p, full_text, re.IGNORECASE)
            if match:
                val = match.group(1).strip()
                return {
                    "field_name": "registration_number",
                    "value": val,
                    "confidence": 0.91,
                    "source_page": 1,
                    "source_text": match.group(0),
                    "bounding_box": None
                }
        return {
            "field_name": "registration_number",
            "value": None,
            "confidence": 0.0,
            "source_page": None,
            "source_text": "Registration number unavailable",
            "bounding_box": None
        }

    # ==================== Category Specific ====================

    def _extract_degree_fields(self, text: str, blocks: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        fields = {}
        # Degree / Major
        deg_match = re.search(
            r"(Bachelor|Master|Doctor|Bachelor of Science|Bachelor of Technology|Bachelor of Engineering|Master of Science|B\.Tech|B\.Sc|M\.Tech|Ph\.D|B\.E\.|M\.B\.A\.)\s+(?:of|in)?\s*([A-Za-z\s]+)?",
            text,
            re.IGNORECASE
        )
        fields["degree_title"] = {
            "field_name": "degree_title",
            "value": deg_match.group(0).strip() if deg_match else None,
            "confidence": 0.91 if deg_match else 0.0,
            "source_page": 1 if deg_match else None,
            "source_text": deg_match.group(0) if deg_match else "Degree title unavailable",
            "bounding_box": None
        }

        # Graduation Year
        grad_match = re.search(r"(?:graduated in|conferred in|year of passing|convocation)\s*[:\-]?\s*([0-9]{4})", text, re.IGNORECASE)
        fields["graduation_year"] = {
            "field_name": "graduation_year",
            "value": grad_match.group(1) if grad_match else None,
            "confidence": 0.92 if grad_match else 0.0,
            "source_page": 1 if grad_match else None,
            "source_text": grad_match.group(0) if grad_match else "Graduation year unavailable",
            "bounding_box": None
        }

        # Division / Honors
        div_match = re.search(r"(First Class with Distinction|First Class|Second Class|Magna Cum Laude|Summa Cum Laude|Honours|Honors)", text, re.IGNORECASE)
        fields["classification_or_honors"] = {
            "field_name": "classification_or_honors",
            "value": div_match.group(1) if div_match else None,
            "confidence": 0.88 if div_match else 0.0,
            "source_page": 1 if div_match else None,
            "source_text": div_match.group(0) if div_match else "Classification unavailable",
            "bounding_box": None
        }
        return fields

    def _extract_marksheet_fields(self, text: str, blocks: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        fields = {}
        
        # Total Marks
        tot_match = re.search(r"(?:Total Marks|Grand Total|Marks Obtained)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:/|out of)\s*([0-9]+)", text, re.IGNORECASE)
        if tot_match:
            fields["obtained_marks"] = {
                "field_name": "obtained_marks",
                "value": float(tot_match.group(1)),
                "confidence": 0.95,
                "source_page": 1,
                "source_text": tot_match.group(0),
                "bounding_box": None
            }
            fields["maximum_marks"] = {
                "field_name": "maximum_marks",
                "value": float(tot_match.group(2)),
                "confidence": 0.95,
                "source_page": 1,
                "source_text": tot_match.group(0),
                "bounding_box": None
            }
        else:
            fields["obtained_marks"] = {"field_name": "obtained_marks", "value": None, "confidence": 0.0, "source_page": None, "source_text": "Not found", "bounding_box": None}
            fields["maximum_marks"] = {"field_name": "maximum_marks", "value": None, "confidence": 0.0, "source_page": None, "source_text": "Not found", "bounding_box": None}

        # Percentage or CGPA
        cgpa_match = re.search(r"(?:CGPA|GPA|SGPA)\s*[:\-]?\s*([0-9]+(?:\.[0-9]{1,2})?)", text, re.IGNORECASE)
        pct_match = re.search(r"(?:Percentage|Overall %)\s*[:\-]?\s*([0-9]+(?:\.[0-9]{1,2})?)\s*%", text, re.IGNORECASE)
        fields["cgpa"] = {
            "field_name": "cgpa",
            "value": float(cgpa_match.group(1)) if cgpa_match else None,
            "confidence": 0.93 if cgpa_match else 0.0,
            "source_page": 1 if cgpa_match else None,
            "source_text": cgpa_match.group(0) if cgpa_match else "CGPA unavailable",
            "bounding_box": None
        }
        fields["percentage"] = {
            "field_name": "percentage",
            "value": float(pct_match.group(1)) if pct_match else None,
            "confidence": 0.93 if pct_match else 0.0,
            "source_page": 1 if pct_match else None,
            "source_text": pct_match.group(0) if pct_match else "Percentage unavailable",
            "bounding_box": None
        }

        # Result status
        res_match = re.search(r"\b(PASS|PASSED|FAILED|FIRST CLASS)\b", text, re.IGNORECASE)
        fields["result_status"] = {
            "field_name": "result_status",
            "value": res_match.group(1).upper() if res_match else None,
            "confidence": 0.90 if res_match else 0.0,
            "source_page": 1 if res_match else None,
            "source_text": res_match.group(0) if res_match else "Result status unavailable",
            "bounding_box": None
        }
        return fields

    def _extract_internship_fields(self, text: str, blocks: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        fields = {}
        role_match = re.search(r"(?:intern as|role of|position of|internship in)\s*[:\-]?\s*([A-Za-z\s]{3,30})", text, re.IGNORECASE)
        fields["internship_role"] = {
            "field_name": "internship_role",
            "value": role_match.group(1).strip() if role_match else None,
            "confidence": 0.90 if role_match else 0.0,
            "source_page": 1 if role_match else None,
            "source_text": role_match.group(0) if role_match else "Role unavailable",
            "bounding_box": None
        }

        tenure_match = re.search(r"(?:from|period)\s+([0-9]{1,2}[/\-\.][0-9]{1,2}[/\-\.][0-9]{2,4}|[A-Za-z]+\s+[0-9]{4})\s+to\s+([0-9]{1,2}[/\-\.][0-9]{1,2}[/\-\.][0-9]{2,4}|[A-Za-z]+\s+[0-9]{4})", text, re.IGNORECASE)
        fields["internship_start_date"] = {
            "field_name": "internship_start_date",
            "value": tenure_match.group(1).strip() if tenure_match else None,
            "confidence": 0.92 if tenure_match else 0.0,
            "source_page": 1 if tenure_match else None,
            "source_text": tenure_match.group(0) if tenure_match else "Start date unavailable",
            "bounding_box": None
        }
        fields["internship_end_date"] = {
            "field_name": "internship_end_date",
            "value": tenure_match.group(2).strip() if tenure_match else None,
            "confidence": 0.92 if tenure_match else 0.0,
            "source_page": 1 if tenure_match else None,
            "source_text": tenure_match.group(0) if tenure_match else "End date unavailable",
            "bounding_box": None
        }
        return fields

    def _extract_experience_fields(self, text: str, blocks: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        fields = {}
        desig_match = re.search(r"(?:designation of|employed as|worked as)\s*[:\-]?\s*([A-Za-z\s]{3,35})", text, re.IGNORECASE)
        fields["designation"] = {
            "field_name": "designation",
            "value": desig_match.group(1).strip() if desig_match else None,
            "confidence": 0.89 if desig_match else 0.0,
            "source_page": 1 if desig_match else None,
            "source_text": desig_match.group(0) if desig_match else "Designation unavailable",
            "bounding_box": None
        }
        return fields

    def _extract_training_fields(self, text: str, blocks: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        fields = {}
        course_match = re.search(r"(?:completed the course|training program in|certified in)\s*[:\-]?\s*([A-Za-z0-9\s\+\#]{3,40})", text, re.IGNORECASE)
        fields["course_name"] = {
            "field_name": "course_name",
            "value": course_match.group(1).strip() if course_match else None,
            "confidence": 0.90 if course_match else 0.0,
            "source_page": 1 if course_match else None,
            "source_text": course_match.group(0) if course_match else "Course name unavailable",
            "bounding_box": None
        }
        return fields


# Global singleton
information_extraction_service = InformationExtractionService()
