import hashlib
import json
from typing import Dict, Any, Tuple


class ReportIntegrityService:
    """
    Computes and cryptographically verifies the SHA-256 digital integrity checksum
    of TrustChain AI verification reports.
    """

    @staticmethod
    def canonicalize(data: Dict[str, Any]) -> str:
        """
        Produces a deterministic, canonical JSON representation
        (sorted keys, no extraneous whitespace).
        """
        # Create a copy excluding mutable runtime fields like integrity_hash itself
        cleaned = {k: v for k, v in data.items() if k not in ["integrity_hash", "last_accessed_at"]}
        return json.dumps(cleaned, sort_keys=True, separators=(",", ":"), default=str)

    @classmethod
    def compute_hash(cls, report_data: Dict[str, Any]) -> str:
        """
        Computes the standard SHA-256 cryptographic digest of a report.
        """
        canonical_str = cls.canonicalize(report_data)
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    @classmethod
    def verify_integrity(cls, report_data: Dict[str, Any], recorded_hash: str) -> Tuple[bool, str]:
        """
        Verifies whether report data has been tampered with since generation.
        Returns (is_valid, current_hash).
        """
        current_hash = cls.compute_hash(report_data)
        return (current_hash == recorded_hash, current_hash)


report_integrity_service = ReportIntegrityService()

