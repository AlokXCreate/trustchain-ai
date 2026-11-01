"""
TrustChain AI - Explainable Risk Scoring Engine
Aggregates heterogeneous multi-modal evidence using calibrated risk weights.
Maintains strict non-fabrication principles, transparent categories,
and mandatory institutional verification disclaimers.
"""

from typing import Dict, Any, List, Optional


class RiskScoringService:
    """
    Weighted evidence aggregation engine.
    Calculates composite risk score (0-100) and maps to 4 calibrated risk tiers.
    """

    MANDATORY_DISCLAIMER = (
        "TrustChain AI provides automated document analysis and preliminary risk assessment. "
        "Its findings are not definitive proof of authenticity or fraud. "
        "Final verification should be conducted by the authorized issuing institution."
    )

    def calculate_risk_score(
        self,
        quality_assessment: Dict[str, Any],
        ml_analysis: Dict[str, Any],
        image_forensics: Dict[str, Any],
        metadata_analysis: Dict[str, Any],
        consistency_checks: Dict[str, Any],
        template_analysis: Dict[str, Any],
        issuer_verified: bool = False,
        blockchain_verified: bool = False
    ) -> Dict[str, Any]:
        """
        Combines multi-modal signals into an interpretable risk assessment.
        """
        # Baseline score: 5 (benign baseline)
        score = 5.0
        component_breakdown = {}
        risk_factors = []
        positive_factors = []

        # 1. Cross-Field Consistency (Weight: High)
        # Mathematical discrepancies and inverted dates are strong logical contradictions
        crit_findings = consistency_checks.get("critical_findings_count", 0)
        total_findings = consistency_checks.get("total_findings", 0)
        consistency_penalty = (crit_findings * 25.0) + ((total_findings - crit_findings) * 10.0)
        consistency_penalty = min(40.0, consistency_penalty)
        score += consistency_penalty
        component_breakdown["cross_field_consistency"] = {
            "score_contribution": round(consistency_penalty, 1),
            "findings_count": total_findings,
            "status": "issues_detected" if total_findings > 0 else "clean"
        }
        if total_findings > 0:
            risk_factors.append(f"{total_findings} cross-field data discrepancies detected.")
        else:
            positive_factors.append("Cross-field data and mathematical fields are fully consistent.")

        # 2. Image Forensics (Weight: Moderate)
        # ELA compression anomalies and splice patches
        ela_anom = image_forensics.get("error_level_analysis", {}).get("inconsistency_detected", False)
        suspicious_regions = len(image_forensics.get("suspicious_regions", []))
        forensics_penalty = (18.0 if ela_anom else 0.0) + (suspicious_regions * 6.0)
        forensics_penalty = min(30.0, forensics_penalty)
        score += forensics_penalty
        component_breakdown["image_forensics"] = {
            "score_contribution": round(forensics_penalty, 1),
            "ela_anomaly": ela_anom,
            "suspicious_regions_count": suspicious_regions
        }
        if ela_anom:
            risk_factors.append("Compression artifact differentials localized via Error Level Analysis.")
        else:
            positive_factors.append("Visual compression pattern appears uniform across document.")

        # 3. ML Fraud & Outlier Prediction (Weight: Moderate)
        ml_prob = ml_analysis.get("anomaly_probability", 0.05)
        is_outlier = ml_analysis.get("is_statistical_outlier", False)
        ml_contrib = (ml_prob * 25.0) + (10.0 if is_outlier else 0.0)
        ml_contrib = min(30.0, ml_contrib)
        score += ml_contrib
        component_breakdown["ml_anomaly_detection"] = {
            "score_contribution": round(ml_contrib, 1),
            "anomaly_probability": ml_prob,
            "is_outlier": is_outlier
        }
        if ml_prob > 0.40:
            risk_factors.append(f"ML feature distribution deviates from legitimate baseline (p={ml_prob:.2f}).")

        # 4. Document Metadata (Weight: Low-to-Moderate)
        suspicious_software = metadata_analysis.get("suspicious_software_detected", False)
        ts_inconsistent = metadata_analysis.get("timestamp_inconsistency", False)
        meta_penalty = (15.0 if suspicious_software else 0.0) + (10.0 if ts_inconsistent else 0.0)
        score += meta_penalty
        component_breakdown["metadata_integrity"] = {
            "score_contribution": round(meta_penalty, 1),
            "suspicious_software": suspicious_software,
            "timestamp_inconsistent": ts_inconsistent
        }
        if suspicious_software:
            tools = ", ".join(metadata_analysis.get("suspicious_software_list", []))
            risk_factors.append(f"Image or PDF metadata generated with graphic editor ({tools}).")

        # 5. Template Layout Divergence (Weight: Low)
        if template_analysis.get("template_available"):
            sim_score = template_analysis.get("layout_similarity_score", 1.0)
            if sim_score < 0.60:
                score += 15.0
                risk_factors.append("Spatial layout diverges from registered institutional template.")
            else:
                positive_factors.append("Spatial layout conforms to registered institutional baseline.")

        # Positive Accreditations / Reductions
        if issuer_verified:
            score -= 15.0
            positive_factors.append("Issuing organization matched in TrustChain Institutional Registry.")

        if blockchain_verified:
            # Strong cryptographic proof
            score -= 25.0
            positive_factors.append("Cryptographic credential hash verified on TrustChain blockchain.")

        # Document Quality impact
        # NOTE: A low quality scan is NOT proof of fraud, but creates uncertainty
        quality_score = quality_assessment.get("quality_score", 85)
        if quality_score < 40:
            uncertainty_note = "Document resolution/blur creates uncertainty; rescanning recommended."
        else:
            uncertainty_note = "Document visual quality is adequate for automated assessment."

        # Clamp composite score to [0, 100]
        final_score = int(max(0, min(100, round(score))))

        # Determine calibrated Risk Category
        if final_score <= 29:
            category_key = "low_risk"
            category_label = "Low Risk Indicators"
            verdict_phrase = "No significant anomalies detected."
            action_recommendation = "Standard processing may proceed."
        elif final_score <= 59:
            category_key = "moderate_risk"
            category_label = "Moderate Risk Indicators"
            verdict_phrase = "Additional verification recommended."
            action_recommendation = "Perform secondary review of highlighted discrepancies before authorization."
        elif final_score <= 79:
            category_key = "elevated_risk"
            category_label = "Elevated Risk Indicators"
            verdict_phrase = "Elevated risk indicators detected."
            action_recommendation = "Direct verification with issuing university/employer required."
        else:
            category_key = "high_risk"
            category_label = "High Risk Indicators"
            verdict_phrase = "High-risk anomalies detected."
            action_recommendation = "Flag for formal investigation and contact institutional authority directly."

        explanation = (
            f"{verdict_phrase} Overall composite risk score is {final_score}/100 based on {len(risk_factors)} risk factors "
            f"and {len(positive_factors)} positive indicators."
        )

        return {
            "risk_score": final_score,
            "category_key": category_key,
            "category_label": category_label,
            "verdict_phrase": verdict_phrase,
            "action_recommendation": action_recommendation,
            "explanation": explanation,
            "component_breakdown": component_breakdown,
            "risk_factors": risk_factors,
            "positive_factors": positive_factors,
            "quality_note": uncertainty_note,
            "disclaimer": self.MANDATORY_DISCLAIMER
        }


# Global singleton
risk_scoring_service = RiskScoringService()
