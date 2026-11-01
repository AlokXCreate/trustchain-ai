# TrustChain AI — Explainable Risk Scoring Engine

## 1. Multi-Modal Evidence Aggregation
The Risk Scoring Engine (`backend/app/services/ai/risk_scoring_service.py`) aggregates evidence across six independent verification dimensions:

1. **Cross-Field Mathematical & Chronological Consistency** (Weight: High)
   - Contradictory marks calculations or impossible date sequences.
2. **Image Forensics & Error Level Analysis** (Weight: Moderate)
   - Local compression differences and splice patches.
3. **Machine Learning Anomaly & Outlier Likelihood** (Weight: Moderate)
   - Random Forest probability and Isolation Forest deviation.
4. **Document Metadata & Software Signatures** (Weight: Low-to-Moderate)
   - Discrepant modification dates and graphic editor signatures.
5. **Template & Layout Conformance** (Weight: Low)
   - Layout divergence from registered institutional reference coordinates.
6. **Institutional & Blockchain Verification** (Weight: Strong Reduction)
   - Matched registry records and verified on-chain hashes.

---

## 2. Calibrated Risk Tiers

| Score Range | Category Label | Preliminary Verdict | Recommended Action |
| :--- | :--- | :--- | :--- |
| **0 – 29** | Low Risk Indicators | No significant anomalies detected | Standard processing may proceed |
| **30 – 59** | Moderate Risk Indicators | Additional verification recommended | Perform secondary review of highlighted discrepancies |
| **60 – 79** | Elevated Risk Indicators | Elevated risk indicators detected | Direct verification with issuing university/employer required |
| **80 – 100** | High Risk Indicators | High-risk anomalies detected | Flag for formal compliance review |

---

## 3. Mandatory Institutional Disclaimer
Every score and verification report includes the mandatory disclaimer:

> *"TrustChain AI provides automated document analysis and preliminary risk assessment. Its findings are not definitive proof of authenticity or fraud. Final verification should be conducted by the authorized issuing institution."*
