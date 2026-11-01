from typing import Dict, Any, Optional
from blockchain.contract_service import contract_service
from blockchain.hashing_service import hashing_service
from blockchain.qr_service import qr_service


class BlockchainService:
    """
    Unified Blockchain Service for TrustChain AI.
    Handles cryptographic SHA-256 document hashing, smart contract credential anchoring,
    and blockchain verification status checking.
    """

    @property
    def is_connected(self) -> bool:
        return contract_service.is_connected

    def get_status(self) -> Dict[str, Any]:
        return contract_service.get_status()

    def compute_sha256_hash(self, file_content: bytes) -> str:
        """
        Cryptographic document fingerprint for on-chain anchoring.
        Strictly hashes raw bytes.
        """
        return hashing_service.compute_sha256(file_content)

    async def anchor_document_hash(
        self,
        doc_id: str,
        doc_hash: str,
        credential_id: Optional[str] = None,
        credential_type: str = "academic_certificate"
    ) -> Dict[str, Any]:
        """
        Registers cryptographic document hash to the TrustChainCredentialRegistry smart contract.
        """
        cid = credential_id or f"TC-CRED-{doc_id[:8].upper()}"
        res = contract_service.register_credential(
            credential_id=cid,
            document_hash=doc_hash,
            credential_type=credential_type
        )
        if res.get("success"):
            cred = res["credential"]
            qr_payload = qr_service.generate_credential_qr_payload(cid)
            return {
                "status": "anchored",
                "credential_id": cid,
                "tx_hash": cred.get("transaction_hash"),
                "contract_address": contract_service.contract_address,
                "block_number": cred.get("block_number"),
                "network": cred.get("network"),
                "verification_url": qr_payload.get("verification_url"),
                "qr_image_data_uri": qr_payload.get("qr_image_data_uri"),
                "message": "Cryptographic document hash registered on blockchain registry."
            }
        else:
            return {
                "status": "registration_failed",
                "error": res.get("error", "Unknown blockchain error"),
                "tx_hash": None,
                "contract_address": contract_service.contract_address
            }

    async def verify_on_chain(self, doc_hash: str) -> Dict[str, Any]:
        """
        Queries smart contract registry for document hash match.
        """
        res = contract_service.verify_by_hash(doc_hash)
        return {
            "verified": res.get("verified", False),
            "status": res.get("status", "Unregistered"),
            "credential_id": res.get("credential_id"),
            "issuer": res.get("issuer"),
            "issue_timestamp": res.get("issue_timestamp"),
            "credential_type": res.get("credential_type"),
            "message": res.get("message", "")
        }


blockchain_service = BlockchainService()
