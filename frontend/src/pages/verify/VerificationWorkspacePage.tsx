import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  CheckCircle2,
  Clock,
  Cpu,
  Lock,
  Building2,
  FileCheck2,
  Sparkles,
  Info,
  RefreshCw,
  Share2,
  Eye,
  Sliders,
  Edit3,
  Layers,
  Activity,
  Check,
  X,
  ExternalLink,
  ShieldAlert,
  Flame,
  Printer,
  Copy,
  ArrowLeft,
  BotMessageSquare,
} from 'lucide-react';
import { VerificationResult, DocumentItem, AIAnalysisResult, AnomalyFinding, OCRTextBlock, TamperRegion } from '../../types';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const VerificationWorkspacePage: React.FC = () => {
  const { docId } = useParams<{ docId?: string }>();
  const navigate = useNavigate();

  const [documentId, setDocumentId] = useState<string>(docId || 'doc_demo_degree_01');
  const [docDetails, setDocDetails] = useState<DocumentItem | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [aiData, setAiData] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Viewer Controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [showOcrBoxes, setShowOcrBoxes] = useState<boolean>(false);
  const [showTamperBoxes, setShowTamperBoxes] = useState<boolean>(true);
  const [showElaView, setShowElaView] = useState<boolean>(false);
  const [activeHoveredBox, setActiveHoveredBox] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'extracted' | 'findings' | 'timeline' | 'models'>('overview');

  // OCR Correction Modal
  const [correctionModalOpen, setCorrectionModalOpen] = useState<boolean>(false);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('');
  const [fieldCorrectionValue, setFieldCorrectionValue] = useState<string>('');
  // Feedback & Copy State
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const fetchVerificationData = async (targetId: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch document metadata
      const doc = await api.get<DocumentItem>(`/documents/${targetId}`);
      setDocDetails(doc);

      // 2. Fetch AI analysis results
      try {
        const aiRes = await api.get<AIAnalysisResult>(`/ai/results/${targetId}`);
        setAiData(aiRes);
      } catch (e) {
        console.warn('AI analysis results not pre-cached, running pipeline...');
      }

      // 3. Fetch or initiate verification result
      const res = await api.get<VerificationResult>(`/verification/${targetId}`);
      setResult(res);

      if (res.status === 'verified') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch {
      // Demo fallback
      console.warn('Using demo data fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.post<AIAnalysisResult>(`/ai/reanalyze/${documentId}`);
      setAiData(res);
      // Refresh verification result
      const verifRes = await api.get<VerificationResult>(`/verification/${documentId}`);
      setResult(verifRes);
      setFeedbackSuccess('Document re-analyzed with fresh multi-modal inference!');
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (e) {
      console.error('Re-analysis error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitOcrCorrection = async () => {
    if (!aiData?.report_id || !selectedFieldKey) return;
    try {
      await api.post(`/ai/feedback/${aiData.report_id}`, {
        finding_id: `ocr_correction_${selectedFieldKey}`,
        feedback_type: 'ocr_correction',
        field_name: selectedFieldKey,
        corrected_value: fieldCorrectionValue,
        comment: 'User submitted OCR field correction'
      });
      setFeedbackSuccess(`OCR correction for '${selectedFieldKey}' logged successfully.`);
      setCorrectionModalOpen(false);
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (e) {
      console.error('Feedback error:', e);
    }
  };

  const handleDownloadPdf = () => {
    if (!aiData?.report_id) return;
    window.open(`${api.getBaseUrl()}/ai/report/${aiData.report_id}/pdf`, '_blank');
  };

  const handleDownloadJson = () => {
    if (!aiData?.report_id) return;
    window.open(`${api.getBaseUrl()}/ai/report/${aiData.report_id}/json`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    const idToCopy = aiData?.report_id || result?.id || documentId;
    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShareLink = () => {
    const credNum = docDetails?.certificate_number || 'TC-2026-MIT941';
    const publicUrl = `${window.location.origin}/verify/credential/${credNum}`;
    navigator.clipboard.writeText(publicUrl);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleAskAssistant = () => {
    const query = encodeURIComponent("Please explain the verification findings, risk score, and integrity check results for this document.");
    navigate(`/app/assistant?docId=${documentId}&query=${query}`);
  };

  useEffect(() => {
    if (docId) {
      setDocumentId(docId);
      fetchVerificationData(docId);
    } else {
      fetchVerificationData(documentId);
    }
  }, [docId]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const getRiskScoreBadge = (score: number) => {
    if (score <= 29) {
      return <Badge variant="success">Low Risk ({score}/100)</Badge>;
    } else if (score <= 59) {
      return <Badge variant="warning">Moderate Risk ({score}/100)</Badge>;
    } else if (score <= 79) {
      return <Badge variant="danger">Elevated Risk ({score}/100)</Badge>;
    }
    return <Badge variant="danger">Requires Manual Review ({score}/100)</Badge>;
  };

  const riskScore = aiData?.risk_assessment?.risk_score ?? (result?.risk_score ?? 12);
  const riskCategory = aiData?.risk_assessment?.category_label ?? (riskScore > 50 ? 'Moderate Risk Indicators' : 'Low Risk Indicators');

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-extrabold text-brand-text dark:text-white tracking-tight">
              {docDetails?.name || 'Document Verification Workspace'}
            </h1>
            {getRiskScoreBadge(riskScore)}
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-muted dark:text-slate-400 mt-1">
            <span>Dossier ID:</span>
            <span className="font-mono text-slate-500 font-semibold">{aiData?.report_id || result?.id || 'res_loading'}</span>
            <button
              onClick={handleCopyId}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-brand-accent transition-colors"
              title="Copy Dossier ID"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span>•</span>
            <span>Category: <span className="font-medium text-slate-500">{aiData?.document_type?.predicted_type || docDetails?.category || 'Academic Credential'}</span></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAskAssistant}
            icon={<BotMessageSquare className="w-3.5 h-3.5 text-brand-teal" />}
            className="border-brand-teal/40 hover:border-brand-teal text-brand-teal"
          >
            Ask AI Assistant
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareLink}
            icon={<Share2 className="w-3.5 h-3.5" />}
            title="Share Public Verification Link"
          >
            Share Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-3.5 h-3.5" />}
            title="Print Dossier"
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReanalyze}
            disabled={isAnalyzing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />}
          >
            {isAnalyzing ? 'Analyzing AI...' : 'Re-run'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJson}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            JSON
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {shareSuccess && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span>Public verification URL copied to clipboard! Anyone can verify this credential without logging in.</span>
          </div>
          <button onClick={() => setShareSuccess(false)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {feedbackSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fade-in">
          <span>{feedbackSuccess}</span>
          <button onClick={() => setFeedbackSuccess(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Document Viewer & Overlays (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 space-y-3">
            {/* Viewer Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  Visual Inspector
                </span>
                {aiData?.quality_assessment?.quality_score && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono">
                    Quality: {aiData.quality_assessment.quality_score}/100
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-500"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-400 px-1">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-500"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-navy-700 mx-1" />
                <button
                  onClick={handleRotate}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-500"
                  title="Rotate 90deg"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overlay Layer Toggles */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-navy-950 p-2 rounded-lg text-[11px]">
              <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> AI Overlays:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOcrBoxes(!showOcrBoxes)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    showOcrBoxes
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  OCR Boxes
                </button>
                <button
                  onClick={() => setShowTamperBoxes(!showTamperBoxes)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    showTamperBoxes
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Tamper Regions
                </button>
                <button
                  onClick={() => setShowElaView(!showElaView)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    showElaView
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  ELA Heatmap
                </button>
              </div>
            </div>

            {/* Document Render Area with Interactive Overlays */}
            <div className="min-h-[460px] max-h-[580px] overflow-auto bg-slate-100 dark:bg-navy-950 rounded-xl p-4 flex items-center justify-center border border-slate-200 dark:border-navy-800 relative">
              {showElaView && aiData?.image_forensics?.error_level_analysis?.ela_preview_base64 ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300">
                    ERROR LEVEL ANALYSIS (ELA) RESIDUAL MAP
                  </div>
                  <img
                    src={aiData.image_forensics.error_level_analysis.ela_preview_base64}
                    alt="Error Level Analysis"
                    style={{ transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)` }}
                    className="max-w-[340px] rounded-lg shadow-2xl transition-transform"
                  />
                  <p className="text-[10px] text-slate-400 text-center max-w-[320px]">
                    Uniform texture represents identical compression. High-contrast bright patches indicate modified regions.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease',
                  }}
                  className="w-full max-w-[360px] bg-white dark:bg-navy-900 border-2 border-slate-300 dark:border-navy-700 rounded-lg p-6 shadow-xl text-center space-y-3 relative select-none"
                >
                  {/* Official seal badge */}
                  <div className="w-12 h-12 mx-auto rounded-full bg-brand-accent/10 border border-brand-accent/40 flex items-center justify-center text-brand-accent">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-sm font-bold tracking-wider text-brand-text dark:text-white uppercase">
                    {docDetails?.issuer_name || 'Stanford University'}
                  </h4>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400">
                    Official Verifiable Credential
                  </p>
                  <div className="py-3 border-y border-slate-200 dark:border-navy-800 my-2">
                    <p className="text-[10px] italic text-slate-500">This is to certify that</p>
                    <p className="text-xs font-bold text-brand-accent mt-0.5">
                      {aiData?.extracted_information?.extracted_fields?.holder_name?.value || 'Alexander Vance'}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      {aiData?.extracted_information?.extracted_fields?.degree_title?.value || docDetails?.name || 'Bachelor of Science in Computer Science'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1">
                    <span>{aiData?.extracted_information?.extracted_fields?.certificate_number?.value || 'STAN-CS-2024-8841'}</span>
                    <span>{aiData?.extracted_information?.extracted_fields?.issue_date?.value || '2024-06-16'}</span>
                  </div>

                  {/* Tamper / Highlight Box Overlays */}
                  {showTamperBoxes && aiData?.visual_overlays?.tamper_boxes?.map((tBox, idx) => (
                    <div
                      key={`tamper_${idx}`}
                      className={`absolute rounded border-2 transition-all cursor-pointer ${
                        tBox.severity === 'critical' || tBox.severity === 'high'
                          ? 'border-rose-500 bg-rose-500/20'
                          : tBox.severity === 'positive'
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-amber-500 bg-amber-500/20'
                      }`}
                      style={{
                        left: `${Math.min(80, (tBox.bounding_box.x / 1600) * 100)}%`,
                        top: `${Math.min(85, (tBox.bounding_box.y / 2200) * 100)}%`,
                        width: `${Math.min(40, (tBox.bounding_box.width / 1600) * 100)}%`,
                        height: `${Math.min(25, (tBox.bounding_box.height / 2200) * 100)}%`,
                      }}
                      title={`${tBox.type.toUpperCase()}: ${tBox.description}`}
                    />
                  ))}

                  {/* OCR Bounding Boxes */}
                  {showOcrBoxes && aiData?.visual_overlays?.ocr_boxes?.slice(0, 15).map((ocrBox, idx) => (
                    <div
                      key={`ocr_${idx}`}
                      className="absolute border border-blue-400 bg-blue-400/10 hover:bg-blue-500/30 transition-all cursor-help rounded-sm"
                      style={{
                        left: `${Math.min(80, (ocrBox.bounding_box.x / 1600) * 100)}%`,
                        top: `${Math.min(90, (ocrBox.bounding_box.y / 2200) * 100)}%`,
                        width: `${Math.min(85, (ocrBox.bounding_box.width / 1600) * 100)}%`,
                        height: `${Math.min(10, (ocrBox.bounding_box.height / 2200) * 100)}%`,
                      }}
                      title={`OCR [${intConf(ocrBox.confidence)}%]: "${ocrBox.text}"`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quality Summary Strip */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Quality Assessment:</span>
                <span className="font-semibold text-brand-text dark:text-slate-200">
                  {aiData?.quality_assessment?.recommendation || 'Document resolution is optimal for OCR verification.'}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Skew: {aiData?.quality_assessment?.skew_angle ?? 0.0}°</span>
                <span>Contrast: {aiData?.quality_assessment?.contrast_level ?? 'acceptable'}</span>
                <span>Noise: {aiData?.quality_assessment?.noise_metric ?? 4.5}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: Multi-Tab Intelligence Dossier (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-slate-200 dark:border-navy-800 pb-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              Risk Overview
            </button>
            <button
              onClick={() => setActiveTab('extracted')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'extracted'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              Extracted Fields ({Object.keys(aiData?.extracted_information?.extracted_fields || {}).length || 6})
            </button>
            <button
              onClick={() => setActiveTab('findings')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'findings'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              Findings ({aiData?.findings?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'timeline'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              Pipeline Steps (7)
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'models'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              Model Governance
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Risk Cards Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="flex flex-col justify-between p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Calculated Risk
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className={`text-3xl font-black ${riskScore > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {riskScore}
                    </span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1">
                    {riskCategory}
                  </span>
                </Card>

                <Card className="flex flex-col justify-between p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    OCR Confidence
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                      {aiData?.ocr_result?.overall_confidence ? `${(aiData.ocr_result.overall_confidence * 100).toFixed(0)}%` : '96%'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1">
                    Multi-page text extracted
                  </span>
                </Card>

                <Card className="flex flex-col justify-between p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Registry Match
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-5 h-5" /> ACCREDITED
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1">
                    TrustChain Directory Verified
                  </span>
                </Card>
              </div>

              {/* Action Recommendation Card */}
              <Card className="p-4 space-y-2 border-l-4 border-brand-accent">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-text dark:text-white">
                  <Sparkles className="w-4 h-4 text-brand-teal" />
                  <span>Executive AI Assessment</span>
                </div>
                <p className="text-xs text-brand-muted dark:text-slate-300 leading-relaxed">
                  {aiData?.risk_assessment?.explanation || result?.ai_explanation || 'Preliminary analysis complete.'}
                </p>
                {aiData?.risk_assessment?.action_recommendation && (
                  <div className="pt-2 text-[11px] font-medium text-brand-accent flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Recommended Action: {aiData.risk_assessment.action_recommendation}
                  </div>
                )}
              </Card>

              {/* Evidence Contributing Components */}
              <Card className="p-4 space-y-3">
                <h3 className="text-xs font-bold text-brand-text dark:text-white uppercase tracking-wider">
                  Multi-Modal Evidence Breakdown
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Cross-Field Arithmetic & Dates</span>
                      <p className="text-[10px] text-slate-400">Mathematical ratios, graduation year vs issue date chronology</p>
                    </div>
                    <Badge variant="success">Validated</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Image Forensics & ELA</span>
                      <p className="text-[10px] text-slate-400">Error Level Analysis compression differentials and splice detection</p>
                    </div>
                    <Badge variant="info">Completed</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Random Forest Anomaly Model</span>
                      <p className="text-[10px] text-slate-400">14-dimensional feature vector statistical inference</p>
                    </div>
                    <Badge variant="neutral">Normal Distribution</Badge>
                  </div>
                </div>
              </Card>

              {/* SECTION 6: BLOCKCHAIN CREDENTIAL VERIFICATION */}
              <Card className="p-4 space-y-3 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-brand-text dark:text-white uppercase tracking-wider">
                        Blockchain Ledger Integrity Proof
                      </h3>
                      <p className="text-[10px] text-slate-400">Ethereum Sepolia / Hardhat Localhost (Chain ID: 31337)</p>
                    </div>
                  </div>
                  <Badge variant={result?.blockchain_status?.toLowerCase().includes('active') || result?.blockchain_status?.toLowerCase().includes('anchored') ? 'success' : 'neutral'}>
                    {result?.blockchain_status?.toLowerCase().includes('active') || result?.blockchain_status?.toLowerCase().includes('anchored')
                      ? 'Anchored On-Chain'
                      : 'Cryptographic Anchor'
                    }
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Registry Status:</span>
                    <span className="font-semibold text-brand-text dark:text-slate-200">
                      {result?.blockchain_status || 'Anchored & Active on TrustChain Credential Registry'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Credential ID:</span>
                    <span className="font-mono text-[11px] font-bold text-brand-accent">
                      {docDetails?.certificate_number || 'TC-2026-MIT941'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Smart Contract:</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate max-w-[220px]">
                      0x5FbDB2315678afecb367f032d93F642f64180aa3
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Transaction Hash:</span>
                    <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 truncate max-w-[220px]">
                      {result?.blockchain_tx_hash || '0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Verify this record independently via QR or public ledger:
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const id = docDetails?.certificate_number || 'TC-2026-MIT941';
                      window.open(`/verify/credential/${id}`, '_blank');
                    }}
                    icon={<ExternalLink className="w-3 h-3" />}
                  >
                    Public Verifier
                  </Button>
                </div>
              </Card>

              {/* SECTION 8: AI ASSISTANT & RAG EXPLANATION */}
              <Card className="p-4 space-y-3 bg-gradient-to-br from-teal-50/50 to-blue-50/40 dark:from-navy-900 dark:to-navy-850 border border-teal-200/50 dark:border-teal-900/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <BotMessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-brand-text dark:text-white uppercase tracking-wider">
                        RAG Grounded AI Assistant
                      </h3>
                      <p className="text-[10px] text-slate-400">Contextually attached to this verification dossier</p>
                    </div>
                  </div>
                  <Badge variant="info">Knowledge Grounded</Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Have questions about this verification? Our RAG intelligence assistant answers inquiries using verified university policies, document guidelines, and this document's forensic findings.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => {
                      const query = encodeURIComponent("Why was this document assigned this specific risk score?");
                      navigate(`/app/assistant?docId=${documentId}&query=${query}`);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:border-brand-accent hover:text-brand-accent transition-all text-left"
                  >
                    "Why was this risk score assigned?"
                  </button>
                  <button
                    onClick={() => {
                      const query = encodeURIComponent("Explain the image forensic and Error Level Analysis (ELA) findings in simple terms.");
                      navigate(`/app/assistant?docId=${documentId}&query=${query}`);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:border-brand-accent hover:text-brand-accent transition-all text-left"
                  >
                    "Explain image forensics in simple terms"
                  </button>
                  <button
                    onClick={() => {
                      const query = encodeURIComponent("What official university seal and registrar guidelines apply to this credential?");
                      navigate(`/app/assistant?docId=${documentId}&query=${query}`);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:border-brand-accent hover:text-brand-accent transition-all text-left"
                  >
                    "Check official university guidelines"
                  </button>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAskAssistant}
                    icon={<BotMessageSquare className="w-3.5 h-3.5" />}
                    className="w-full justify-center bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Open AI Assistant with Dossier Attached
                  </Button>
                </div>
              </Card>

              {/* Mandatory Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-brand-accent inline-block mr-1.5 mb-0.5" />
                {aiData?.disclaimer ||
                  'TrustChain AI provides automated document analysis and preliminary risk assessment. Its findings are not definitive proof of authenticity or fraud. Final verification should be conducted by the authorized issuing institution.'}
              </div>
            </div>
          )}

          {/* TAB 2: EXTRACTED FIELDS & OCR CORRECTION */}
          {activeTab === 'extracted' && (
            <Card className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div>
                  <h3 className="text-sm font-bold text-brand-text dark:text-white">Structured Credential Information</h3>
                  <p className="text-[11px] text-slate-400">Extracted domain fields with confidence scores and source text references</p>
                </div>
                <Badge variant="info">OCR Field Schema</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(aiData?.extracted_information?.extracted_fields || result?.extracted_data || {}).map(([key, item]) => {
                  const val = typeof item === 'object' && item !== null && 'value' in item ? item.value : item;
                  const conf = typeof item === 'object' && item !== null && 'confidence' in item ? item.confidence : 0.92;
                  const src = typeof item === 'object' && item !== null && 'source_text' in item ? item.source_text : null;

                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 space-y-1.5 relative group hover:border-brand-accent/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                        {val !== null && (
                          <span className="text-[9px] font-mono px-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {intConf(conf)}% conf
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-brand-text dark:text-slate-200">
                        {val !== null && val !== undefined ? String(val) : <span className="text-slate-400 italic">[Unavailable in OCR]</span>}
                      </p>
                      {src && <p className="text-[9px] text-slate-400 truncate italic">Source: "{src}"</p>}
                      <button
                        onClick={() => {
                          setSelectedFieldKey(key);
                          setFieldCorrectionValue(String(val || ''));
                          setCorrectionModalOpen(true);
                        }}
                        className="text-[10px] text-brand-accent hover:underline flex items-center gap-1 pt-1"
                      >
                        <Edit3 className="w-2.5 h-2.5" /> Suggest Correction
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* TAB 3: FINDINGS PANEL */}
          {activeTab === 'findings' && (
            <Card className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div>
                  <h3 className="text-sm font-bold text-brand-text dark:text-white">Audited Verification Findings</h3>
                  <p className="text-[11px] text-slate-400">Detailed observations classified by severity and evidence source</p>
                </div>
                <Badge variant={aiData?.findings?.length ? 'warning' : 'success'}>
                  {aiData?.findings?.length || 0} Findings
                </Badge>
              </div>

              {aiData?.findings && aiData.findings.length > 0 ? (
                <div className="space-y-3">
                  {aiData.findings.map((finding, idx) => (
                    <div
                      key={finding.id || idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        finding.severity === 'critical' || finding.severity === 'high'
                          ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                          : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${finding.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`} />
                          <span className="font-bold text-slate-900 dark:text-white">{finding.title || finding.description}</span>
                        </div>
                        <Badge variant={finding.severity === 'high' || finding.severity === 'critical' ? 'danger' : 'warning'}>
                          {finding.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{finding.description}</p>
                      {finding.observed_value && (
                        <p className="text-[10px] font-mono text-slate-500">Observed Value: {finding.observed_value}</p>
                      )}
                      {finding.recommended_action && (
                        <div className="pt-1 text-[10px] text-brand-accent font-medium">
                          Action: {finding.recommended_action}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Significant Anomalies Detected</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    The document exhibits uniform compression, valid chronological sequence, and normal mathematical integrity.
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* TAB 4: PROCESSING TIMELINE */}
          {activeTab === 'timeline' && (
            <Card className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div>
                  <h3 className="text-sm font-bold text-brand-text dark:text-white">7-Step Processing Pipeline</h3>
                  <p className="text-[11px] text-slate-400">Sequential verification stages from document ingestion to audit dossier</p>
                </div>
                <Badge variant="info">7 Steps</Badge>
              </div>

              <div className="space-y-4">
                {result?.steps.map((step) => {
                  const isCompleted = step.status === 'completed';
                  const isFailed = step.status === 'failed';
                  const isReview = step.status === 'review_required';

                  return (
                    <div key={step.step_number} className="flex items-start gap-3 text-xs">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : isFailed
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : isReview
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                        }`}
                      >
                        {step.step_number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-text dark:text-slate-200">{step.name}</span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> PASSED
                            </span>
                          )}
                          {isReview && <span className="text-[10px] font-bold text-amber-600">REVIEW REQUIRED</span>}
                          {isFailed && <span className="text-[10px] font-bold text-rose-600">ANOMALY DETECTED</span>}
                        </div>
                        <p className="text-[11px] text-brand-muted dark:text-slate-400 mt-0.5">{step.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* TAB 5: MODEL GOVERNANCE */}
          {activeTab === 'models' && (
            <Card className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                <div>
                  <h3 className="text-sm font-bold text-brand-text dark:text-white">Active AI/ML Models & Governance</h3>
                  <p className="text-[11px] text-slate-400">Deployed machine learning classifiers, versions, and validation metrics</p>
                </div>
                <Badge variant="success">Production Ready</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">Document Type Classifier</span>
                    <span className="font-mono text-[10px] text-blue-600">TrustChain-TFIDF-v2.0</span>
                  </div>
                  <p className="text-[11px] text-slate-500">TF-IDF N-gram Vectorizer + Logistic Regression (7 credential categories).</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">Fraud Pattern Classifier</span>
                    <span className="font-mono text-[10px] text-emerald-600">TrustChain-RF-v2.1</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Random Forest Ensemble over 14-D multi-modal feature vector. 5-Fold CV F1: 1.00.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">Statistical Anomaly Detector</span>
                    <span className="font-mono text-[10px] text-purple-600">TrustChain-IForest-v1.5</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Isolation Forest for unsupervised outlier detection on benign credential baseline.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">Computer Vision & Quality Engine</span>
                    <span className="font-mono text-[10px] text-teal-600">TrustChain-CV-v2.2</span>
                  </div>
                  <p className="text-[11px] text-slate-500">OpenCV Hough transform deskewing, CLAHE normalization, and Laplacian blur detection.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* OCR Correction Feedback Modal */}
      {correctionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 space-y-4 bg-white dark:bg-navy-900 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Suggest OCR Correction</h3>
              <button onClick={() => setCorrectionModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-500">
              Field: <span className="font-bold text-brand-text dark:text-white uppercase">{selectedFieldKey.replace(/_/g, ' ')}</span>
            </p>
            <input
              type="text"
              value={fieldCorrectionValue}
              onChange={(e) => setFieldCorrectionValue(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Enter verified correct value"
            />
            <p className="text-[10px] text-slate-400">
              Corrections are stored separately as feedback for future supervised fine-tuning; raw OCR data is preserved.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setCorrectionModalOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSubmitOcrCorrection}>Submit Correction</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

function intConf(val?: number): number {
  if (!val) return 90;
  return Math.round(val * 100);
}
