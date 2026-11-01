# TrustChain AI — Dataset Strategy & Synthetic Benchmark Generation

## 1. Ethical & Responsible Data Sourcing
Real academic certificates contain sensitive Personally Identifiable Information (PII) including student names, birthdates, registration IDs, and exam marks. 

**Core Rules:**
- Never scrape, store, or train on private user certificates without explicit legal institutional consent.
- Generic public document datasets (such as RVL-CDIP, Tobacco3482, FUNSD, and SROIE) are useful for OCR benchmarking, but do not contain verified academic certificate alterations.
- Therefore, TrustChain AI implements a controlled, reproducible **Synthetic Dataset Generator** (`backend/ml/datasets/synthetic_generator.py`).

---

## 2. Synthetic Dataset Generation Strategy

The synthetic generator creates paired sets of legitimate credentials and controlled alterations:

### A. Legitimate Baseline (Label = 0)
- Structurally valid academic degrees, marks transcripts, internships, and experience letters.
- Verified chronological sequencing (Issue year >= Graduation year).
- Mathematical integrity: $\text{Percentage} = \frac{\text{Obtained Marks}}{\text{Maximum Marks}} \times 100$.
- Standard Gaussian noise and contrast distributions.

### B. Controlled Alterations (Label = 1)
Controlled physical and semantic modifications:
1. **Date Inversions**: Issue date chronologically precedes graduation date.
2. **Marks Calculation Tampering**: Student marks do not match reported percentage.
3. **Splice & Compression Patches**: Induces localized Error Level Analysis (ELA) compression variance.
4. **Font / Resolution Inconsistency**: Local blur patches representing altered names or grades.
5. **Identifier Syntax Violations**: Invalid credential ID formats.

---

## 3. Continuous Improvement & User Feedback Loop
- User OCR corrections and finding verifications are stored separately in `_feedback_store` via `POST /api/v1/ai/feedback/{report_id}`.
- User feedback is never automatically fed into retraining without institutional human-in-the-loop review.
