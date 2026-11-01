# TrustChain AI — Explainable AI (XAI) & Visual Evidence

## 1. Principles of Explainable Document Intelligence
TrustChain AI adheres to transparent, interpretable AI standards:
- **No Unexplained Numbers**: Risk scores are accompanied by a multi-modal component breakdown showing exact point contributions.
- **Visual Spatial Grounding**: Detected anomalies (such as compression splices, inverted dates, or unaccredited text) link directly to physical bounding box coordinates on the document canvas.
- **Feature Contribution Attribution**: For ML anomalies, the platform ranks features by importance and explains the observed value versus expected baseline.

---

## 2. Visual Evidence Layering

The Verification Workspace provides three toggleable visual overlays:

1. **OCR Text Box Overlay**:
   - Renders bounding boxes around recognized text lines.
   - Tooltips display optical character confidence levels.
2. **Tamper & Anomaly Regions**:
   - Color-coded bounding boxes:
     - 🔴 **Critical/High**: Spliced dates, mathematical inconsistencies.
     - 🟡 **Medium/Low**: Softness, minor kerning deviations.
     - 🟢 **Positive Signals**: Verified institutional crests, embossed seals, and signature strokes.
3. **Error Level Analysis (ELA) Heatmap**:
   - Displays amplified JPEG compression differential images.
   - Highlights areas with conflicting compression histories.

---

## 3. Finding Structure Specification

```json
{
  "id": "find_RULE_PERCENTAGE_MATH_MISMATCH",
  "category": "Cross-Field Consistency",
  "severity": "high",
  "title": "Percentage must equal (Obtained / Maximum) * 100",
  "description": "Reported percentage diverges from mathematical marks ratio by 18.00%.",
  "observed_value": "Reported: 98.0%, Calculated: 80.00%",
  "evidence_source": "Arithmetic recalculation",
  "recommended_action": "Verify grade transcript against university grading scale.",
  "confidence": 0.95
}
```
