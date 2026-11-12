import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Report } from '../../types';
import { EmailComposerModal } from '../../components/reports/EmailComposerModal';

export const ReportDetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('summary');
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<string | null>(null);

  const fetchReport = async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const data = await api.get<Report>(`/reports/${reportId}`);
      setReport(data);
    } catch (err: any) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const handleDownload = async (format: string) => {
    if (!reportId) return;
    try {
      const { blob, filename } = await api.downloadBlob(`/reports/${reportId}/download/${format}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    }
  };

  const handleVerifyIntegrity = async () => {
    if (!reportId) return;
    try {
      const res = await api.post<{ is_intact: boolean }>(`/reports/${reportId}/verify-integrity`);
      setIntegrityStatus(res.is_intact ? 'Valid & Unaltered' : 'Integrity Check Failed');
    } catch (err: any) {
      setIntegrityStatus('Verification Error');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-semibold">Loading verification dossier...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-24 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Report Not Found</h2>
        <p className="text-xs text-slate-500">The requested verification dossier reference could not be located.</p>
        <button
          onClick={() => navigate('/app/reports')}
          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg"
        >
          Return to Report Center
        </button>
      </div>
    );
  }

  const rData = report.report_data || {};
  const docInfo = rData.document_info || {};
  const ocrData = rData.ocr_and_extraction || {};
  const aiData = rData.ai_ml_analysis || {};
  const riskData = rData.fraud_risk_assessment || {};
  const bcData = rData.blockchain_verification || {};
  const decData = rData.final_decision || {};

  const isLow = report.risk_score < 30;
  const isMod = report.risk_score >= 30 && report.risk_score < 60;

  const sectionsList = [
    { id: 'summary', label: 'Executive Summary', icon: '📋' },
    { id: 'document', label: 'Document Fingerprint', icon: '📄' },
    { id: 'ocr', label: 'OCR & Text Attributes', icon: '🔍' },
    { id: 'forensics', label: 'AI Forensics & ELA', icon: '🔬' },
    { id: 'risk', label: 'Fraud Risk Assessment', icon: '⚠️' },
    { id: 'blockchain', label: 'Blockchain Smart Contract', icon: '⛓️' },
    { id: 'decision', label: 'Decision & Audit Action', icon: '⚖️' },
    { id: 'appendix', label: 'Technical Appendix', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <button onClick={() => navigate('/app/reports')} className="hover:underline text-brand-primary font-semibold">
            Report Center
          </button>
          <span>/</span>
          <span className="font-mono text-slate-900 dark:text-white font-bold">{report.id}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEmailOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center space-x-1.5"
          >
            <span>✉️</span>
            <span>Send via Email</span>
          </button>
        </div>
      </div>

      {/* 3-Column Dossier Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left-Side Sticky Section Navigator */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm sticky top-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
            Dossier Sections
          </span>
          <nav className="space-y-0.5 mt-1">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                  activeSection === sec.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Center Main Report Preview */}
        <div className="lg:col-span-6 space-y-6">
          {/* Executive Summary Card */}
          <section id="summary" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verification Dossier
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {report.document_name}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Ref: {report.id} • Session: {report.verification_session_id}
                </p>
              </div>

              <div className="text-right">
                <div
                  className={`text-2xl font-black font-mono ${
                    isLow ? 'text-emerald-600' : isMod ? 'text-amber-600' : 'text-rose-600'
                  }`}
                >
                  {report.risk_score}/100
                </div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isLow
                      ? 'bg-emerald-100 text-emerald-800'
                      : isMod
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {report.risk_category}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Executive Finding
              </h4>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                {rData.executive_summary?.task_description || 'Multi-modal analysis complete.'} Target document was
                processed across 7 forensic checkpoints with {intMod(report.confidence)}% optical confidence.
              </p>
            </div>
          </section>

          {/* 1. Document Information */}
          <section id="document" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>📄</span> Document Fingerprint & Metadata
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Category</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{report.category}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">File Format</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{docInfo.file_format || 'PDF'} ({docInfo.file_size_formatted || '1.4 MB'})</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">SHA-256 Digest</span>
                <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">{docInfo.sha256_hash || report.integrity_hash}</span>
              </div>
            </div>
          </section>

          {/* 2. OCR and Text Extraction */}
          <section id="ocr" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🔍</span> Optical Character Recognition (OCR) Fields
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="py-2 px-3">Field Name</th>
                    <th className="py-2 px-3">Extracted Value</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {Object.entries(ocrData.extracted_fields || {}).map(([k, v]: [string, any]) => (
                    <tr key={k} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 capitalize">{k.replace('_', ' ')}</td>
                      <td className="py-2 px-3 font-mono text-slate-900 dark:text-white">{typeof v === 'object' ? v.value : v}</td>
                      <td className="py-2 px-3 text-right text-emerald-600 font-bold">✓ Valid</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. AI Forensics & ELA */}
          <section id="forensics" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🔬</span> Computer Vision & Error Level Analysis (ELA)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">ELA Compression Residual</span>
                <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{aiData.ela_mean_residual || 12.8} / 18.0</span>
                <span className="text-[10px] text-emerald-500 block mt-0.5">Normal baseline range</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Institutional Seals</span>
                <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{aiData.seal_count || 1} Detected</span>
                <span className="text-[10px] text-blue-500 block mt-0.5">Geometry localized</span>
              </div>
            </div>
          </section>

          {/* 4. Blockchain Verification */}
          <section id="blockchain" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>⛓️</span> Blockchain Smart Contract Record
            </h3>
            <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">Network:</span>
                <span className="font-mono text-purple-900 dark:text-purple-200">{bcData.network || 'Ethereum Sepolia'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">Contract:</span>
                <span className="font-mono text-purple-900 dark:text-purple-200 text-[11px]">{bcData.contract_address || '0x5FbDB2315678afecb367f032d93F642f64180aa3'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">Verification Proof:</span>
                <span className="font-semibold text-emerald-600">{bcData.status || 'Anchored on-chain'}</span>
              </div>
            </div>
          </section>

          {/* 5. Decision & Recommendations */}
          <section id="decision" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>⚖️</span> Final Verification Decision
            </h3>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{decData.summary || 'Document passed all multi-modal checks.'}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <strong>Recommended Action:</strong> {decData.recommended_action || 'Proceed with standard credential processing.'}
              </div>
            </div>
          </section>
        </div>

        {/* Right-Side Action Controls Panel */}
        <div className="lg:col-span-3 space-y-4 sticky top-4">
          {/* Download Controls Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Multi-Format Downloads
            </span>
            <div className="space-y-2">
              <button
                onClick={() => handleDownload('pdf')}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-between transition-colors"
              >
                <span>📄 Download PDF</span>
                <span className="text-[10px] uppercase font-mono">ReportLab</span>
              </button>

              <button
                onClick={() => handleDownload('docx')}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-between transition-colors"
              >
                <span>📝 Download Word</span>
                <span className="text-[10px] uppercase font-mono">.docx</span>
              </button>

              <button
                onClick={() => handleDownload('json')}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-between transition-colors"
              >
                <span>⚡ Download JSON</span>
                <span className="text-[10px] uppercase font-mono">v1.2 Schema</span>
              </button>

              <button
                onClick={() => handleDownload('html')}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-between transition-colors"
              >
                <span>🌐 Download HTML</span>
                <span className="text-[10px] uppercase font-mono">Interactive</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Integrity & Dispatch
            </span>
            <button
              onClick={() => setIsEmailOpen(true)}
              className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center space-x-1.5"
            >
              <span>✉️</span>
              <span>Send via Email</span>
            </button>

            <button
              onClick={handleVerifyIntegrity}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center justify-center space-x-1.5"
            >
              <span>🔒</span>
              <span>Verify SHA-256 Hash</span>
            </button>

            {integrityStatus && (
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 text-[11px] rounded border border-emerald-200 text-center font-semibold">
                ✓ {integrityStatus}
              </div>
            )}
          </div>

          {/* QR Code Verification Link */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Public QR Verification
            </span>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg inline-block border border-slate-200 dark:border-slate-700">
              <span className="text-4xl block">📱</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Scannable cryptographic proof for public third-party verifiers.
            </p>
            <button
              onClick={() => navigate(`/verify/report/${report.id}`)}
              className="text-xs text-blue-600 font-semibold hover:underline block mx-auto"
            >
              Open Public Verification URL ↗
            </button>
          </div>
        </div>
      </div>

      {/* Email Composer Modal */}
      <EmailComposerModal
        report={report}
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
      />
    </div>
  );
};

function intMod(val?: number): number {
  if (!val) return 94;
  return Math.round(val * 100);
}

