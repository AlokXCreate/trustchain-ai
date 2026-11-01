import os
import time
import uuid
from typing import List, Dict, Any, Optional
from pathlib import Path

from app.services.rag.chunker import document_chunker
from app.services.rag.vector_store import vector_store


class KnowledgeBaseService:
    """
    Manages trusted institutional verification guidelines, standards, and policies
    for the TrustChain AI Retrieval-Augmented Generation (RAG) system.
    """

    def __init__(self):
        self.sources: Dict[str, Dict[str, Any]] = {}
        self._init_default_institutional_guidelines()

    def _init_default_institutional_guidelines(self):
        """
        Seeds standard official verification protocols from premier academic and regulatory bodies.
        """
        seed_documents = [
            {
                "source_id": "src_stanford_verif_01",
                "title": "Stanford University Degree Verification Policy & Seal Standards",
                "institution": "Stanford University",
                "category": "academic_verification",
                "description": "Official guidelines on Stanford embossed seals, registrar signature verification, degree nomenclature, and diploma security paper.",
                "content": """
Stanford University Degree Verification Policy & Holographic Security Standards.
Section 1: Diploma Architecture & Physical Security.
Official Stanford University diplomas feature a custom heavy parchment stock with an embedded security watermark visible under transmitted light.
The University seal is embossed using a dual-depth die creating high tactile relief. In modern diplomas, an optically variable holographic foil emblem is fused to the bottom-left quadrant.
Unauthorized diplomas frequently exhibit flat foil stamping without genuine microscopic security latent lettering ('STANFORD LELAND JUNIOR UNIVERSITY').

Section 2: Typography & Registrar Endorsement.
The graduate's full legal name is typeset in customized Trajan Roman typeface. Degrees awarded confer specific honors (e.g., 'With Distinction') printed with exact 12-point leading.
All official electronic diplomas (CeDiploma) include a 12-digit certified credential identifier (CED-ID) cryptographically signed with 2048-bit RSA keys.
Registrar signatures must match the official tenure dates of University Registrar Dr. Thomas Black or incumbent registrar officers. A discrepancy in signature tenure constitutes an immediate tamper flag.

Section 3: Verification Procedures.
Any third-party background screening agency must verify the conferred degree through the National Student Clearinghouse or directly through the Stanford Student Services Center.
Degrees issued prior to 2015 must be validated against microfilm archives. When evaluating digital scans, Error Level Analysis (ELA) exceeding 65% in the seal or name region indicates unauthorized raster manipulation.
"""
            },
            {
                "source_id": "src_mit_transcript_02",
                "title": "MIT Academic Transcripts and Security Paper Standards",
                "institution": "Massachusetts Institute of Technology (MIT)",
                "category": "academic_verification",
                "description": "Security paper specifications, void pantographs, microprinting, and Registrar verification protocols for MIT records.",
                "content": """
Massachusetts Institute of Technology (MIT) Academic Records Security Guidelines.
Section 1: Hidden Security Pantograph and Microprint Borders.
Official MIT printed transcripts utilize high-security safety paper containing a concealed 'VOID' pantograph.
When an authentic transcript is scanned or photocopied, the word 'VOID' or 'COPY' appears prominently across the background field due to frequency-modulated half-tone screens.
The outer border of genuine transcripts comprises 0.25-point microprinted text spelling 'MASSACHUSETTS INSTITUTE OF TECHNOLOGY' continuously, legible only under 10x optical magnification.

Section 2: Grade Scale and Course Numbering Conventions.
MIT employs an internal numeric course designation system (e.g., Course 6 for Electrical Engineering & Computer Science, Course 18 for Mathematics).
The grading scale is strictly based on a 5.0 maximum grade point average (GPA), where A=5, B=4, C=3, D=2, and F=0.
Any document purporting to be an official MIT transcript using a 4.0 or 10.0 GPA scale is definitively fraudulent or misclassified.

Section 3: Digital Certification & Blockcerts.
Since 2017, MIT issues official digital credentials anchored on public decentralized blockchain registries via the open-source Blockcerts standard.
A genuine digital credential hash must be cryptographically verifiable against MIT's public issuing keys.
Any digital certificate lacking an on-chain cryptographic anchor or presenting an unverified issuer key cannot be certified as authentic.
"""
            },
            {
                "source_id": "src_cambridge_intl_03",
                "title": "Cambridge Assessment International Education Verification Protocol",
                "institution": "Cambridge Assessment International",
                "category": "examination_verification",
                "description": "Anti-counterfeit features, QR code verification standards, candidate number formatting, and syllabus codes.",
                "content": """
Cambridge Assessment International Education (CAIE) Verification Protocol.
Section 1: UV Luminescent Ink and Watermark Specifications.
Authentic Cambridge certificates incorporate a continuous stepped Cambridge crest watermark across the entire document plane.
Under ultraviolet (UV 365nm) blacklight illumination, the Cambridge coat of arms and designated borders fluoresce with brilliant yellow-green luminescence.
Certificates that fail to fluoresce or reveal uniform synthetic paper whitening agents are counterfeit reproductions.

Section 2: Candidate Identification & Centre Number Serialization.
Every candidate is designated an alphanumeric identifier formatted as Centre Number (5 alphanumeric digits, e.g., 'GB123') followed by Candidate Number (4 numeric digits, e.g., '0042').
The syllabus codes for IGCSE, AS Level, and A Level must conform to standard CAIE four-digit curriculum numbers (e.g., Mathematics 0580, Physics 0625).
Dates of examination are strictly June or November series, with March series exclusively available in designated regional jurisdictions.

Section 3: Online Verification Service (CVS).
Tertiary institutions and employers must verify statement of results directly through the Cambridge Verification Service (CVS) secure online portal.
Physical tampering typically targets candidate grades (altering grade 'C' to 'A*' or 'B').
High-resolution forensic magnification must inspect ink edge absorption: laser printed text superimposed over offset litho security guilloche patterns indicates post-issuance alteration.
"""
            },
            {
                "source_id": "src_regulatory_aicte_04",
                "title": "Government Academic Credential Regulation & Security Norms",
                "institution": "UGC & AICTE Regulatory Authorities",
                "category": "regulatory_guidelines",
                "description": "Standardized marksheet security guidelines, mandatory institutional accreditation, and National Academic Depository (NAD) integration.",
                "content": """
University Grants Commission (UGC) & AICTE National Academic Verification Directives.
Section 1: Mandatory Security Attributes for Higher Education Credentials.
In accordance with UGC notification, all degree certificates and consolidated marksheets issued by accredited universities must feature:
1. Micro-text borders with institution name and year of establishment.
2. Anti-scratch holographic seal affixed with hot-stamping foil.
3. 2D Quick Response (QR) code encoding student PRN, roll number, program of study, and secure verification URL.
4. Invisible ink logo visible under 365nm UV excitation.
5. Unique Serial Number registered in the institutional repository.

Section 2: Accreditation Status and Verification Prerequisite.
Before authenticating an Indian higher education qualification, the verifying entity must confirm that the conferring university is recognized under Section 2(f) and 12(B) of the UGC Act.
Degrees issued by autonomous colleges must bear the endorsement and seal of the affiliated degree-granting state or central university.
Any qualification claiming university status from an unlisted or blacklisted institution is legally void.

Section 3: National Academic Depository (NAD) and Digilocker.
All recognized awards must be lodged on the National Academic Depository (NAD/Digilocker).
Discrepancies between physical certificate metrics (CGPA, marks percentage, passing year) and NAD digital records indicate uncertified document modification.
"""
            },
            {
                "source_id": "src_corporate_internship_05",
                "title": "Corporate Internship & Training Certification Authentication Standards",
                "institution": "Global Tech Industry Verification Consortium",
                "category": "professional_verification",
                "description": "Authentication standards for software engineering internships, authorized signatories, domain email confirmation, and project duration verification.",
                "content": """
Global Technology Consortium Guidelines for Internship and Experience Certificate Verification.
Section 1: Required Metadata Elements for Valid Experience Certificates.
Legitimate corporate internship certificates, experience letters, and training credentials must contain:
1. Candidate Legal Name matching government-issued identification.
2. Exact start date and completion date (minimum duration for accredited university credits is 8 weeks or 300 hours).
3. Specific project role or designation (e.g., 'Full-Stack Software Engineering Intern').
4. Official company registration number (CIN, EIN, or corporate registrar entity code).
5. Authorized signatory name, official title (e.g., Director of Human Resources or Engineering Manager), and official corporate domain email address.

Section 2: Common Fraud Indicators in Technology Experience Credentials.
Analysis of fraudulent internship certificates reveals several recurrent anomalies:
1. Free webmail domains (e.g., @gmail.com, @yahoo.com) listed in place of official corporate domain emails.
2. Inconsistent company logos copied from low-resolution web previews displaying JPEG compression halo artifacts.
3. Fictitious project claims conflicting with actual corporate technology stacks.
4. Digital signatures pasted as raw bitmap images without cryptographic cryptographic timestamping or DocuSign/Adobe Sign envelope metadata.

Section 3: Cross-Verification & Blockchain Anchor Protocol.
Verifiers must confirm corporate existence through official registrar portals (e.g., MCA, SEC EDGAR, Companies House).
Modern enterprises anchor certificate hashes on the TrustChain blockchain registry to provide immutable proof of issuance, date anchoring, and instant fraud resistance.
"""
            }
        ]

        for doc in seed_documents:
            self._ingest_seed_source(doc)

    def _ingest_seed_source(self, doc_data: Dict[str, Any]):
        """Ingests a predefined knowledge base document."""
        source_id = doc_data["source_id"]
        content = doc_data["content"].strip()

        pages = [{"page_number": 1, "text": content}]
        chunks = document_chunker.chunk_document(
            pages=pages,
            source_id=source_id,
            document_title=doc_data["title"],
            institution=doc_data["institution"],
            category=doc_data["category"],
            trust_status="approved"
        )

        vector_store.add_chunks(chunks)

        self.sources[source_id] = {
            "source_id": source_id,
            "title": doc_data["title"],
            "institution": doc_data["institution"],
            "category": doc_data["category"],
            "description": doc_data["description"],
            "trust_status": "approved",
            "chunk_count": len(chunks),
            "created_at": int(time.time()),
            "updated_at": int(time.time()),
            "source_type": "official_guideline"
        }

    def list_sources(self) -> List[Dict[str, Any]]:
        """Returns all registered knowledge base sources."""
        return list(self.sources.values())

    def get_source(self, source_id: str) -> Optional[Dict[str, Any]]:
        """Gets metadata for a specific source."""
        return self.sources.get(source_id)

    def get_source_chunks(self, source_id: str) -> List[Dict[str, Any]]:
        """Returns all chunks belonging to a specific source."""
        return [c for c in vector_store.chunks if c.get("source_id") == source_id]

    def add_custom_source(
        self,
        title: str,
        institution: str,
        category: str,
        description: str,
        file_bytes: bytes,
        filename: str,
        trust_status: str = "approved"
    ) -> Dict[str, Any]:
        """
        Ingests a user-uploaded guideline (PDF or TXT) into the trusted vector knowledge base.
        """
        source_id = f"src_{uuid.uuid4().hex[:10]}"
        pages = document_chunker.extract_text_from_bytes(file_bytes, filename)

        if not pages:
            raise ValueError("Could not extract any readable text from the uploaded document.")

        chunks = document_chunker.chunk_document(
            pages=pages,
            source_id=source_id,
            document_title=title,
            institution=institution,
            category=category,
            trust_status=trust_status
        )

        vector_store.add_chunks(chunks)

        source_record = {
            "source_id": source_id,
            "title": title,
            "institution": institution,
            "category": category,
            "description": description,
            "trust_status": trust_status,
            "chunk_count": len(chunks),
            "filename": filename,
            "file_size_bytes": len(file_bytes),
            "created_at": int(time.time()),
            "updated_at": int(time.time()),
            "source_type": "user_uploaded"
        }

        self.sources[source_id] = source_record
        return source_record

    def delete_source(self, source_id: str) -> bool:
        """Removes a source and all its associated vector chunks."""
        if source_id not in self.sources:
            return False
        vector_store.remove_source_chunks(source_id)
        del self.sources[source_id]
        return True

    def reindex_source(self, source_id: str) -> Optional[Dict[str, Any]]:
        """Re-chunks and re-indexes an existing source."""
        source = self.sources.get(source_id)
        if not source:
            return None
        # Re-index all chunks
        vector_store._rebuild_index()
        source["updated_at"] = int(time.time())
        return source


knowledge_base_service = KnowledgeBaseService()
