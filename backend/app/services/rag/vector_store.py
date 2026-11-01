import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class VectorStore:
    """
    High-performance, pure-Python vector store for TrustChain AI RAG pipeline.
    Uses sublinear term frequency weighting and L2-normalized dense embeddings
    with Cosine Similarity retrieval.
    """

    def __init__(self):
        self.chunks: List[Dict[str, Any]] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.matrix = None

    def add_chunks(self, new_chunks: List[Dict[str, Any]]) -> int:
        """
        Adds document chunks to the vector index and re-computes representations.
        """
        valid_chunks = [c for c in new_chunks if c.get("content", "").strip()]
        self.chunks.extend(valid_chunks)
        self._rebuild_index()
        return len(valid_chunks)

    def remove_source_chunks(self, source_id: str) -> int:
        """
        Removes all chunks associated with a specific source ID.
        """
        initial_len = len(self.chunks)
        self.chunks = [c for c in self.chunks if c.get("source_id") != source_id]
        removed_count = initial_len - len(self.chunks)
        if removed_count > 0:
            self._rebuild_index()
        return removed_count

    def _rebuild_index(self):
        """
        Fits vectorizer and builds sparse/dense similarity index.
        """
        if not self.chunks:
            self.vectorizer = None
            self.matrix = None
            return

        corpus = [c["content"] for c in self.chunks]
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            stop_words="english",
            norm="l2",
            max_features=10000
        )
        self.matrix = self.vectorizer.fit_transform(corpus)

    def similarity_search(
        self,
        query: str,
        top_k: int = 4,
        min_threshold: float = 0.08,
        category_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Searches the vector store for chunks matching the query string.
        Returns ranked results with cosine similarity scores.
        """
        if not self.chunks or self.vectorizer is None or self.matrix is None or not query.strip():
            return []

        # Vectorize query
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.matrix).flatten()

        # Filter by threshold and category
        scored_results = []
        for idx, score in enumerate(similarities):
            if score < min_threshold:
                continue

            chunk = self.chunks[idx]
            if category_filter and chunk.get("category") != category_filter:
                continue

            scored_results.append({
                "chunk_id": chunk.get("chunk_id"),
                "source_id": chunk.get("source_id"),
                "document_title": chunk.get("document_title"),
                "institution": chunk.get("institution"),
                "category": chunk.get("category"),
                "page_number": chunk.get("page_number", 1),
                "trust_status": chunk.get("trust_status", "approved"),
                "content": chunk.get("content"),
                "similarity_score": round(float(score), 4)
            })

        # Sort descending by similarity score
        scored_results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_results[:top_k]

    def count(self) -> int:
        return len(self.chunks)


vector_store = VectorStore()
