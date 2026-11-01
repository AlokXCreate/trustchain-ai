
"""
TrustChain AI - Document Type Classification Service
Hybrid classifier utilizing OCR text semantics, domain keyword heuristics,
and trained TF-IDF machine learning models.
"""

import os
import re
from typing import Dict, Any, List, Optional
import joblib


class DocumentClassificationService:
    """
    Classifies documents into:
    - Degree Certificate
    - Marksheet / Transcript
    - Internship Certificate
    - Training Certificate
    - Experience Letter
    - Skill Certificate
    - Other
    """

    CATEGORIES = [
        "Degree Certificate",
        "Marksheet / Transcript",
        "Internship Certificate",
        "Training Certificate",
        "Experience Letter",
        "Skill Certificate",
        "Other"
    ]

    KEYWORDS = {
        "Degree Certificate": [
            "degree", "bachelor", "master", "doctor of philosophy", "conferred",
            "chancellor", "vice-chancellor", "convocation", "university", "faculty of",
            "graduated", "academic year", "curriculum", "b.tech", "b.sc", "m.sc"
        ],
        "Marksheet / Transcript": [
            "marksheet", "transcript", "statement of marks", "semester", "grade sheet",
            "credits", "cgpa", "sgpa", "obtained marks", "maximum marks", "subject code",
            "seat no", "prn", "examination held in", "passed"
        ],
        "Internship Certificate": [
            "internship", "intern", "trainee", "project duration", "successfully completed internship",
            "under the guidance", "stipend", "performance during the internship", "mentor"
        ],
        "Experience Letter": [
            "experience letter", "relieving letter", "service certificate", "employment",
            "worked with us", "designation", "last working day", "date of joining",
            "responsibilities", "conduct and character", "relieved from duties"
        ],
        "Training Certificate": [
            "training program", "completed training", "hands-on workshop", "bootcamp",
            "course completion", "professional development", "curriculum covered", "trainer"
        ],
        "Skill Certificate": [
            "skill assessment", "competency", "certification exam", "proficiency in",
            "badge", "certified professional", "accredited skill", "passing score"
        ]
    }

    def __init__(self, model_path: Optional[str] = None):
        self._model = None
        self._vectorizer = None
        self._model_path = model_path or os.path.join(
            os.path.dirname(__file__), "..", "..", "..", "ml", "models", "doc_classifier.joblib"
        )
        self._load_ml_model()

    def _load_ml_model(self):
        """Loads trained TF-IDF + Classifier model if serialized weights exist."""
        try:
            if os.path.exists(self._model_path):
                data = joblib.load(self._model_path)
                self._model = data.get("model")
                self._vectorizer = data.get("vectorizer")
        except Exception:
            self._model = None
            self._vectorizer = None

    def classify(self, text: str, declared_category: Optional[str] = None) -> Dict[str, Any]:
        """
        Runs hybrid classification on extracted OCR text.
        Returns top prediction, confidence, alternatives, and confirmation flag.
        """
        clean_text = text.lower() if text else ""

        # 1. Calculate keyword heuristic scores
        keyword_scores = {cat: 0.05 for cat in self.CATEGORIES}
        total_hits = 0

        for cat, kw_list in self.KEYWORDS.items():
            for kw in kw_list:
                # Count keyword matches
                matches = len(re.findall(r"\b" + re.escape(kw) + r"\b", clean_text))
                if matches > 0:
                    keyword_scores[cat] += matches * 1.5
                    total_hits += matches

        # Normalize keyword scores
        kw_sum = sum(keyword_scores.values())
        if kw_sum > 0:
            for cat in keyword_scores:
                keyword_scores[cat] /= kw_sum

        # 2. ML Model inference if available
        ml_scores = {}
        if self._model is not None and self._vectorizer is not None and clean_text:
            try:
                vec = self._vectorizer.transform([clean_text])
                probs = self._model.predict_proba(vec)[0]
                classes = self._model.classes_
                for idx, c in enumerate(classes):
                    ml_scores[c] = float(probs[idx])
            except Exception:
                ml_scores = {}

        # 3. Hybrid fusion
        final_scores = {}
        for cat in self.CATEGORIES:
            kw_w = 0.55 if ml_scores else 0.90
            ml_w = 0.45 if ml_scores else 0.00
            s = (keyword_scores.get(cat, 0.0) * kw_w) + (ml_scores.get(cat, 0.0) * ml_w)
            
            # Boost if declared by user matches text evidence
            if declared_category and declared_category.lower() in cat.lower() and keyword_scores.get(cat, 0.0) > 0.15:
                s += 0.10

            final_scores[cat] = s

        # Normalize final scores
        tot_s = sum(final_scores.values()) or 1.0
        for cat in final_scores:
            final_scores[cat] = round(final_scores[cat] / tot_s, 3)

        # Sort descending
        sorted_cats = sorted(final_scores.items(), key=lambda item: item[1], reverse=True)
        top_cat, top_conf = sorted_cats[0]

        # Fallback to Other if all scores are very low
        if top_conf < 0.25 and total_hits == 0:
            top_cat = "Other"
            top_conf = 0.40

        alternatives = [
            {"type": c, "confidence": round(p, 3)}
            for c, p in sorted_cats[1:4]
            if p > 0.03
        ]

        return {
            "predicted_type": top_cat,
            "confidence": round(top_conf, 2),
            "alternatives": alternatives,
            "confirmation_required": bool(top_conf < 0.55),
            "model_type": "Hybrid (TF-IDF + Domain Heuristics)" if self._model else "Domain Semantic Heuristics"
        }


# Global singleton
document_classification_service = DocumentClassificationService()
