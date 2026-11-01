import base64
import io
import qrcode
from typing import Dict, Any, Optional


class QRCodeVerificationService:
    """
    Generates privacy-compliant QR codes for digital credential verification.
    QR codes strictly contain public verification URLs or opaque credential IDs,
    with ZERO Personally Identifiable Information (no names, grades, or personal documents).
    """

    def __init__(self, base_url: str = "http://localhost:5173"):
        self.base_url = base_url.rstrip("/")

    def get_verification_url(self, credential_id: str) -> str:
        """
        Builds the public verification URL.
        """
        return f"{self.base_url}/verify/credential/{credential_id}"

    def generate_qr_base64(self, credential_id: str, custom_url: Optional[str] = None) -> str:
        """
        Generates a PNG QR code encoded in Base64 data URI format.
        """
        target_url = custom_url or self.get_verification_url(credential_id)

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=8,
            border=2,
        )
        qr.add_data(target_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"

    def generate_credential_qr_payload(self, credential_id: str) -> Dict[str, Any]:
        """
        Returns full QR data payload including verification URL and data URI image.
        """
        verification_url = self.get_verification_url(credential_id)
        qr_image = self.generate_qr_base64(credential_id, verification_url)
        return {
            "credential_id": credential_id,
            "verification_url": verification_url,
            "qr_image_data_uri": qr_image,
            "privacy_standard": "Zero-PII Encoded (Opaque Public Verification Pointer)"
        }


qr_service = QRCodeVerificationService()
