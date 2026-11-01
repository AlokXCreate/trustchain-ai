"""
TrustChain AI - QR Code & Barcode Detection Service
Detects 2D codes, extracts credentials/URLs, identifies suspicious payloads,
and prepares interfaces for blockchain smart contract verification.
Does NOT blindly trust arbitrary external URLs.
"""

import re
import urllib.parse
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
import cv2


class QRDetectionService:
    """
    Detects and validates QR codes and barcodes within document images.
    Implements security guardrails against phishing, malicious payloads, and spoofed URLs.
    """

    TRUSTED_DOMAINS = [
        "trustchain.network",
        "verify.trustchain.io",
        "stanford.edu",
        "mit.edu",
        "cam.ac.uk",
        "ox.ac.uk",
        "harvard.edu",
        "ethz.ch",
        "iitb.ac.in",
        "delhi.edu",
        "gov.in"
    ]

    def __init__(self):
        self._qr_detector = cv2.QRCodeDetector()

    def detect_qr(self, image_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Detects, localizes, decodes, and analyzes QR codes from an image.
        """
        if image_bgr is None or len(image_bgr.shape) < 2:
            return self._empty_result()

        try:
            # OpenCV QRCodeDetector
            decoded_text, points, _ = self._qr_detector.detectAndDecode(image_bgr)

            if not decoded_text and points is None:
                # Try with grayscale and thresholded image
                gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY) if len(image_bgr.shape) == 3 else image_bgr
                _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                decoded_text, points, _ = self._qr_detector.detectAndDecode(thresh)

            if decoded_text and points is not None:
                box = self._extract_bounding_box(points)
                return self._analyze_payload(decoded_text, box)

            # Barcode fallback / contour detection for potential barcode strip
            barcode_found, barcode_box = self._detect_potential_barcode(image_bgr)
            if barcode_found:
                return {
                    "qr_detected": False,
                    "barcode_detected": True,
                    "qr_content": None,
                    "qr_bounding_box": barcode_box,
                    "decoded_url": None,
                    "certificate_identifier": None,
                    "validation_status": "linear_barcode_present",
                    "is_trusted_domain": False,
                    "risk_notes": ["Linear 1D barcode region localized. Payload requires standard laser scanner."]
                }

        except Exception as e:
            return {
                "qr_detected": False,
                "barcode_detected": False,
                "qr_content": None,
                "qr_bounding_box": None,
                "decoded_url": None,
                "certificate_identifier": None,
                "validation_status": "detection_error",
                "is_trusted_domain": False,
                "risk_notes": [f"QR detector encountered non-fatal error: {str(e)}"]
            }

        return self._empty_result()

    def _analyze_payload(self, payload: str, bounding_box: Optional[Dict[str, int]]) -> Dict[str, Any]:
        """
        Inspects decoded QR payload string for URLs, credential IDs, or suspicious vectors.
        """
        risk_notes = []
        is_url = bool(re.match(r"^https?://", payload.strip(), re.IGNORECASE))
        decoded_url = payload.strip() if is_url else None
        cert_id = None
        is_trusted = False
        validation_status = "payload_extracted"

        if is_url:
            parsed = urllib.parse.urlparse(decoded_url)
            domain = parsed.netloc.lower()

            # Check if domain matches trusted accreditation list
            for trusted in self.TRUSTED_DOMAINS:
                if domain == trusted or domain.endswith("." + trusted):
                    is_trusted = True
                    break

            if is_trusted:
                validation_status = "trusted_institutional_url"
                risk_notes.append(f"QR encodes verified accreditation portal URL: {domain}")
            else:
                validation_status = "untrusted_external_url"
                risk_notes.append(
                    f"QR points to external third-party domain '{domain}'. "
                    "TrustChain AI does not blindly follow or trust external URLs without manual review."
                )

            # Check for credential ID query parameters
            query_params = urllib.parse.parse_qs(parsed.query)
            for key in ["cert_id", "credential_id", "id", "hash", "code", "ref"]:
                if key in query_params and query_params[key]:
                    cert_id = query_params[key][0]
                    break

            # Check for suspicious url patterns (IP address URLs, URL shorteners)
            if re.match(r"^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+", domain) or "bit.ly" in domain or "tinyurl" in domain:
                validation_status = "suspicious_url_redirect"
                risk_notes.append("Potentially suspicious QR URL (IP host or URL shortener). Exercise caution.")

        else:
            # Check if payload is directly a certificate or blockchain hash identifier
            if re.match(r"^0x[a-fA-F0-9]{40,64}$", payload):
                cert_id = payload
                validation_status = "blockchain_cryptographic_hash"
                risk_notes.append("QR payload contains valid Ethereum/EVM cryptographic transaction or hash.")
            elif re.match(r"^[A-Z0-9\-\/]{6,30}$", payload):
                cert_id = payload
                validation_status = "direct_credential_identifier"
                risk_notes.append(f"QR payload encodes direct credential reference: {cert_id}")
            else:
                validation_status = "raw_text_payload"
                risk_notes.append("QR contains arbitrary text payload.")

        return {
            "qr_detected": True,
            "barcode_detected": False,
            "qr_content": payload[:250],  # truncated for safety
            "qr_bounding_box": bounding_box,
            "decoded_url": decoded_url,
            "certificate_identifier": cert_id,
            "validation_status": validation_status,
            "is_trusted_domain": is_trusted,
            "risk_notes": risk_notes
        }

    def _extract_bounding_box(self, points: np.ndarray) -> Optional[Dict[str, int]]:
        try:
            pts = points.reshape(-1, 2)
            xs = pts[:, 0]
            ys = pts[:, 1]
            x_min = int(np.min(xs))
            y_min = int(np.min(ys))
            x_max = int(np.max(xs))
            y_max = int(np.max(ys))
            return {
                "x": max(0, x_min),
                "y": max(0, y_min),
                "width": max(10, x_max - x_min),
                "height": max(10, y_max - y_min)
            }
        except Exception:
            return None

    def _detect_potential_barcode(self, image_bgr: np.ndarray) -> Tuple[bool, Optional[Dict[str, int]]]:
        """Heuristic computer vision detection of 1D horizontal barcode stripes."""
        try:
            gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY) if len(image_bgr.shape) == 3 else image_bgr
            grad_x = cv2.Sobel(gray, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
            grad_y = cv2.Sobel(gray, ddepth=cv2.CV_32F, dx=0, dy=1, ksize=-1)
            gradient = cv2.subtract(grad_x, grad_y)
            gradient = cv2.convertScaleAbs(gradient)

            blurred = cv2.blur(gradient, (9, 9))
            _, thresh = cv2.threshold(blurred, 225, 255, cv2.THRESH_BINARY)
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21, 7))
            closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

            contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for c in contours:
                x, y, w, h = cv2.boundingRect(c)
                aspect = w / max(1, h)
                if aspect > 2.0 and w > 80 and h > 20 and w < image_bgr.shape[1] * 0.8:
                    return True, {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
        except Exception:
            pass
        return False, None

    def _empty_result(self) -> Dict[str, Any]:
        return {
            "qr_detected": False,
            "barcode_detected": False,
            "qr_content": None,
            "qr_bounding_box": None,
            "decoded_url": None,
            "certificate_identifier": None,
            "validation_status": "none",
            "is_trusted_domain": False,
            "risk_notes": ["No optical 2D QR code or 1D barcode detected on document."]
        }


# Global singleton
qr_detection_service = QRDetectionService()
