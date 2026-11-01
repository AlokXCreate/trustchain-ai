from typing import List, Dict, Any, Optional
from app.services.rag.rag_pipeline import rag_pipeline
from app.services.rag.knowledge_base import knowledge_base_service
from app.services.rag.vector_store import vector_store


class RAGService:
    """
    Unified RAG Service Interface for TrustChain AI.
    Integrates knowledge base management, semantic vector retrieval,
    and grounded answer generation.
    """

    @property
    def is_initialized(self) -> bool:
        return vector_store.count() > 0

    async def retrieve_context(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Retrieves institutional guidelines and verification criteria.
        """
        return rag_pipeline.retrieve_context(query=query, top_k=top_k)

    async def chat(
        self,
        query: str,
        document_id: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        top_k: int = 4
    ) -> Dict[str, Any]:
        """
        Generates grounded answer with real source citations.
        """
        return rag_pipeline.generate_grounded_response(
            query=query,
            document_id=document_id,
            conversation_history=conversation_history,
            top_k=top_k
        )

    def list_sources(self) -> List[Dict[str, Any]]:
        return knowledge_base_service.list_sources()

    def get_source(self, source_id: str) -> Optional[Dict[str, Any]]:
        return knowledge_base_service.get_source(source_id)

    def add_source(
        self,
        title: str,
        institution: str,
        category: str,
        description: str,
        file_bytes: bytes,
        filename: str
    ) -> Dict[str, Any]:
        return knowledge_base_service.add_custom_source(
            title=title,
            institution=institution,
            category=category,
            description=description,
            file_bytes=file_bytes,
            filename=filename
        )

    def delete_source(self, source_id: str) -> bool:
        return knowledge_base_service.delete_source(source_id)

    def reindex_source(self, source_id: str) -> Optional[Dict[str, Any]]:
        return knowledge_base_service.reindex_source(source_id)


rag_service = RAGService()
