import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.models.entities import ChatMessage


class AssistantService:
    def __init__(self):
        self._conversations: Dict[str, List[ChatMessage]] = {}
        self._seed_demo_conversation()

    def get_conversation(self, conversation_id: str) -> List[ChatMessage]:
        return self._conversations.get(conversation_id, [])

    async def send_message(self, conversation_id: Optional[str], message_text: str) -> ChatMessage:
        if not conversation_id or conversation_id not in self._conversations:
            conversation_id = f"conv_{uuid.uuid4().hex[:8]}"
            self._conversations[conversation_id] = []

        now = datetime.utcnow()
        user_msg = ChatMessage(
            id=f"msg_{uuid.uuid4().hex[:8]}",
            conversation_id=conversation_id,
            sender="user",
            content=message_text,
            timestamp=now
        )
        self._conversations[conversation_id].append(user_msg)

        # Generate intelligent contextual domain response
        reply_content, sources = self._generate_assistant_reply(message_text)

        assistant_msg = ChatMessage(
            id=f"msg_{uuid.uuid4().hex[:8]}",
            conversation_id=conversation_id,
            sender="assistant",
            content=reply_content,
            sources=sources,
            timestamp=datetime.utcnow()
        )
        self._conversations[conversation_id].append(assistant_msg)
        return assistant_msg

    def _generate_assistant_reply(self, query: str) -> tuple[str, List[str]]:
        q = query.lower()
        if "academic" in q or "degree" in q or "verify" in q and "certificate" in q:
            return (
                "### How Academic Certificate Verification Works in TrustChain AI\n\n"
                "TrustChain AI verifies academic credentials through a multi-layered authentication framework:\n\n"
                "1. **Cryptographic Integrity (Hash Matching):** Computes the SHA-256 fingerprint of the uploaded credential to check for pixel or content alterations.\n"
                "2. **Optical Character Recognition (OCR):** Extracts student identification, conferral dates, majors, and institutional seal coordinates.\n"
                "3. **Institutional Registry Validation:** Matches the declared issuing university against the **TrustChain Verified Issuer Registry** to confirm accreditation status and authorized signatory keys.\n"
                "4. **Computer Vision Anomaly Detection:** Analyzes typography uniformity, baseline text alignment, digital micro-printing, and watermark consistency.\n"
                "5. **Blockchain Anchor Verification (Sepolia):** Validates whether the issuing registrar committed an immutable credential proof hash onto the distributed ledger.",
                ["TrustChain Verification Protocol v1.4", "W3C Verifiable Credentials Standard", "UNESCO Global Academic Recognition Guidelines"]
            )
        elif "manipulation" in q or "fraud" in q or "tamper" in q:
            return (
                "### Common Signs of Digital Document Tampering\n\n"
                "When analyzing suspicious certificates and marksheets, our automated vision pipeline looks for several telltale fraud indicators:\n\n"
                "- **Font Glyph Mismatches:** Cloned or modified text often uses a slightly different font family, kerning, or anti-aliasing profile compared to original vector text.\n"
                "- **JPEG Compression Artifact Inconsistencies:** Areas edited in software like Photoshop exhibit localized Error Level Analysis (ELA) discrepancies.\n"
                "- **Misaligned University Seals:** Stamp emblems or gold foils pasted over forged signatures frequently leave bounding box clipping borders.\n"
                "- **Unaccredited Issuer Domains:** Phishing registries that emulate legitimate university names with deceptive TLDs (e.g., `.net` or `.org` instead of `.edu`).\n"
                "- **Missing Hash Signatures:** Authentic digital certificates embed verifiable QR codes referencing immutable public ledger transactions.",
                ["ISO 27001 Information Security Guidelines", "Computer Vision Forensic Analysis (ELA)", "TrustChain Fraud Detection Engine"]
            )
        elif "blockchain" in q:
            return (
                "### How Blockchain Credential Verification Works\n\n"
                "Blockchain creates an immutable, tamper-evident audit layer for credentials without exposing private student records:\n\n"
                "- **Zero-Knowledge Privacy:** Only the cryptographic hash of the certificate (and not personal identifying information) is committed to the blockchain smart contract.\n"
                "- **Issuer Identity Proof:** Transactions must be signed by the private key belonging to an accredited, approved institution registered in the TrustChain contract.\n"
                "- **Instant Verification:** Any verifier or employer can recompute the document's hash and query the Ethereum Sepolia contract in milliseconds.\n"
                "- **Revocation Transparency:** If a credential is ever revoked due to academic misconduct or administrative error, the status updates instantaneously across the network.",
                ["Ethereum Sepolia Testnet Specifications", "Solidity Smart Contract v1.0", "Decentralized Identifiers (DIDs) Architecture"]
            )
        elif "internship" in q or "experience" in q:
            return (
                "### Key Elements of an Authentic Internship or Experience Letter\n\n"
                "A genuine corporate credential or experience certificate should feature:\n\n"
                "1. Official corporate letterhead and registered corporate domain.\n"
                "2. Authorized signatory details (HR Director or Department Lead with verifiable LinkedIn or corporate email).\n"
                "3. Explicit dates of tenure, role designation, and primary responsibilities.\n"
                "4. Unique certificate or reference index tracking number.\n"
                "5. Digital signature or TrustChain verifiable QR badge.",
                ["Corporate HR Verification Standards", "TrustChain Industry Credential Framework"]
            )
        else:
            return (
                f"### TrustChain AI Document Intelligence\n\n"
                f"Thank you for your question regarding **\"{query}\"**.\n\n"
                "TrustChain AI is equipped to assist you with document verification, institutional registry policies, tamper detection methodologies, and digital credential management.\n\n"
                "You can ask me to analyze specific verification findings, inspect risk flags, explain cryptographic hashes, or guide you through bulk HR verification workflows.",
                ["TrustChain AI Knowledge Base v1.0"]
            )

    def _seed_demo_conversation(self):
        conv_id = "conv_demo_01"
        self._conversations[conv_id] = [
            ChatMessage(
                id="msg_init_01",
                conversation_id=conv_id,
                sender="assistant",
                content="Hello! I am your **TrustChain AI Assistant**. How can I help you authenticate documents, understand verification scores, or check credential validity today?",
                sources=["TrustChain AI Platform Core"],
                timestamp=datetime.utcnow()
            )
        ]


assistant_service = AssistantService()
