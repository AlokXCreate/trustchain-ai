import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BotMessageSquare,
  Send,
  User,
  Sparkles,
  Copy,
  Trash2,
  Bookmark,
  Check,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Plus,
  Upload,
  RefreshCw,
  Search,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Building2,
  X,
  Layers,
  HelpCircle,
  Database,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, RAGCitation, RAGChatResponse, KnowledgeBaseSource, DocumentItem } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AIAssistantPage: React.FC = () => {
  const { user, role } = useAuth();
  const [searchParams] = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('conv_rag_01');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active document context (supports ?docId=... from URL)
  const [userDocuments, setUserDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>(searchParams.get('docId') || '');

  // Selected Citation Modal for full preview
  const [activeCitation, setActiveCitation] = useState<RAGCitation | null>(null);

  // Admin Knowledge Base Modal
  const [isKbModalOpen, setIsKbModalOpen] = useState(false);
  const [sources, setSources] = useState<KnowledgeBaseSource[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [kbSearchTerm, setKbSearchTerm] = useState('');
  const [ragHealth, setRagHealth] = useState<any>(null);

  // Source Upload State
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceInstitution, setNewSourceInstitution] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState('academic_verification');
  const [newSourceDesc, setNewSourceDesc] = useState('');
  const [newSourceFile, setNewSourceFile] = useState<File | null>(null);
  const [isUploadingSource, setIsUploadingSource] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Why was this document flagged as suspicious?',
    'Explain the verification report in simple language.',
    'What inconsistencies were found in this certificate?',
    'What does the blockchain verification status mean?',
    'Why does the document hash not match?',
    'Does blockchain prove that this certificate is genuine?',
    'How do I verify an accredited institution?',
  ];

  // Fetch user documents for context selector
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await api.get<DocumentItem[]>('/documents/list');
        setUserDocuments(docs);
        if (docs.length > 0 && !selectedDocId) {
          setSelectedDocId(docs[0].id);
        }
      } catch {
        // demo docs fallback
        setUserDocuments([
          {
            id: 'doc_demo_01',
            name: 'MIT_Degree_Alex_Mercer.pdf',
            category: 'degree',
            file_type: 'pdf',
            file_size_bytes: 1420000,
            uploaded_by: 'individual@trustchain.ai',
            status: 'verified',
            created_at: new Date().toISOString(),
          },
        ]);
        setSelectedDocId('doc_demo_01');
      }
    };
    fetchDocs();
  }, []);

  // Prefill question if passed via URL parameter
  useEffect(() => {
    const urlQuery = searchParams.get('query');
    if (urlQuery && !inputText) {
      setInputText(urlQuery);
    }
    const urlDocId = searchParams.get('docId');
    if (urlDocId) {
      setSelectedDocId(urlDocId);
    }
  }, [searchParams]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'msg_welcome',
        conversation_id: conversationId,
        sender: 'assistant',
        content:
          'Hello! I am your **TrustChain AI Assistant**, grounded in our verified institutional knowledge base and multi-modal forensic inspection engine.\n\n' +
          'I can explain verification risk scores, cross-check university guidelines (such as Stanford seals or MIT transcript standards), interpret blockchain proof hashes, and detect forensic discrepancies. How can I assist your document audit today?',
        sources: ['TrustChain AI Grounded Knowledge Base', 'EVM Credential Registry'],
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch Knowledge Base Sources (Admin)
  const fetchKnowledgeBase = async () => {
    setSourcesLoading(true);
    try {
      const res = await api.get<{ sources: KnowledgeBaseSource[]; total_chunks: number }>('/rag/sources');
      setSources(res.sources || []);
      const health = await api.get('/rag/health');
      setRagHealth(health);
    } catch {
      // Offline fallback sources
      setSources([
        {
          source_id: 'src_stanford_verif_01',
          title: 'Stanford University Degree Verification Policy & Seal Standards',
          institution: 'Stanford University',
          category: 'academic_verification',
          description: 'Official guidelines on Stanford embossed seals, registrar signature verification, and diploma security paper.',
          trust_status: 'approved',
          chunk_count: 3,
          created_at: Date.now() / 1000 - 86400 * 10,
          updated_at: Date.now() / 1000 - 86400 * 10,
          source_type: 'official_guideline',
        },
        {
          source_id: 'src_mit_transcript_02',
          title: 'MIT Academic Transcripts and Security Paper Standards',
          institution: 'Massachusetts Institute of Technology (MIT)',
          category: 'academic_verification',
          description: 'Security paper specifications, void pantographs, 5.0 GPA scale, and microprinting.',
          trust_status: 'approved',
          chunk_count: 3,
          created_at: Date.now() / 1000 - 86400 * 8,
          updated_at: Date.now() / 1000 - 86400 * 8,
          source_type: 'official_guideline',
        },
      ]);
    } finally {
      setSourcesLoading(false);
    }
  };

  const handleOpenKbManager = () => {
    setIsKbModalOpen(true);
    fetchKnowledgeBase();
  };

  const handleUploadSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceFile || !newSourceTitle.trim() || !newSourceInstitution.trim()) {
      setUploadMessage({ text: 'Please fill in all required fields and choose a file.', error: true });
      return;
    }

    setIsUploadingSource(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', newSourceFile);
      formData.append('title', newSourceTitle.trim());
      formData.append('institution', newSourceInstitution.trim());
      formData.append('category', newSourceCategory);
      formData.append('description', newSourceDesc.trim());

      await api.postForm('/rag/sources/upload', formData);
      setUploadMessage({ text: `Successfully ingested and indexed '${newSourceTitle}'!`, error: false });
      // Reset form
      setNewSourceTitle('');
      setNewSourceInstitution('');
      setNewSourceDesc('');
      setNewSourceFile(null);
      fetchKnowledgeBase();
    } catch (err: any) {
      setUploadMessage({ text: err.message || 'Failed to upload and index document.', error: true });
    } finally {
      setIsUploadingSource(false);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!window.confirm(`Are you sure you want to delete source '${sourceId}'?`)) return;
    try {
      await api.delete(`/rag/sources/${sourceId}`);
      fetchKnowledgeBase();
    } catch (err: any) {
      alert(err.message || 'Failed to delete source.');
    }
  };

  const handleReindexSource = async (sourceId: string) => {
    try {
      await api.post(`/rag/sources/${sourceId}/reindex`);
      alert(`Source '${sourceId}' re-indexed successfully.`);
      fetchKnowledgeBase();
    } catch (err: any) {
      alert(err.message || 'Failed to reindex source.');
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender: 'user',
      content: text,
      sources: [],
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        sender: m.sender,
        content: m.content,
      }));

      const reply = await api.post<RAGChatResponse>('/rag/chat', {
        query: text,
        document_id: selectedDocId || undefined,
        conversation_history: historyPayload,
        top_k: 4,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_rep_${Date.now()}`,
        conversation_id: conversationId,
        sender: 'assistant',
        content: reply.answer,
        sources: reply.citations?.map((c) => `${c.source_title} (${c.institution})`) || [],
        citations: reply.citations,
        evidence_sufficiency: reply.evidence_sufficiency,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Fallback synthesis if backend unreachable
      setTimeout(() => {
        const fallbackMsg: ChatMessage = {
          id: `msg_fallback_${Date.now()}`,
          conversation_id: conversationId,
          sender: 'assistant',
          content:
            '### Grounded Verification Analysis\n\n' +
            'TrustChain AI evaluates documents using **multi-modal evidence fusion**:\n\n' +
            '1. **OCR & Semantic Validation**: Checks typography, student conferral titles, and mathematical consistency.\n' +
            '2. **Error Level Analysis (ELA)**: Localizes digital JPEG compression discrepancies and spliced regions.\n' +
            '3. **Decentralized Verification**: Cross-references SHA-256 byte hashes with the `TrustChainCredentialRegistry` smart contract.\n\n' +
            '*Note: When verifying files, even a single modified pixel or re-saving changes the cryptographic SHA-256 digest.*',
          sources: ['TrustChain Knowledge Base', 'Ethereum Sepolia Registry'],
          evidence_sufficiency: 'moderate',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setIsLoading(false);
      }, 500);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg_reset',
        conversation_id: conversationId,
        sender: 'assistant',
        content: 'Conversation history cleared. Feel free to ask about any document or institutional verification policy.',
        sources: ['TrustChain AI Core'],
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const filteredSources = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(kbSearchTerm.toLowerCase()) ||
      s.institution.toLowerCase().includes(kbSearchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(kbSearchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Bar with Context Selector & Admin KB Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-navy-800">
        <div>
          <h1 className="text-xl font-extrabold text-brand-text dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-accent" />
            TrustChain RAG Assistant
          </h1>
          <p className="text-xs text-brand-muted dark:text-slate-400">
            Grounded question answering with institutional policies, active forensic dossiers, and on-chain records.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Document Context Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 px-2.5 py-1.5 rounded-lg text-xs">
            <FileText className="w-3.5 h-3.5 text-brand-accent shrink-0" />
            <span className="text-slate-400 font-medium">Context:</span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              <option value="">No Document Attached</option>
              {userDocuments.map((doc) => (
                <option key={doc.id} value={doc.id} className="dark:bg-navy-900">
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Admin Knowledge Base Manager Trigger */}
          {role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenKbManager}
              icon={<Database className="w-3.5 h-3.5" />}
              className="text-xs shrink-0"
            >
              Knowledge Base
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            icon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
            className="text-xs text-slate-500 hover:text-red-500"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl shadow-sm">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-brand-accent to-blue-600'
                    : 'bg-gradient-to-tr from-brand-navy to-brand-teal'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2 max-w-2xl">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-accent text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-navy-950/80 text-brand-text dark:text-slate-100 border border-slate-200 dark:border-navy-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="whitespace-pre-wrap font-sans space-y-1.5">
                    {msg.content}
                  </div>

                  {/* Actions for assistant message */}
                  {msg.sender === 'assistant' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        {msg.evidence_sufficiency && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              msg.evidence_sufficiency === 'high'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : msg.evidence_sufficiency === 'moderate'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            Evidence: {msg.evidence_sufficiency}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <button
                        onClick={() => copyResponse(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-brand-accent transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Source Citation Cards */}
                {msg.sender === 'assistant' && msg.citations && msg.citations.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-brand-teal" />
                      Retrieved Evidence & Citations ({msg.citations.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.citations.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveCitation(c)}
                          className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 hover:border-brand-accent/60 dark:hover:border-brand-accent transition shadow-xs group"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-semibold text-brand-teal truncate max-w-[130px]">
                              {c.institution}
                            </span>
                            <span className="text-slate-400">p. {c.page_number}</span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-accent transition-colors">
                            {c.source_title}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {c.excerpt}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-teal flex items-center justify-center shrink-0 text-white shadow-sm">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-navy-800 rounded-tl-none shadow-sm flex items-center gap-2 text-xs text-brand-muted dark:text-slate-400">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Retrieving guidelines & evaluating verification evidence...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Tray */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-navy-800/80 bg-slate-50/50 dark:bg-navy-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Prompts:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-3 py-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-brand-accent rounded-full text-slate-600 dark:text-slate-300 hover:text-brand-accent whitespace-nowrap text-[11px] font-medium transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about document risk, institution guidelines, or blockchain status..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-brand-text dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !inputText.trim()}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Citation Inspector Modal */}
      {activeCitation && (
        <Modal
          isOpen={true}
          onClose={() => setActiveCitation(null)}
          title="Verified Source Citation Details"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <span className="text-[10px] uppercase font-bold text-brand-teal block">
                {activeCitation.institution}
              </span>
              <h4 className="font-bold text-sm text-brand-text dark:text-white mt-0.5">
                {activeCitation.source_title}
              </h4>
              <div className="flex items-center gap-3 mt-2 text-slate-500 dark:text-slate-400">
                <span>Page: <strong>{activeCitation.page_number}</strong></span>
                <span>Category: <strong>{activeCitation.category}</strong></span>
                {activeCitation.similarity_score !== undefined && (
                  <span>Relevance: <strong>{(activeCitation.similarity_score * 100).toFixed(1)}%</strong></span>
                )}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Excerpt from Official Guideline:
              </span>
              <div className="p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
                {activeCitation.excerpt}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveCitation(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Admin Knowledge Base Management Modal */}
      {isKbModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsKbModalOpen(false)}
          title="Trusted Institutional Knowledge Base Manager"
        >
          <div className="space-y-6 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Telemetry Header */}
            {ragHealth && (
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                  <p className="font-bold text-emerald-500 uppercase">{ragHealth.status}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Sources</span>
                  <p className="font-bold text-slate-800 dark:text-white">{ragHealth.total_sources}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Indexed Chunks</span>
                  <p className="font-bold text-brand-accent">{ragHealth.total_indexed_chunks}</p>
                </div>
              </div>
            )}

            {/* Ingestion Form */}
            <form onSubmit={handleUploadSource} className="p-4 rounded-xl border border-brand-accent/20 bg-brand-accent/5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-brand-accent text-xs">
                <Upload className="w-4 h-4" />
                <span>Upload & Index New Institutional Policy (PDF / TXT)</span>
              </div>

              {uploadMessage && (
                <div
                  className={`p-2.5 rounded-lg text-xs ${
                    uploadMessage.error
                      ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  }`}
                >
                  {uploadMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceTitle}
                    onChange={(e) => setNewSourceTitle(e.target.value)}
                    placeholder="e.g. Cambridge Diploma Verification Norms"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Institution / Authority *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceInstitution}
                    onChange={(e) => setNewSourceInstitution(e.target.value)}
                    placeholder="e.g. Cambridge Assessment"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newSourceCategory}
                    onChange={(e) => setNewSourceCategory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white"
                  >
                    <option value="academic_verification">Academic Verification</option>
                    <option value="examination_verification">Examination Verification</option>
                    <option value="corporate_verification">Corporate Verification</option>
                    <option value="regulatory_norms">Regulatory Norms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Select File (PDF, TXT, MD) *
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.txt,.md"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewSourceFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-[11px] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-brand-accent file:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Brief Description
                </label>
                <input
                  type="text"
                  value={newSourceDesc}
                  onChange={(e) => setNewSourceDesc(e.target.value)}
                  placeholder="Summary of seals, typography, and watermarks covered..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isUploadingSource}
                icon={<Upload className="w-3.5 h-3.5" />}
              >
                {isUploadingSource ? 'Chunking & Indexing...' : 'Upload & Index Into Vector DB'}
              </Button>
            </form>

            {/* List of Sources */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-brand-accent" />
                  <span>Indexed Guidelines ({sources.length})</span>
                </h4>
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={kbSearchTerm}
                    onChange={(e) => setKbSearchTerm(e.target.value)}
                    placeholder="Search guidelines..."
                    className="w-full pl-8 pr-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950"
                  />
                </div>
              </div>

              {sourcesLoading ? (
                <p className="text-center py-4 text-slate-400">Loading sources...</p>
              ) : (
                <div className="space-y-2">
                  {filteredSources.map((s) => (
                    <div
                      key={s.source_id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{s.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal">
                            {s.institution}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {s.description || 'Institutional verification protocol'}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span>Chunks: <strong>{s.chunk_count}</strong></span>
                          <span>Category: <strong>{s.category}</strong></span>
                          <span>Type: <strong>{s.source_type}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReindexSource(s.source_id)}
                          title="Re-index Chunks"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSource(s.source_id)}
                          title="Remove Source"
                          className="hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsKbModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
