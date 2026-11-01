from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

from app.core.security import get_current_user, require_role
from app.services.audit_service import audit_service, AuditEventType
from app.services.rag_service import rag_service
from app.services.rag.vector_store import vector_store
from app.services.rag.knowledge_base import knowledge_base_service

router = APIRouter(prefix="/rag", tags=["Retrieval-Augmented Generation (RAG)"])


# --- Schemas ---

class RAGChatRequest(BaseModel):
    query: str = Field(..., min_length=2, description="User question or inquiry")
    document_id: Optional[str] = Field(None, description="Optional document ID to attach verification report context")
    conversation_history: Optional[List[Dict[str, str]]] = Field(None, description="Prior message history")
    top_k: int = Field(4, ge=1, le=10, description="Number of context chunks to retrieve")


class SourceCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    institution: str = Field(..., min_length=2)
    category: str = Field("academic_verification")
    description: str = Field("")


# --- Endpoints ---

@router.get("/health")
async def get_rag_health():
    """
    Returns RAG pipeline status, index count, and embedding health.
    """
    chunk_count = vector_store.count()
    sources_count = len(knowledge_base_service.sources)
    return {
        "status": "operational" if chunk_count > 0 else "uninitialized",
        "total_sources": sources_count,
        "total_indexed_chunks": chunk_count,
        "embedding_model": "Sublinear TF-IDF + Cosine Vector Engine",
        "retrieval_mode": "grounded_semantic_search"
    }


@router.post("/chat")
async def rag_chat(
    req: RAGChatRequest,
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    RAG-grounded conversational endpoint.
    Retrieves trusted institutional guidelines, integrates active document verification reports,
    and returns evidence-backed responses with source citation cards.
    """
    response = await rag_service.chat(
        query=req.query.strip(),
        document_id=req.document_id,
        conversation_history=req.conversation_history,
        top_k=req.top_k
    )

    if current_user:
        audit_service.log_event(
            user_id=current_user.get("id", "usr_anon"),
            user_name=current_user.get("full_name", "User"),
            event_type=AuditEventType.RAG_QUERY,
            event_details=f"RAG query submitted: {req.query[:60]}...",
            resource_id=req.document_id or "general_rag",
            resource_type="rag_query",
            metadata={
                "action": "rag_query",
                "query": req.query[:100],
                "evidence_sufficiency": response.get("evidence_sufficiency"),
                "citations_count": len(response.get("citations", []))
            }
        )

    return response


@router.get("/sources")
async def list_sources():
    """
    Lists all indexed knowledge base sources with trust metadata and chunk counts.
    """
    return {
        "sources": rag_service.list_sources(),
        "total_count": len(rag_service.list_sources()),
        "total_chunks": vector_store.count()
    }


@router.post("/sources/upload")
async def upload_source(
    file: UploadFile = File(...),
    title: str = Form(...),
    institution: str = Form(...),
    category: str = Form("academic_verification"),
    description: str = Form(""),
    current_user: dict = Depends(require_role(["admin"]))
):
    """
    Admin-only upload for official institutional verification guidelines (PDF or TXT).
    Extracts text, splits into semantic chunks, and updates vector store.
    """
    allowed_exts = [".pdf", ".txt", ".md"]
    fname = file.filename or "uploaded_document.txt"
    if not any(fname.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported format. Allowed formats: {', '.join(allowed_exts)}"
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        source_record = rag_service.add_source(
            title=title.strip(),
            institution=institution.strip(),
            category=category.strip(),
            description=description.strip(),
            file_bytes=content,
            filename=fname
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process and index document: {str(e)}")

    audit_service.log_event(
        user_id=current_user.get("id", "usr_admin"),
        user_name=current_user.get("full_name", "Administrator"),
        event_type=AuditEventType.KNOWLEDGE_SOURCE_UPLOAD,
        event_details=f"Uploaded and indexed knowledge source '{title}' ({institution})",
        resource_id=source_record["source_id"],
        resource_type="knowledge_source",
        metadata={
            "action": "knowledge_source_uploaded",
            "title": title,
            "institution": institution,
            "chunks_created": source_record["chunk_count"]
        }
    )

    return {
        "success": True,
        "message": f"Successfully indexed '{title}' into knowledge base.",
        "source": source_record
    }


@router.get("/sources/{source_id}")
async def get_source_details(source_id: str):
    """
    Retrieves full source metadata and preview of its vector chunks.
    """
    source = rag_service.get_source(source_id)
    if not source:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")

    chunks = knowledge_base_service.get_source_chunks(source_id)
    return {
        "source": source,
        "chunks": chunks
    }


@router.delete("/sources/{source_id}")
async def delete_source(
    source_id: str,
    current_user: dict = Depends(require_role(["admin"]))
):
    """
    Admin-only removal of an indexed knowledge base source.
    """
    success = rag_service.delete_source(source_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")

    audit_service.log_event(
        user_id=current_user.get("id", "usr_admin"),
        user_name=current_user.get("full_name", "Administrator"),
        event_type=AuditEventType.KNOWLEDGE_SOURCE_DELETE,
        event_details=f"Deleted knowledge source '{source_id}'",
        resource_id=source_id,
        resource_type="knowledge_source",
        metadata={"action": "knowledge_source_deleted"}
    )

    return {
        "success": True,
        "message": f"Source '{source_id}' and all associated vector embeddings removed."
    }


@router.post("/sources/{source_id}/reindex")
async def reindex_source(
    source_id: str,
    current_user: dict = Depends(require_role(["admin"]))
):
    """
    Admin-only re-indexing of an existing source.
    """
    updated = rag_service.reindex_source(source_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found.")

    return {
        "success": True,
        "message": f"Source '{source_id}' re-indexed successfully.",
        "source": updated
    }


@router.get("/search")
async def search_knowledge_base(
    q: str = Query(..., min_length=2, description="Search query string"),
    top_k: int = Query(5, ge=1, le=10),
    category: Optional[str] = Query(None)
):
    """
    Direct semantic similarity search on the knowledge base vector store.
    """
    results = vector_store.similarity_search(
        query=q,
        top_k=top_k,
        category_filter=category
    )
    return {
        "query": q,
        "results_count": len(results),
        "results": results
    }
