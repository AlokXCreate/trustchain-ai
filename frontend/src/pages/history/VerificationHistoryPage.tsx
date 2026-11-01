import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { DocumentItem, DocumentCategory, VerificationStatus } from '../../types';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const VerificationHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<DocumentItem[]>('/documents/list', {
        search: search || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
      setDocuments(data);
    } catch {
      // Fallback demo data
      setDocuments([
        {
          id: 'doc_demo_degree_01',
          name: 'Stanford_University_BS_Computer_Science.pdf',
          category: 'degree',
          file_type: 'application/pdf',
          file_size_bytes: 2458000,
          issuer_name: 'Stanford University',
          certificate_number: 'STAN-CS-2024-8841',
          uploaded_by: 'usr_01',
          status: 'verified',
          created_at: '2026-10-25T10:00:00Z',
        },
        {
          id: 'doc_demo_marksheet_02',
          name: 'Official_Academic_Transcript_Sem8.pdf',
          category: 'marksheet',
          file_type: 'application/pdf',
          file_size_bytes: 1840000,
          issuer_name: 'Massachusetts Institute of Technology',
          certificate_number: 'MIT-TR-2025-0194',
          uploaded_by: 'usr_01',
          status: 'verified',
          created_at: '2026-10-28T14:30:00Z',
        },
        {
          id: 'doc_demo_internship_03',
          name: 'Google_DeepMind_Research_Certificate.png',
          category: 'internship',
          file_type: 'image/png',
          file_size_bytes: 985000,
          issuer_name: 'Google DeepMind',
          certificate_number: 'DM-INT-2025-77',
          uploaded_by: 'usr_01',
          status: 'analyzed',
          created_at: '2026-10-30T09:15:00Z',
        },
        {
          id: 'doc_demo_suspicious_04',
          name: 'Dubious_FastTrack_Diploma_Certificate.pdf',
          category: 'skill',
          file_type: 'application/pdf',
          file_size_bytes: 620000,
          issuer_name: 'Global Tech Skills Academy',
          certificate_number: 'FAKE-CERT-991',
          uploaded_by: 'usr_01',
          status: 'review_required',
          created_at: '2026-10-31T18:00:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this document record?')) return;
    try {
      await api.delete(`/documents/${docId}`);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  const exportCSV = () => {
    const headers = ['Document Name', 'Category', 'Issuer', 'Certificate ID', 'Status', 'Date'];
    const rows = documents.map((d) => [
      d.name,
      d.category,
      d.issuer_name || 'N/A',
      d.certificate_number || 'N/A',
      d.status,
      new Date(d.created_at).toLocaleDateString(),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trustchain_verification_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'review_required':
        return <Badge variant="warning">Review Required</Badge>;
      case 'analyzed':
        return <Badge variant="info">Analyzed</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="neutral">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight">
            Verification History
          </h1>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
            Search, filter, and audit all documents and forensic dossiers submitted to TrustChain.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/upload')}
          >
            Verify New Document
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by document name, certificate number, or issuer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="degree">Degree</option>
              <option value="marksheet">Marksheet</option>
              <option value="internship">Internship</option>
              <option value="training">Training</option>
              <option value="experience">Experience</option>
              <option value="skill">Skill</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="review_required">Review Required</option>
              <option value="analyzed">Analyzed</option>
              <option value="failed">Failed</option>
            </select>

            <Button type="submit" variant="secondary" size="sm">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* History Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Issuer</th>
                <th className="py-3 px-4">Cert Number</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Blockchain</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60 text-xs">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No documents found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-brand-text dark:text-slate-200 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-accent flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{doc.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 capitalize">
                      {doc.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {doc.issuer_name || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {doc.certificate_number || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                        {doc.status === 'verified' ? 'Sepolia Ready' : 'Unanchored'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/app/verify/${doc.id}`)}
                        className="text-xs font-semibold text-brand-accent hover:underline inline-flex items-center gap-1"
                      >
                        Dossier <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
