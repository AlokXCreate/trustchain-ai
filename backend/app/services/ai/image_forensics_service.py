"""
TrustChain AI - Image Forensics & Tampering Analysis Service
Implements Error Level Analysis (ELA), local noise variance, edge consistency,
seal/stamp localization, signature region detection, and transparent limitations.
"""

import base64
import io
from typing import Dict, Any, List, Tuple, Optional
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import cv2


class ImageForensicsService:
    """
    Forensics service identifying visual inconsistencies, compression anomalies,
    stamp/seal presence, and potential tampering patches.
    """

    ELA_QUALITY = 90
    ELA_SCALE = 15

    def analyze_image(self, image_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Runs comprehensive visual forensics pipeline:
        1. Error Level Analysis (ELA)
        2. Local noise variance map
        3. Stamp / Seal detection
        4. Signature stroke localization
        5. Identifies suspicious bounding regions
        """
        if image_bgr is None or len(image_bgr.shape) < 2:
            return self._empty_result()

        h, w = image_bgr.shape[:2]

        # 1. Error Level Analysis (ELA)
        ela_img_bgr, ela_mean, ela_max, ela_b64 = self._perform_ela(image_bgr)
        suspicious_ela_blocks = self._detect_ela_anomalies(ela_img_bgr)

        # 2. Local Noise Inconsistency
        noise_variance, noise_inconsistent = self._analyze_noise_consistency(image_bgr)

        # 3. Seal / Stamp Detection
        seal_detected, seal_regions = self._detect_seals(image_bgr)

        # 4. Signature Region Detection
        sig_detected, sig_regions = self._detect_signatures(image_bgr)

        # Aggregate suspicious regions
        suspicious_regions = []
        for box in suspicious_ela_blocks:
            suspicious_regions.append({
                "type": "compression_anomaly",
                "severity": "medium",
                "bounding_box": box,
                "description": "Local JPEG compression artifact inconsistency (potential patch or splice)."
            })

        tampering_detected = (ela_mean > 18.0) or (len(suspicious_ela_blocks) > 0) or noise_inconsistent

        return {
            "error_level_analysis": {
                "mean_residual": round(ela_mean, 2),
                "max_residual": round(ela_max, 2),
                "inconsistency_detected": bool(ela_mean > 16.0 or len(suspicious_ela_blocks) > 0),
                "ela_preview_base64": ela_b64
            },
            "noise_analysis": {
                "noise_variance_across_grid": round(noise_variance, 2),
                "noise_inconsistency_detected": noise_inconsistent
            },
            "seal_detection": {
                "seal_detected": seal_detected,
                "count": len(seal_regions),
                "regions": seal_regions
            },
            "signature_detection": {
                "signature_detected": sig_detected,
                "count": len(sig_regions),
                "regions": sig_regions
            },
            "suspicious_regions": suspicious_regions,
            "overall_visual_tamper_flag": tampering_detected,
            "limitations": [
                "Error Level Analysis (ELA) highlights compression differentials; it is not definitive proof of malicious forgery.",
                "Legitimate documents re-saved across different scanners naturally exhibit varying noise levels.",
                "Signature presence detection localizes pen strokes but cannot verify legal signatory identity."
            ]
        }

    def _perform_ela(self, image_bgr: np.ndarray) -> Tuple[np.ndarray, float, float, str]:
        """
        Computes Error Level Analysis by resaving at standard JPEG quality and
        calculating amplified absolute difference.
        """
        try:
            pil_orig = Image.fromarray(cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB))
            
            # Save to in-memory buffer at 90% quality
            buffer = io.BytesIO()
            pil_orig.save(buffer, "JPEG", quality=self.ELA_QUALITY)
            buffer.seek(0)
            pil_resaved = Image.open(buffer)

            # Difference
            diff = ImageChops.difference(pil_orig, pil_resaved)
            
            # Extrema to evaluate max residual
            extrema = diff.getextrema()
            max_diff = max([ex[1] for ex in extrema])
            if max_diff == 0:
                max_diff = 1

            # Amplify for human and algorithmic visibility
            scale = 255.0 / max_diff
            diff_amplified = ImageEnhance.Brightness(diff).enhance(scale * 0.75)

            diff_np = np.array(diff)
            mean_diff = float(np.mean(diff_np))
            max_residual = float(np.max(diff_np))

            # Encode amplified diff image as base64 JPEG preview
            preview_buf = io.BytesIO()
            diff_amplified.save(preview_buf, "JPEG", quality=85)
            preview_b64 = "data:image/jpeg;base64," + base64.b64encode(preview_buf.getvalue()).decode("utf-8")

            diff_bgr = cv2.cvtColor(np.array(diff_amplified), cv2.COLOR_RGB2BGR)
            return diff_bgr, mean_diff, max_residual, preview_b64

        except Exception:
            return np.zeros_like(image_bgr), 0.0, 0.0, ""

    def _detect_ela_anomalies(self, ela_bgr: np.ndarray) -> List[Dict[str, int]]:
        """Identifies isolated patches that have significantly higher ELA residuals than background."""
        try:
            gray = cv2.cvtColor(ela_bgr, cv2.COLOR_BGR2GRAY)
            mean_val = np.mean(gray)
            std_val = np.std(gray)
            threshold_val = mean_val + (2.5 * std_val)

            _, thresh = cv2.threshold(gray, min(240, int(threshold_val)), 255, cv2.THRESH_BINARY)
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
            dilated = cv2.dilate(thresh, kernel, iterations=2)

            contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            suspicious_boxes = []

            h, w = ela_bgr.shape[:2]
            for cnt in contours:
                x, y, bw, bh = cv2.boundingRect(cnt)
                area = bw * bh
                # Filter small noise and full canvas
                if 800 < area < (h * w * 0.15) and bw > 30 and bh > 20:
                    suspicious_boxes.append({
                        "x": int(x),
                        "y": int(y),
                        "width": int(bw),
                        "height": int(bh)
                    })

            return suspicious_boxes[:5]  # top 5 anomalous regions
        except Exception:
            return []

    def _analyze_noise_consistency(self, image_bgr: np.ndarray) -> Tuple[float, bool]:
        """
        Divides document into 4x4 spatial grid and measures Laplacian variance uniformity.
        """
        try:
            gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY) if len(image_bgr.shape) == 3 else image_bgr
            h, w = gray.shape[:2]
            grid_rows, grid_cols = 4, 4
            cell_h, cell_w = h // grid_rows, w // grid_cols

            variances = []
            for r in range(grid_rows):
                for c in range(grid_cols):
                    cell = gray[r * cell_h:(r + 1) * cell_h, c * cell_w:(c + 1) * cell_w]
                    # Compute Laplacian variance
                    v = float(cv2.Laplacian(cell, cv2.CV_64F).var())
                    variances.append(v)

            var_of_vars = float(np.std(variances))
            # If standard deviation of noise across document is unusually high, flag inconsistency
            is_inconsistent = var_of_vars > 180.0
            return var_of_vars, is_inconsistent
        except Exception:
            return 0.0, False

    def _detect_seals(self, image_bgr: np.ndarray) -> Tuple[bool, List[Dict[str, Any]]]:
        """
        Detects circular stamps or color-tinted institutional seals (red/blue/gold).
        """
        seals = []
        try:
            # 1. Color mask for red/blue stamp ink
            hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
            # Red mask (wraps around hue)
            lower_red1 = np.array([0, 70, 50])
            upper_red1 = np.array([10, 255, 255])
            lower_red2 = np.array([170, 70, 50])
            upper_red2 = np.array([180, 255, 255])
            mask_r1 = cv2.inRange(hsv, lower_red1, upper_red1)
            mask_r2 = cv2.inRange(hsv, lower_red2, upper_red2)
            # Blue ink mask
            lower_blue = np.array([100, 70, 50])
            upper_blue = np.array([130, 255, 255])
            mask_b = cv2.inRange(hsv, lower_blue, upper_blue)

            combined_ink = mask_r1 | mask_r2 | mask_b
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
            closed = cv2.morphologyEx(combined_ink, cv2.MORPH_CLOSE, kernel)

            contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            h, w = image_bgr.shape[:2]

            for cnt in contours:
                x, y, bw, bh = cv2.boundingRect(cnt)
                area = bw * bh
                aspect = bw / max(1, bh)
                if 1200 < area < (h * w * 0.12) and 0.7 <= aspect <= 1.4:
                    seals.append({
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(bw), "height": int(bh)},
                        "type": "ink_seal_or_stamp",
                        "confidence": 0.88
                    })

            # 2. Hough Circles detection for embossed or grayscale round seals
            if not seals:
                gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
                blurred = cv2.medianBlur(gray, 5)
                circles = cv2.HoughCircles(
                    blurred,
                    cv2.HOUGH_GRADIENT,
                    dp=1.2,
                    minDist=int(h * 0.2),
                    param1=100,
                    param2=45,
                    minRadius=int(min(h, w) * 0.04),
                    maxRadius=int(min(h, w) * 0.15)
                )
                if circles is not None:
                    circles = np.uint16(np.around(circles))
                    for c in circles[0, :3]:
                        cx, cy, r = int(c[0]), int(c[1]), int(c[2])
                        seals.append({
                            "bounding_box": {
                                "x": max(0, cx - r),
                                "y": max(0, cy - r),
                                "width": r * 2,
                                "height": r * 2
                            },
                            "type": "circular_embossed_seal",
                            "confidence": 0.82
                        })

        except Exception:
            pass

        return bool(len(seals) > 0), seals

    def _detect_signatures(self, image_bgr: np.ndarray) -> Tuple[bool, List[Dict[str, Any]]]:
        """
        Detects cursive handwriting strokes characteristic of authorized signatures.
        """
        signatures = []
        try:
            gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY) if len(image_bgr.shape) == 3 else image_bgr
            h, w = gray.shape[:2]

            # Signatures typically appear in bottom 40% of certificates
            bottom_roi = gray[int(h * 0.60):h, :]
            _, thresh = cv2.threshold(bottom_roi, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

            # Cursive strokes have connected thin components
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 2))
            dilated = cv2.dilate(thresh, kernel, iterations=1)

            contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for cnt in contours:
                x, y, bw, bh = cv2.boundingRect(cnt)
                aspect = bw / max(1, bh)
                # Signature aspect ratio is typically wide (1.5 - 5.0) with moderate size
                if 1.5 < aspect < 6.0 and 80 < bw < (w * 0.35) and 25 < bh < (h * 0.12):
                    signatures.append({
                        "bounding_box": {
                            "x": int(x),
                            "y": int(y + int(h * 0.60)),
                            "width": int(bw),
                            "height": int(bh)
                        },
                        "type": "signature_stroke_region",
                        "confidence": 0.85
                    })

        except Exception:
            pass

        return bool(len(signatures) > 0), signatures[:3]

    def _empty_result(self) -> Dict[str, Any]:
        return {
            "error_level_analysis": {"mean_residual": 0.0, "max_residual": 0.0, "inconsistency_detected": False, "ela_preview_base64": ""},
            "noise_analysis": {"noise_variance_across_grid": 0.0, "noise_inconsistency_detected": False},
            "seal_detection": {"seal_detected": False, "count": 0, "regions": []},
            "signature_detection": {"signature_detected": False, "count": 0, "regions": []},
            "suspicious_regions": [],
            "overall_visual_tamper_flag": False,
            "limitations": ["Image forensic evaluation could not be completed on empty input."]
        }


# Global singleton
image_forensics_service = ImageForensicsService()
