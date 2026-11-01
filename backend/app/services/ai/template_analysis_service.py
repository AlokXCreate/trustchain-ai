"""
TrustChain AI - Template and Layout Analysis Service
Analyzes spatial document geometry against registered institutional reference templates.
Detects displaced, missing, or altered blocks; explicitly reports when no template is available.
"""

from typing import Dict, Any, List, Optional
import numpy as np


class TemplateAnalysisService:
    """
    Template and spatial layout analysis service.
    Enables authorized institutions to register official layout coordinates
    and compares uploaded credentials against registered baselines.
    """

    def __init__(self):
        # In-memory registry of authorized institutional templates
        # Key: Institution canonical name, Value: layout specification
        self._templates: Dict[str, Dict[str, Any]] = {}
        self._seed_reference_templates()

    def register_template(
        self,
        institution_name: str,
        category: str,
        expected_regions: List[Dict[str, Any]],
        template_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Allows authorized issuers to register official layout specifications."""
        key = f"{institution_name.lower().strip()}_{category.lower().strip()}"
        tid = template_id or f"tpl_{abs(hash(key)) % 100000:05d}"

        self._templates[key] = {
            "template_id": tid,
            "institution_name": institution_name,
            "category": category,
            "expected_regions": expected_regions,
            "version": "1.0",
            "is_active": True
        }
        return {"success": True, "template_id": tid, "key": key}

    def analyze_layout(
        self,
        ocr_blocks: List[Dict[str, Any]],
        institution_name: Optional[str],
        category: str,
        page_width: int = 1000,
        page_height: int = 1400
    ) -> Dict[str, Any]:
        """
        Compares observed OCR text block positions against registered reference templates.
        """
        if not institution_name:
            return self._template_unavailable_response(
                "Issuer identity unspecified; template matching cannot identify reference layout."
            )

        # Lookup registered template
        matched_key = None
        for k in self._templates:
            if institution_name.lower() in k and category.lower().split()[0] in k:
                matched_key = k
                break

        if not matched_key:
            return self._template_unavailable_response(
                "Reference template unavailable — template-based verification could not be performed."
            )

        tpl = self._templates[matched_key]
        expected_regions = tpl.get("expected_regions", [])

        # Match observed blocks to expected regions
        matched_count = 0
        displaced_regions = []
        missing_regions = []

        for exp in expected_regions:
            exp_name = exp.get("region_name")
            exp_box = exp.get("normalized_bbox")  # x, y, w, h normalized [0, 1]

            # Convert to pixels
            exp_px = {
                "x": int(exp_box["x"] * page_width),
                "y": int(exp_box["y"] * page_height),
                "width": int(exp_box["w"] * page_width),
                "height": int(exp_box["h"] * page_height)
            }

            # Find closest observed block
            best_iou = 0.0
            best_block = None

            for obs in ocr_blocks:
                obs_box = obs.get("bounding_box")
                if obs_box:
                    iou = self._calculate_iou(exp_px, obs_box)
                    if iou > best_iou:
                        best_iou = iou
                        best_block = obs

            if best_iou > 0.30:
                matched_count += 1
            elif best_iou > 0.05:
                # Displaced
                displaced_regions.append({
                    "region": exp_name,
                    "expected_coords": exp_px,
                    "observed_coords": best_block.get("bounding_box") if best_block else None,
                    "overlap_iou": round(best_iou, 2)
                })
            else:
                missing_regions.append(exp_name)

        total_exp = len(expected_regions)
        similarity_score = round(float(matched_count / max(1, total_exp)), 2)

        return {
            "template_available": True,
            "template_id": tpl.get("template_id"),
            "matched_institution": tpl.get("institution_name"),
            "layout_similarity_score": similarity_score,
            "matched_regions_count": matched_count,
            "total_expected_regions": total_exp,
            "displaced_regions": displaced_regions,
            "missing_regions": missing_regions,
            "status": "layout_conforms" if similarity_score >= 0.75 else "layout_divergence_detected",
            "explanation": (
                f"Document spatial geometry conforms with registered reference layout ({int(similarity_score * 100)}% match)."
                if similarity_score >= 0.75 else
                f"Layout geometry deviates from authorized reference template ({len(displaced_regions)} displaced sections)."
            )
        }

    def _calculate_iou(self, b1: Dict[str, int], b2: Dict[str, int]) -> float:
        x1 = max(b1["x"], b2["x"])
        y1 = max(b1["y"], b2["y"])
        x2 = min(b1["x"] + b1["width"], b2["x"] + b2["width"])
        y2 = min(b1["y"] + b1["height"], b2["y"] + b2["height"])

        w = max(0, x2 - x1)
        h = max(0, y2 - y1)
        inter = w * h

        area1 = b1["width"] * b1["height"]
        area2 = b2["width"] * b2["height"]
        union = area1 + area2 - inter

        return float(inter / union) if union > 0 else 0.0

    def _template_unavailable_response(self, explanation: str) -> Dict[str, Any]:
        return {
            "template_available": False,
            "template_id": None,
            "matched_institution": None,
            "layout_similarity_score": None,
            "matched_regions_count": 0,
            "total_expected_regions": 0,
            "displaced_regions": [],
            "missing_regions": [],
            "status": "template_not_found",
            "explanation": explanation
        }

    def _seed_reference_templates(self):
        """Pre-seeds official templates for Stanford University & MIT Degree layouts."""
        self.register_template(
            institution_name="Stanford University",
            category="Degree Certificate",
            expected_regions=[
                {"region_name": "header_crest", "normalized_bbox": {"x": 0.40, "y": 0.08, "w": 0.20, "h": 0.12}},
                {"region_name": "university_title", "normalized_bbox": {"x": 0.20, "y": 0.22, "w": 0.60, "h": 0.06}},
                {"region_name": "recipient_name", "normalized_bbox": {"x": 0.25, "y": 0.38, "w": 0.50, "h": 0.08}},
                {"region_name": "degree_conferral", "normalized_bbox": {"x": 0.20, "y": 0.50, "w": 0.60, "h": 0.10}},
                {"region_name": "seal_bottom_left", "normalized_bbox": {"x": 0.10, "y": 0.75, "w": 0.18, "h": 0.18}},
                {"region_name": "signature_bottom_right", "normalized_bbox": {"x": 0.65, "y": 0.80, "w": 0.25, "h": 0.10}}
            ],
            template_id="tpl_stanford_deg_01"
        )


# Global singleton
template_analysis_service = TemplateAnalysisService()
