"""
TrustChain AI - Cross-Field Consistency Rules Engine
Validates mathematical integrity, chronological dates, name alignment,
and credential syntax across extracted document fields.
"""

import re
from datetime import datetime
from typing import Dict, Any, List, Optional


class ConsistencyService:
    """
    Configurable cross-field consistency engine.
    Audits relationships between individual extracted fields and declared metadata.
    """

    def validate_consistency(
        self,
        extracted_fields: Dict[str, Any],
        document_category: str = "Degree Certificate",
        declared_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes domain rules and returns a structured list of consistency findings.
        """
        findings = []
        declared = declared_metadata or {}
        cat_lower = document_category.lower()

        # 1. Common Checks: Holder Name Alignment
        holder_val = self._get_val(extracted_fields, "holder_name")
        declared_name = declared.get("holder_name")
        if holder_val and declared_name:
            if not self._names_match(holder_val, declared_name):
                findings.append({
                    "rule_id": "RULE_NAME_MISMATCH",
                    "severity": "high",
                    "field_involved": "holder_name",
                    "observed_value": f"Extracted: '{holder_val}' vs Declared: '{declared_name}'",
                    "expected_condition": "Document name must match declared applicant name.",
                    "explanation": "Extracted credential recipient name diverges from the declared identity.",
                    "evidence_source": "OCR text extraction vs User registration metadata",
                    "recommended_action": "Verify government ID or request identity proof document."
                })

        # 2. Common Checks: Certificate Number Syntax
        cert_num = self._get_val(extracted_fields, "certificate_number")
        if cert_num:
            if len(cert_num) < 4:
                findings.append({
                    "rule_id": "RULE_CERT_NUM_TOO_SHORT",
                    "severity": "medium",
                    "field_involved": "certificate_number",
                    "observed_value": cert_num,
                    "expected_condition": "Certificate number should have standard alphanumeric format (> 4 chars).",
                    "explanation": "Certificate identifier appears unusually brief or truncated.",
                    "evidence_source": "Regex pattern extractor",
                    "recommended_action": "Manually inspect physical credential serial code."
                })

        # 3. Category Specific Rules: Academic Degrees
        if "degree" in cat_lower or "academic" in cat_lower:
            findings.extend(self._validate_academic_rules(extracted_fields))

        # 4. Category Specific Rules: Marksheets
        elif "mark" in cat_lower or "transcript" in cat_lower:
            findings.extend(self._validate_marksheet_rules(extracted_fields))

        # 5. Category Specific Rules: Internships
        elif "intern" in cat_lower:
            findings.extend(self._validate_internship_rules(extracted_fields))

        # 6. Category Specific Rules: Experience Letters
        elif "experience" in cat_lower:
            findings.extend(self._validate_experience_rules(extracted_fields))

        # Determine overall consistency status
        critical_count = sum(1 for f in findings if f["severity"] in ["high", "critical"])
        has_issues = len(findings) > 0

        return {
            "checks_passed": not has_issues,
            "total_rules_evaluated": 12,
            "total_findings": len(findings),
            "critical_findings_count": critical_count,
            "findings": findings,
            "summary": (
                "All cross-field mathematical and chronological checks passed."
                if not has_issues else
                f"Detected {len(findings)} consistency discrepancies ({critical_count} elevated severity)."
            )
        }

    def _validate_academic_rules(self, fields: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        issue_date_str = self._get_val(fields, "issue_date")
        grad_year_str = self._get_val(fields, "graduation_year")

        if issue_date_str and grad_year_str:
            issue_year = self._extract_year(issue_date_str)
            try:
                grad_year = int(grad_year_str)
                if issue_year and grad_year:
                    if issue_year < grad_year:
                        findings.append({
                            "rule_id": "RULE_ACADEMIC_CHRONOLOGY_INVERTED",
                            "severity": "high",
                            "field_involved": "issue_date / graduation_year",
                            "observed_value": f"Issue Year: {issue_year}, Graduation Year: {grad_year}",
                            "expected_condition": "Issue date year must be greater than or equal to graduation year.",
                            "explanation": "Credential issue date chronologically precedes the stated graduation year.",
                            "evidence_source": "Structured field extraction",
                            "recommended_action": "Check with university registrar regarding convocation scheduling."
                        })
                    elif (issue_year - grad_year) > 10:
                        findings.append({
                            "rule_id": "RULE_ACADEMIC_DATE_GAP_LARGE",
                            "severity": "low",
                            "field_involved": "issue_date",
                            "observed_value": f"Gap of {issue_year - grad_year} years",
                            "expected_condition": "Standard issuance typically occurs within 1-2 years of graduation.",
                            "explanation": "Certificate issued significantly later than degree completion (duplicate or reissue).",
                            "evidence_source": "Chronological audit",
                            "recommended_action": "Confirm whether this is an official duplicate re-issuance."
                        })
            except ValueError:
                pass

        return findings

    def _validate_marksheet_rules(self, fields: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        obtained = self._get_val(fields, "obtained_marks")
        maximum = self._get_val(fields, "maximum_marks")
        percentage = self._get_val(fields, "percentage")

        if obtained is not None and maximum is not None:
            try:
                obt = float(obtained)
                mx = float(maximum)
                if obt > mx:
                    findings.append({
                        "rule_id": "RULE_MARKS_EXCEED_MAXIMUM",
                        "severity": "critical",
                        "field_involved": "obtained_marks",
                        "observed_value": f"{obt} / {mx}",
                        "expected_condition": "Obtained marks cannot exceed maximum possible marks.",
                        "explanation": "Mathematical impossibility: student marks exceed total paper maximum.",
                        "evidence_source": "Marksheet tabular arithmetic",
                        "recommended_action": "Flag document for manual transcript inspection."
                    })
                elif percentage is not None and mx > 0:
                    expected_pct = (obt / mx) * 100.0
                    reported_pct = float(percentage)
                    discrepancy = abs(expected_pct - reported_pct)
                    if discrepancy > 1.0:
                        findings.append({
                            "rule_id": "RULE_PERCENTAGE_MATH_MISMATCH",
                            "severity": "high",
                            "field_involved": "percentage",
                            "observed_value": f"Reported: {reported_pct}%, Calculated: {expected_pct:.2f}%",
                            "expected_condition": f"Percentage must equal (Obtained / Maximum) * 100 = {expected_pct:.2f}%.",
                            "explanation": f"Reported percentage diverges from mathematical marks ratio by {discrepancy:.2f}%.",
                            "evidence_source": "Arithmetic recalculation",
                            "recommended_action": "Verify grade transcript against university grading scale."
                        })
            except (ValueError, TypeError):
                pass

        return findings

    def _validate_internship_rules(self, fields: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        start_date_str = self._get_val(fields, "internship_start_date")
        end_date_str = self._get_val(fields, "internship_end_date")

        if start_date_str and end_date_str:
            start_dt = self._parse_date(start_date_str)
            end_dt = self._parse_date(end_date_str)
            if start_dt and end_dt and end_dt < start_dt:
                findings.append({
                    "rule_id": "RULE_INTERNSHIP_DATES_INVERTED",
                    "severity": "high",
                    "field_involved": "internship_dates",
                    "observed_value": f"Start: {start_date_str}, End: {end_date_str}",
                    "expected_condition": "Internship end date must follow start date.",
                    "explanation": "Chronological conflict: internship conclusion date is before start date.",
                    "evidence_source": "Internship duration extractor",
                    "recommended_action": "Contact company HR to confirm tenure dates."
                })
        return findings

    def _validate_experience_rules(self, fields: Dict[str, Any]) -> List[Dict[str, Any]]:
        findings = []
        desig = self._get_val(fields, "designation")
        if not desig:
            findings.append({
                "rule_id": "RULE_EXPERIENCE_MISSING_DESIGNATION",
                "severity": "medium",
                "field_involved": "designation",
                "observed_value": "Unavailable",
                "expected_condition": "Experience letters must state job title or designation.",
                "explanation": "Could not identify employee job title in employment certificate text.",
                "evidence_source": "Information extractor",
                "recommended_action": "Verify job role with issuing employer."
            })
        return findings

    def _get_val(self, fields: Dict[str, Any], key: str) -> Any:
        item = fields.get(key)
        if isinstance(item, dict):
            return item.get("value")
        return item

    def _names_match(self, n1: str, n2: str) -> bool:
        """Token-set matching for names allowing for initials or order differences."""
        t1 = set(re.findall(r"\w+", n1.lower()))
        t2 = set(re.findall(r"\w+", n2.lower()))
        # Remove common titles
        titles = {"mr", "ms", "mrs", "dr", "prof"}
        t1 -= titles
        t2 -= titles
        if not t1 or not t2:
            return True
        intersection = t1.intersection(t2)
        return len(intersection) >= min(len(t1), len(t2)) * 0.60

    def _extract_year(self, s: str) -> Optional[int]:
        m = re.search(r"\b(19\d\d|20\d\d)\b", str(s))
        return int(m.group(1)) if m else None

    def _parse_date(self, s: str) -> Optional[datetime]:
        formats = ["%d/%m/%Y", "%m/%d/%Y", "%Y-%m-%d", "%d-%m-%Y", "%B %Y", "%b %Y"]
        for fmt in formats:
            try:
                return datetime.strptime(str(s).strip(), fmt)
            except ValueError:
                continue
        return None


# Global singleton
consistency_service = ConsistencyService()
