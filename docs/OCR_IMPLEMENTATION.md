# TrustChain AI — OCR Engine Implementation

## 1. Overview
The OCR engine in `backend/app/services/ai/ocr_service.py` is a modular, high-performance optical character recognition and layout localization service designed for academic transcripts, certificates, and identity documents.

---

## 2. Technical Capabilities

- **Multi-Page Document Processing**: Processes single-page credentials and multi-page PDFs up to 15 pages.
- **Bounding Box Geometry**: Computes bounding boxes `{"x": int, "y": int, "width": int, "height": int}` for each text block.
- **Confidence Scoring**: Calculates confidence levels for individual lines based on character distribution, spelling validity, and geometry aspect ratios.
- **Deterministic In-Memory Caching**: Implements a SHA-256 hashed content cache. If the same document or page is analyzed repeatedly, OCR results are returned instantly from memory without redundant computation.
- **Computer Vision Text Segmentation**: Uses horizontal morphological rectangular kernels `cv2.getStructuringElement(cv2.MORPH_RECT, (w*0.025, h*0.003))` followed by contour analysis to segment connected text blocks and line baselines.

---

## 3. Schema Specification

```json
{
  "document_id": "doc_654b70ce48",
  "total_pages": 1,
  "pages": [
    {
      "page_number": 1,
      "extracted_text": "Stanford University\nDegree of Bachelor of Science...",
      "text_blocks": [
        {
          "id": "block_1_1",
          "text": "Stanford University",
          "confidence": 0.96,
          "bounding_box": {
            "x": 100,
            "y": 140,
            "width": 380,
            "height": 42
          }
        }
      ],
      "block_count": 18
    }
  ],
  "overall_confidence": 0.94
}
```

---

## 4. Integration with Structured Extraction
Extracted OCR text blocks are fed directly into `information_extraction_service.py` to identify:
- Student Name / Holder Identity
- Certificate Serial ID / Enrollment Number
- Issuing Institution & University Senate
- Program, Degree, Course, or Specialization
- Award Dates, Graduation Year, and Convocation Sessions
- Marksheet Marks, Percentages, and Grade Points
