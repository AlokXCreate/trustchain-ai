import re
import uuid
from typing import List, Dict, Any, Optional
import pypdf
import io


class DocumentChunker:
    """
    Semantic text extraction, normalization, and window chunking for
    TrustChain AI Knowledge Base documents.
    """

    def __init__(self, chunk_size: int = 650, chunk_overlap: int = 120):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def clean_text(self, text: str) -> str:
        """
        Normalizes whitespace and removes unprintable control characters.
        """
        if not text:
            return ""
        # Normalize newlines and tabs
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        # Replace multiple spaces/tabs with single space
        text = re.sub(r"[ \t]+", " ", text)
        # Collapse excessive newlines
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def extract_text_from_bytes(self, content_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        """
        Extracts text page-by-page from PDF or raw TXT bytes.
        Returns a list of dicts: [{"page_number": int, "text": str}]
        """
        pages = []
        filename_lower = filename.lower()

        if filename_lower.endswith(".pdf") or content_bytes.startswith(b"%PDF"):
            try:
                reader = pypdf.PdfReader(io.BytesIO(content_bytes))
                for page_idx, page in enumerate(reader.pages):
                    page_text = page.extract_text() or ""
                    cleaned = self.clean_text(page_text)
                    if cleaned:
                        pages.append({
                            "page_number": page_idx + 1,
                            "text": cleaned
                        })
            except Exception as e:
                # Fallback to UTF-8 decode
                raw_text = content_bytes.decode("utf-8", errors="ignore")
                cleaned = self.clean_text(raw_text)
                if cleaned:
                    pages.append({"page_number": 1, "text": cleaned})
        else:
            # Plain text document
            raw_text = content_bytes.decode("utf-8", errors="ignore")
            cleaned = self.clean_text(raw_text)
            if cleaned:
                pages.append({"page_number": 1, "text": cleaned})

        return pages

    def chunk_document(
        self,
        pages: List[Dict[str, Any]],
        source_id: str,
        document_title: str,
        institution: str,
        category: str,
        trust_status: str = "approved"
    ) -> List[Dict[str, Any]]:
        """
        Splits extracted pages into overlapping semantic chunks with full provenance metadata.
        """
        chunks = []

        for page_data in pages:
            page_num = page_data.get("page_number", 1)
            text = page_data.get("text", "")
            if not text:
                continue

            # Paragraph-based or window-based chunking
            paragraphs = text.split("\n\n")
            current_chunk = ""

            for p in paragraphs:
                p = p.strip()
                if not p:
                    continue

                if len(current_chunk) + len(p) + 2 <= self.chunk_size:
                    current_chunk = f"{current_chunk}\n\n{p}".strip() if current_chunk else p
                else:
                    if len(current_chunk) >= 80:
                        chunk_id = f"chk_{uuid.uuid4().hex[:12]}"
                        chunks.append({
                            "chunk_id": chunk_id,
                            "source_id": source_id,
                            "document_title": document_title,
                            "institution": institution,
                            "category": category,
                            "page_number": page_num,
                            "trust_status": trust_status,
                            "content": current_chunk
                        })

                    # Start next chunk with overlap if possible
                    if len(p) > self.chunk_size:
                        # Split very long paragraph into sub-slices
                        start = 0
                        while start < len(p):
                            end = start + self.chunk_size
                            sub_text = p[start:end].strip()
                            if len(sub_text) >= 50:
                                chunks.append({
                                    "chunk_id": f"chk_{uuid.uuid4().hex[:12]}",
                                    "source_id": source_id,
                                    "document_title": document_title,
                                    "institution": institution,
                                    "category": category,
                                    "page_number": page_num,
                                    "trust_status": trust_status,
                                    "content": sub_text
                                })
                            start += (self.chunk_size - self.chunk_overlap)
                        current_chunk = ""
                    else:
                        current_chunk = p

            if current_chunk and len(current_chunk) >= 50:
                chunks.append({
                    "chunk_id": f"chk_{uuid.uuid4().hex[:12]}",
                    "source_id": source_id,
                    "document_title": document_title,
                    "institution": institution,
                    "category": category,
                    "page_number": page_num,
                    "trust_status": trust_status,
                    "content": current_chunk
                })

        return chunks


document_chunker = DocumentChunker()
