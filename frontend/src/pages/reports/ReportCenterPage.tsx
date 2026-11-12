import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ReportSummary, ReportDashboardStats } from '../../types';
import { EmailComposerModal } from '../../components/reports/EmailComposerModal';
import { ReportCompareModal } from '../../components/reports/ReportCompareModal';

export const ReportCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [stats, setStats] = useState<ReportDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [isArchived, setIsArchived] = useState(false);

  // Modals state
  const [emailModalReport, setEmailModalReport] = useState<ReportSummary | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<{
    reportId: string;
    isIntact: boolean;
    hash: string;
  } | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { is_archived: isArchived };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (riskFilter) params.risk_category = riskFilter;

      const res = await api.get<{ items: ReportSummary[]; stats: ReportDashboardStats }>('/reports', params);
      setReports(res.items || []);
      setStats(res.stats || null);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search, statusFilter, riskFilter, isArchived]);

  const handleDownload = async (reportId: string, format: string) => {
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

  const handleVerifyIntegrity = async (reportId: string) => {
    try {
      const res = await api.post<{ is_intact: boolean; recorded_hash: string }>(
        `/reports/${reportId}/verify-integrity`
      );
      setIntegrityResult({
        reportId,
        isIntact: res.is_intact,
        hash: res.recorded_hash,
      });
    } catch (err: any) {
      alert(`Integrity check failed: ${err.message}`);
    }
  };

  const handleRegenerate = async (reportId: string) => {
    try {
      await api.post(`/reports/${reportId}/regenerate`);
      fetchReports();
    } catch (err: any) {
      alert(`Regeneration failed: ${err.message}`);
    }
  };

  const handleArchive = async (reportId: string, archiveState: boolean) => {
    try {
      await api.patch(`/reports/${reportId}/archive?archived=${archiveState}`);
      fetchReports();
    } catch (err: any) {
      alert(`Archive action failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>📊</span> Centralized Report Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise document verification dossiers, multi-format export engines, and audit logs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCompareOpen(true)}
            disabled={reports.length < 2}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
          >
            <span>⚖️</span>
            <span>Compare Dossiers</span>
          </button>

          <button
            onClick={() => navigate('/app/emails')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center space-x-1.5 shadow-sm"
          >
            <span>📬</span>
            <span>Email Delivery History</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Reports</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.total_reports ?? reports.length}
          </div>
          <span className="text-[11px] text-slate-400">Generated across all sessions</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Generated Today</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {stats?.today_reports ?? 0}
          </div>
          <span className="text-[11px] text-blue-500 font-medium">Active verification queue</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Verified / Low Risk</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats?.verified_reports ?? 0}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Passed all forensic gates</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Review Required</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {stats?.review_required_reports ?? 0}
          </div>
          <span className="text-[11px] text-amber-500 font-medium">Secondary inspection needed</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Tampered / High Risk</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {stats?.failed_reports ?? 0}
          </div>
          <span className="text-[11px] text-rose-500 font-medium">Forensic anomalies detected</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report ID, document name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <span className="absolute left-3 top-2 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Verification Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="review_required">Review Required Only</option>
            <option value="failed">Failed / Tampered</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Risk Tiers</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Moderate Risk">Moderate Risk</option>
            <option value="High Risk">High Risk</option>
            <option value="Critical Risk">Critical Risk</option>
          </select>

          <button
            onClick={() => setIsArchived(!isArchived)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              isArchived
                ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 text-amber-800'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {isArchived ? '📂 Showing Archived' : '📁 Active Only'}
          </button>
        </div>
      </div>

      {/* Reports Listing Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] uppercase border-b border-slate-200 dark:border-slate-800 font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Report Reference</th>
                <th className="py-3 px-4">Document / Type</th>
                <th className="py-3 px-4">Verification State</th>
                <th className="py-3 px-4">Risk Assessment</th>
                <th className="py-3 px-4">Generated</th>
                <th className="py-3 px-4">Four Formats</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading report records...</span>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No verification reports match your current filters.
                  </td>
                </tr>
              ) : (
                reports.map((r) => {
                  const isLow = r.risk_score < 30;
                  const isMod = r.risk_score >= 30 && r.risk_score < 60;

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Report ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        <button
                          onClick={() => navigate(`/app/reports/${r.id}`)}
                          className="hover:text-brand-primary hover:underline text-left"
                        >
                          {r.id}
                        </button>
                      </td>

                      {/* Document Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                          {r.document_name}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {r.category}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            r.status === 'verified'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                              : r.status === 'review_required'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300'
                          }`}
                        >
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-black font-mono text-sm ${
                              isLow ? 'text-emerald-600' : isMod ? 'text-amber-600' : 'text-rose-600'
                            }`}
                          >
                            {r.risk_score}/100
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">({r.risk_category})</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full ${
                              isLow ? 'bg-emerald-500' : isMod ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${r.risk_score}%` }}
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>

                      {/* 4 Export Formats */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleDownload(r.id, 'pdf')}
                            title="Download PDF Dossier"
                            className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold"
                          >
                            PDF
                          </button>
                          <button
                            onClick={() => handleDownload(r.id, 'docx')}
                            title="Download Word Document"
                            className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 border border-blue-200 text-[10px] font-bold"
                          >
                            DOCX
                          </button>
                          <button
                            onClick={() => handleDownload(r.id, 'json')}
                            title="Download JSON Schema"
                            className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-600 hover:bg-amber-100 border border-amber-200 text-[10px] font-bold"
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => handleDownload(r.id, 'html')}
                            title="Download HTML Web Report"
                            className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold"
                          >
                            HTML
                          </button>
                        </div>
                      </td>

                      {/* Action Menu */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => navigate(`/app/reports/${r.id}`)}
                            title="View Full Report"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => setEmailModalReport(r)}
                            title="Send via Email"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            ✉️
                          </button>
                          <button
                            onClick={() => handleVerifyIntegrity(r.id)}
                            title="Verify Checksum Integrity"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            🔒
                          </button>
                          <button
                            onClick={() => handleRegenerate(r.id)}
                            title="Regenerate Report"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            🔄
                          </button>
                          <button
                            onClick={() => handleArchive(r.id, !r.is_archived)}
                            title={r.is_archived ? 'Unarchive' : 'Archive'}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {r.is_archived ? '📂' : '📁'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrity Verification Modal */}
      {integrityResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 text-2xl flex items-center justify-center mx-auto">
              ✓
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cryptographic Integrity Verified
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Dossier <span className="font-mono font-semibold">{integrityResult.reportId}</span> is authentic and has not been altered since generation.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-[11px] font-mono text-left break-all text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-400 uppercase text-[9px]">SHA-256 Checksum:</span>
              {integrityResult.hash}
            </div>
            <button
              onClick={() => setIntegrityResult(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Email Composer Modal */}
      <EmailComposerModal
        report={emailModalReport}
        isOpen={Boolean(emailModalReport)}
        onClose={() => setEmailModalReport(null)}
        onSuccess={() => setEmailModalReport(null)}
      />

      {/* Report Comparison Modal */}
      <ReportCompareModal
        reports={reports}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
};

