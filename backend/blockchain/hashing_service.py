import hashlib
from typing import Tuple


class DocumentHashingService:
    """
    Cryptographic document hashing service for TrustChain AI.
    Strictly hashes raw document bytes (never extracted OCR text) using SHA-256.
    """

    @staticmethod
    def compute_sha256(content_bytes: bytes) -> str:
        """
        Computes standard hexadecimal SHA-256 hash.
        """
        if not content_bytes:
            raise ValueError("Document content bytes cannot be empty.")
        return hashlib.sha256(content_bytes).hexdigest()

    @staticmethod
    def compute_bytes32_hash(content_bytes: bytes) -> bytes:
        """
        Computes raw 32-byte hash for EVM bytes32 compatibility.
        """
        if not content_bytes:
            raise ValueError("Document content bytes cannot be empty.")
        return hashlib.sha256(content_bytes).digest()

    @staticmethod
    def hex_to_bytes32(hex_hash: str) -> bytes:
        """
        Converts a 64-char hex string (with or without 0x prefix) to 32 bytes.
        """
        clean_hex = hex_hash.lower().replace("0x", "")
        if len(clean_hex) != 64:
            raise ValueError(f"Invalid SHA-256 hex length: {len(clean_hex)} (must be 64 characters).")
        return bytes.fromhex(clean_hex)

    @staticmethod
    def verify_hash_match(content_bytes: bytes, registered_hash: str) -> Tuple[bool, str]:
        """
        Computes hash and compares against registered fingerprint.
        Returns (is_match, computed_hash).
        """
        computed = DocumentHashingService.compute_sha256(content_bytes)
        clean_reg = registered_hash.lower().replace("0x", "")
        clean_comp = computed.lower().replace("0x", "")
        return (clean_comp == clean_reg, computed)


hashing_service = DocumentHashingService()
