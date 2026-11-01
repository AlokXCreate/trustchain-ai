import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Search,
  Filter,
  Download,
  Lock,
  ShieldCheck,
  Calendar,
  User,
  ExternalLink,
  Copy,
  Hash,
} from 'lucide-react';
import { AuditLog, AuditEventType } from '../../types';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<AuditLog[]>('/audit/logs', {
        search: search || undefined,
        event_type: selectedEventType !== 'all' ? selectedEventType : undefined,
      });
      setLogs(data);
    } catch {
      // Fallback demo audit logs
      setLogs([
        {
          id: 'aud_06',
          user_id: 'usr_indiv_01',
          user_name: 'Alex Mercer',
          event_type: 'verification_completion',
          resource_id: 'doc_demo_degree_01',
          resource_type: 'document',
          event_details: 'Completed multi-stage verification analysis for degree certificate',
          ip_address: '127.0.0.1',
          tamper_evident_hash: '3a88c2f10b7194e35a98d02c4b819f7a5c6e8d1a2b3c4d5e6f7a8b9c0d1e2f3a',
          blockchain_tx_ref: '0x8f2d5a3e74b98c50f1a92e35b71904a5c',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'aud_05',
          user_id: 'usr_indiv_01',
          user_name: 'Alex Mercer',
          event_type: 'document_upload',
          resource_id: 'doc_demo_degree_01',
          resource_type: 'document',
          event_details: 'Uploaded Bachelor of Science in Computer Science certificate',
          ip_address: '127.0.0.1',
          tamper_evident_hash: '9f81a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8',
          blockchain_tx_ref: '0x8f2d4a3e74b98c40f1a92e35b71904a4c',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'aud_04',
          user_id: 'usr_verif_01',
          user_name: 'Marcus Chen',
          event_type: 'verification_request',
          resource_id: 'batch_apex_01',
          resource_type: 'batch',
          event_details: 'Bulk verification initiated for 24 candidate certificates',
          ip_address: '103.25.14.9',
          tamper_evident_hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
          blockchain_tx_ref: '0x8f2d3a3e74b98c30f1a92e35b71904a3c',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'aud_03',
          user_id: 'usr_inst_01',
          user_name: 'Dr. Eleanor Vance',
          event_type: 'credential_issuance',
          resource_id: 'TC-2026-MIT941',
          resource_type: 'credential',
          event_details: 'Digital Master of Science credential issued for Alex Mercer',
          ip_address: '18.9.22.4',
          tamper_evident_hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
          blockchain_tx_ref: '0x8f2d2a3e74b98c20f1a92e35b71904a2c',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedEventType]);

  const exportCSV = () => {
    const headers = ['Event ID', 'Event Type', 'User', 'Details', 'IP Address', 'SHA-256 Hash', 'Timestamp'];
    const rows = logs.map((l) => [
      l.id,
      l.event_type,
      l.user_name || l.user_id,
      `"${l.event_details.replace(/"/g, '""')}"`,
      l.ip_address || '127.0.0.1',
      l.tamper_evident_hash,
      l.timestamp,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trustchain_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventBadge = (type: AuditEventType) => {
    switch (type) {
      case 'verification_completion':
      case 'credential_issuance':
      case 'institution_approval':
        return <Badge variant="success">{type.replace('_', ' ').toUpperCase()}</Badge>;
      case 'document_upload':
      case 'verification_request':
        return <Badge variant="info">{type.replace('_', ' ').toUpperCase()}</Badge>;
      case 'document_deletion':
      case 'credential_revocation':
        return <Badge variant="danger">{type.replace('_', ' ').toUpperCase()}</Badge>;
      default:
        return <Badge variant="neutral">{type.replace('_', ' ').toUpperCase()}</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied hash to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight">
              Cryptographic Audit Trail
            </h1>
            <Badge variant="purple" size="sm">
              SHA-256 HASH CHAIN
            </Badge>
          </div>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
            Immutable, append-only log of every document event, user authentication, and credential state change.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          icon={<Download className="w-3.5 h-3.5" />}
        >
          Export Audit Trail (CSV)
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search event details, resource ID, or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            />
          </div>

          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none"
          >
            <option value="all">All Event Types</option>
            <option value="login">User Login</option>
            <option value="document_upload">Document Upload</option>
            <option value="verification_request">Verification Request</option>
            <option value="verification_completion">Verification Completion</option>
            <option value="credential_issuance">Credential Issuance</option>
            <option value="credential_revocation">Credential Revocation</option>
            <option value="institution_approval">Institution Approval</option>
          </select>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Cryptographic Hash (SHA-256)</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand-accent">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    {getEventBadge(log.event_type)}
                  </td>
                  <td className="py-3 px-4 font-sans text-brand-text dark:text-slate-200 font-semibold">
                    {log.user_name || log.user_id}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {log.event_details}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <span className="truncate inline-block max-w-[140px] align-middle">
                      {log.tamper_evident_hash}
                    </span>
                    <button
                      onClick={() => copyToClipboard(log.tamper_evident_hash)}
                      className="ml-1.5 p-1 rounded hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-400 inline"
                      title="Copy full hash"
                    >
                      <Copy className="w-3 h-3 inline" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans text-[10px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-xs text-brand-accent hover:underline font-semibold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title="Audit Block Inspection"
          subtitle={`Event ID: ${selectedLog.id}`}
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Event Type:</span>
                <span className="font-bold uppercase text-brand-accent">{selectedLog.event_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Actor User:</span>
                <span className="font-semibold text-brand-text dark:text-white">{selectedLog.user_name} ({selectedLog.user_id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IP Address:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedLog.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-700 dark:text-slate-300">{new Date(selectedLog.timestamp).toISOString()}</span>
              </div>
              {selectedLog.resource_id && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Resource Target:</span>
                  <span className="text-brand-teal">{selectedLog.resource_id}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Chained SHA-256 Digest</span>
              <p className="p-3 bg-navy-950 text-emerald-400 rounded-xl break-all text-[11px] border border-navy-800">
                {selectedLog.tamper_evident_hash}
              </p>
            </div>

            {selectedLog.blockchain_tx_ref && (
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Sepolia Transaction Reference</span>
                <p className="p-3 bg-navy-950 text-blue-400 rounded-xl break-all text-[11px] border border-navy-800">
                  {selectedLog.blockchain_tx_ref}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
