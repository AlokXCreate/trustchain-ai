import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ReportSummary, ReportCompareResult } from '../../types';

interface ReportCompareModalProps {
  reports: ReportSummary[];
  initialReportId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportCompareModal: React.FC<ReportCompareModalProps> = ({
  reports,
  initialReportId,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [id1, setId1] = useState(initialReportId || (reports[0]?.id || ''));
  const [id2, setId2] = useState(reports[1]?.id || (reports[0]?.id || ''));
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<ReportCompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runComparison = async () => {
    if (!id1 || !id2) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<ReportCompareResult>('/reports/compare', { id1, id2 });
      setCompareData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to compare reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id1 && id2 && id1 !== id2) {
      runComparison();
    }
  }, [id1, id2]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚖️</span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dual Verification Dossier Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Side-by-side forensic, optical extraction, and risk delta analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Selector Bar */}
        <div className="p-4 bg-blue-50/50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Dossier (Baseline)
            </label>
            <select
              value={id1}
              onChange={(e) => setId1(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} — {r.document_name} ({r.risk_category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Dossier (Comparison)
            </label>
            <select
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} — {r.document_name} ({r.risk_category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-500">
              <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-xs font-semibold">Computing forensic variance & optical field diff...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold border border-rose-200">
              {error}
            </div>
          )}

          {compareData && !loading && (
            <>
              {/* Metrics Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Risk Delta</div>
                  <div
                    className={`text-xl font-bold mt-0.5 ${
                      compareData.metrics.risk_score_delta > 0
                        ? 'text-rose-600'
                        : compareData.metrics.risk_score_delta < 0
                        ? 'text-emerald-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {compareData.metrics.risk_score_delta > 0 ? '+' : ''}
                    {compareData.metrics.risk_score_delta} pts
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Status Continuity</div>
                  <div className="text-sm font-bold mt-1.5 text-slate-900 dark:text-white">
                    {compareData.metrics.status_changed ? '⚠️ Divergent' : '✓ Identical'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Field Matches</div>
                  <div className="text-xl font-bold mt-0.5 text-emerald-600">
                    {compareData.metrics.field_matches}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Field Mismatches</div>
                  <div className="text-xl font-bold mt-0.5 text-amber-600">
                    {compareData.metrics.field_mismatches}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Report 1 */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                    Dossier A
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {compareData.report_1.document_name}
                  </h4>
                  <div className="mt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <p>Reference: <span className="font-mono">{compareData.report_1.id}</span></p>
                    <p>Status: <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{compareData.report_1.status}</span></p>
                    <p>Risk Score: <span className="font-bold text-blue-600">{compareData.report_1.risk_score}/100</span> ({compareData.report_1.risk_category})</p>
                  </div>
                </div>

                {/* Report 2 */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded">
                    Dossier B
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {compareData.report_2.document_name}
                  </h4>
                  <div className="mt-2 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <p>Reference: <span className="font-mono">{compareData.report_2.id}</span></p>
                    <p>Status: <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{compareData.report_2.status}</span></p>
                    <p>Risk Score: <span className="font-bold text-indigo-600">{compareData.report_2.risk_score}/100</span> ({compareData.report_2.risk_category})</p>
                  </div>
                </div>
              </div>

              {/* Optical Attributes Comparison Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  OCR Extracted Field Values & Diff
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Field</th>
                        <th className="py-2.5 px-3">Dossier A Value</th>
                        <th className="py-2.5 px-3">Dossier B Value</th>
                        <th className="py-2.5 px-3 text-center">Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {compareData.field_comparisons.map((f, idx) => (
                        <tr
                          key={idx}
                          className={f.is_matching ? 'hover:bg-slate-50/50' : 'bg-amber-50/30 dark:bg-amber-950/20'}
                        >
                          <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">{f.field}</td>
                          <td className="py-2 px-3 font-mono text-slate-700 dark:text-slate-300">{f.val_report_1}</td>
                          <td className="py-2 px-3 font-mono text-slate-700 dark:text-slate-300">{f.val_report_2}</td>
                          <td className="py-2 px-3 text-center">
                            {f.is_matching ? (
                              <span className="text-emerald-600 font-bold">✓ Match</span>
                            ) : (
                              <span className="text-amber-600 font-bold">≠ Discrepancy</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

