import React, { useState, useEffect } from 'react';
import {
  Layers,
  Upload,
  FileCheck2,
  AlertTriangle,
  Download,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { BatchItem } from '../../types';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const BulkVerificationPage: React.FC = () => {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch_apex_01');
  const [isUploading, setIsUploading] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchSearch, setBatchSearch] = useState('');

  const fetchBatches = async () => {
    try {
      const data = await api.get<BatchItem[]>('/bulk/batches');
      setBatches(data);
      if (data.length > 0 && !selectedBatchId) {
        setSelectedBatchId(data[0].id);
      }
    } catch {
      // Fallback demo batches
      setBatches([
        {
          id: 'batch_apex_01',
          batch_name: 'Q4 Graduate Hiring - Batch 01',
          uploaded_by: 'usr_verif_01',
          total_documents: 24,
          processed_documents: 24,
          verified_count: 21,
          flagged_count: 2,
          failed_count: 1,
          status: 'completed',
          created_at: '2026-10-28T10:00:00Z',
          completed_at: '2026-10-28T10:04:12Z',
        },
        {
          id: 'batch_apex_02',
          batch_name: 'Global Engineering Interns 2026',
          uploaded_by: 'usr_verif_01',
          total_documents: 12,
          processed_documents: 12,
          verified_count: 11,
          flagged_count: 1,
          failed_count: 0,
          status: 'completed',
          created_at: '2026-10-30T14:20:00Z',
          completed_at: '2026-10-30T14:22:45Z',
        },
      ]);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSimulatedBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // Mock upload 10 candidate files
      const newBatch: BatchItem = {
        id: `batch_${Date.now().toString().slice(-6)}`,
        batch_name: batchName || 'Enterprise Candidate Batch',
        uploaded_by: 'usr_verif_01',
        total_documents: 15,
        processed_documents: 15,
        verified_count: 14,
        flagged_count: 1,
        failed_count: 0,
        status: 'completed',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      };
      setBatches([newBatch, ...batches]);
      setSelectedBatchId(newBatch.id);
      setBatchName('');
    } finally {
      setIsUploading(false);
    }
  };

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const candidateItems = [
    { name: 'Alex Mercer', doc: 'Stanford_BS_CS.pdf', status: 'verified', risk: 0.02, findings: 'Authentic Seal & Layout' },
    { name: 'Marcus Chen', doc: 'MIT_Masters_Transcript.pdf', status: 'verified', risk: 0.04, findings: 'Verified Registrar Signature' },
    { name: 'Sarah Jenkins', doc: 'Dubious_Certificate.pdf', status: 'review_required', risk: 0.88, findings: 'Unaccredited Issuer Domain' },
    { name: 'David Kim', doc: 'Google_Internship_Letter.png', status: 'verified', risk: 0.03, findings: 'Official Corporate Key Match' },
    { name: 'Elena Rostova', doc: 'Oxford_Diploma_Scan.pdf', status: 'verified', risk: 0.05, findings: 'Cryptographic Hash Valid' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight">
            Bulk Verification Suite
          </h1>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
            Automated batch ingestion and multi-document verification queue for HR departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8,Candidate,Document,Status,RiskScore,Findings\nAlex Mercer,Stanford_BS_CS.pdf,VERIFIED,0.02,Authentic Seal\nSarah Jenkins,Dubious_Cert.pdf,REVIEW_REQUIRED,0.88,Unaccredited Issuer";
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `batch_verification_results.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download Batch CSV
          </Button>
        </div>
      </div>

      {/* Batch Upload Form */}
      <Card className="p-6">
        <form onSubmit={handleSimulatedBatchUpload} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              required
              placeholder="Enter batch label (e.g. Campus Hiring 2026 - Batch #3)..."
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-4 py-2.5 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isUploading}
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Batch Queue
          </Button>
        </form>
      </Card>

      {/* Selected Batch Metrics Bar */}
      {selectedBatch && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Candidates</span>
            <p className="text-2xl font-black text-brand-text dark:text-white mt-1">
              {selectedBatch.total_documents}
            </p>
          </Card>
          <Card>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Authentic</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {selectedBatch.verified_count}
            </p>
          </Card>
          <Card>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Review Required</span>
            <p className="text-2xl font-black text-amber-500 mt-1">
              {selectedBatch.flagged_count}
            </p>
          </Card>
          <Card>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Processing Status</span>
            <div className="mt-1">
              <Badge variant="success">{selectedBatch.status.toUpperCase()}</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Individual Documents Inside Selected Batch Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-text dark:text-white">
              {selectedBatch?.batch_name || 'Active Batch Queue'}
            </h3>
            <p className="text-[11px] text-brand-muted dark:text-slate-400 font-mono">
              Batch ID: {selectedBatch?.id}
            </p>
          </div>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate in batch..."
              value={batchSearch}
              onChange={(e) => setBatchSearch(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg pl-8 pr-3 py-1.5 text-brand-text dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-4">Candidate Name</th>
                <th className="py-2.5 px-4">Document File</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Risk Score</th>
                <th className="py-2.5 px-4">Forensic Findings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60">
              {candidateItems
                .filter((c) =>
                  batchSearch ? c.name.toLowerCase().includes(batchSearch.toLowerCase()) : true
                )
                .map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/30">
                    <td className="py-3 px-4 font-semibold text-brand-text dark:text-slate-200">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {item.doc}
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'verified' ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Review Required</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={item.risk > 0.5 ? 'text-rose-600' : 'text-emerald-600'}>
                        {item.risk.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {item.findings}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
