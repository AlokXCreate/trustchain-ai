import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  QrCode,
  ShieldAlert,
  Building2,
  Share2,
  Calendar,
  Download,
  AlertTriangle,
  Lock,
  Upload,
  FileCheck2,
  RefreshCw,
  Info,
  Check,
} from 'lucide-react';
import { Credential, CredentialStatus, DocumentCategory, BlockchainStatusResponse, BlockchainVerifyResponse } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const DigitalCredentialsPage: React.FC = () => {
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'my' | 'issued' | 'verify' | 'blockchain'>('my');
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Blockchain Telemetry
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatusResponse | null>(null);

  // Verification tab state
  const [verifyMethod, setVerifyMethod] = useState<'id' | 'file' | 'qr'>('id');
  const [verifyId, setVerifyId] = useState('TC-2026-MIT941');
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyQrText, setVerifyQrText] = useState('');
  const [verifyResult, setVerifyResult] = useState<BlockchainVerifyResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Issue Credential Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [holderEmail, setHolderEmail] = useState('');
  const [credentialType, setCredentialType] = useState<DocumentCategory>('degree');
  const [programOrCourse, setProgramOrCourse] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [gradeOrScore, setGradeOrScore] = useState('');
  const [issueFile, setIssueFile] = useState<File | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);

  // Selected Credential for Detail View
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchCredentialsAndStatus = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Credential[]>('/credentials/list');
      setCredentials(data);
    } catch {
      setCredentials([
        {
          id: 'cred_01',
          credential_id: 'TC-2026-MIT941',
          holder_name: 'Alex Mercer',
          holder_email: 'individual@trustchain.ai',
          issuing_institution: 'Massachusetts Institute of Technology (MIT)',
          credential_type: 'degree',
          program_or_course: 'Master of Science in Electrical Engineering & CS',
          issue_date: '2025-06-15',
          status: 'active',
          blockchain_tx_hash: '0x4a9d72e81b6f0c3a5982e4f019c8d23e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f',
          qr_payload: 'http://localhost:5173/verify/credential/TC-2026-MIT941',
          grade_or_score: 'GPA 4.0 / Summa Cum Laude',
          skills: ['Distributed Systems', 'Cryptography', 'Computer Architecture'],
          created_at: new Date().toISOString(),
        },
        {
          id: 'cred_02',
          credential_id: 'TC-2026-STA302',
          holder_name: 'Alex Mercer',
          holder_email: 'individual@trustchain.ai',
          issuing_institution: 'Stanford University Registrar',
          credential_type: 'training',
          program_or_course: 'Advanced Deep Learning & Neural Network Verification',
          issue_date: '2025-11-20',
          status: 'active',
          blockchain_tx_hash: '0x7b2f4c1e8a9d0f3a5c6e2b4d1a9f0e8c3b5a7d9e1f4a6b8c0e2d4f6a8b0c2e4a',
          qr_payload: 'http://localhost:5173/verify/credential/TC-2026-STA302',
          grade_or_score: 'Distinction (98%)',
          skills: ['Deep Learning', 'PyTorch', 'Verification'],
          created_at: new Date().toISOString(),
        },
        {
          id: 'cred_03',
          credential_id: 'TC-2025-REV811',
          holder_name: 'James Foster',
          issuing_institution: 'Massachusetts Institute of Technology (MIT)',
          credential_type: 'internship',
          program_or_course: 'Quantum Computing Research Internship',
          issue_date: '2025-01-10',
          status: 'revoked',
          blockchain_tx_hash: '0x3e5a7b1c4e9f0d8a6b4c2e1f3a5b7d9e0f4a9d72e81b6f0c3a5982e4f019c8d2',
          qr_payload: 'http://localhost:5173/verify/credential/TC-2025-REV811',
          grade_or_score: 'Withdrawn',
          skills: ['Quantum Logic'],
          created_at: new Date().toISOString(),
        },
      ]);
    }

    try {
      const statusRes = await api.get<BlockchainStatusResponse>('/blockchain/status');
      setBlockchainStatus(statusRes);
    } catch {
      setBlockchainStatus({
        connected: false,
        network: 'Hardhat Localhost (ChainID: 31337)',
        rpc_url: 'http://127.0.0.1:8545',
        chain_id: 31337,
        contract_address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        contract_ready: true,
        total_registered: 3,
        mode: 'local_emulated_fallback',
        description: 'Smart Contract Credential Registry active in local dev mode',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentialsAndStatus();
  }, []);

  const handleIssueCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);
    try {
      let docHash: string | undefined = undefined;

      if (issueFile) {
        // Compute client-side SHA-256 for transparency
        const buffer = await issueFile.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        docHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      }

      const newCred = await api.post<Credential>('/credentials/issue', {
        holder_name: holderName,
        holder_email: holderEmail || undefined,
        credential_type: credentialType,
        program_or_course: programOrCourse,
        issue_date: issueDate,
        grade_or_score: gradeOrScore || undefined,
        skills: ['Verified Credential', 'Smart Contract Anchored'],
        metadata: docHash ? { document_hash: `0x${docHash}` } : {},
      });

      setCredentials((prev) => [newCred, ...prev]);
      setIsIssueModalOpen(false);

      // Reset form
      setHolderName('');
      setHolderEmail('');
      setProgramOrCourse('');
      setGradeOrScore('');
      setIssueFile(null);
      fetchCredentialsAndStatus();
    } catch (err: any) {
      alert(err.message || 'Issuance failed');
    } finally {
      setIsIssuing(false);
    }
  };

  const handleVerifyCredential = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      if (verifyMethod === 'file') {
        if (!verifyFile) {
          setVerifyError('Please choose a document file to verify.');
          setIsVerifying(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', verifyFile);
        if (verifyId.trim()) formData.append('credential_id', verifyId.trim());

        const res = await api.postForm<BlockchainVerifyResponse>(
          '/blockchain/credentials/verify-file',
          formData
        );
        setVerifyResult(res);
      } else {
        const targetId = (verifyMethod === 'qr' ? verifyQrText : verifyId).trim();
        if (!targetId) {
          setVerifyError('Please enter a credential ID to verify.');
          setIsVerifying(false);
          return;
        }

        let cleanId = targetId;
        if (cleanId.includes('/verify/credential/')) {
          cleanId = cleanId.split('/verify/credential/')[1]?.split('?')[0] || cleanId;
        }

        const res = await api.post<BlockchainVerifyResponse>('/blockchain/credentials/verify', {
          credential_id: cleanId,
        });
        setVerifyResult(res);
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Verification service was unreachable.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRevoke = async (credId: string) => {
    const reason = window.prompt('Specify revocation reason:');
    if (!reason) return;
    try {
      await api.post('/credentials/revoke', {
        credential_id: credId,
        reason,
      });
      fetchCredentialsAndStatus();
    } catch (err: any) {
      alert(err.message || 'Revocation failed');
    }
  };

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'verified':
        return <Badge variant="success">Active On-Chain</Badge>;
      case 'revoked':
        return <Badge variant="danger">Revoked</Badge>;
      case 'hash mismatch':
        return <Badge variant="danger">Hash Mismatch</Badge>;
      case 'expired':
        return <Badge variant="warning">Expired</Badge>;
      default:
        return <Badge variant="neutral">{status.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-brand-accent" />
            Digital Credential Management
          </h1>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
            Issue, verify, and revoke tamper-proof digital certificates with cryptographic SHA-256 smart contract anchoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(role === 'institution' || role === 'admin') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsIssueModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Issue New Credential
            </Button>
          )}
        </div>
      </div>

      {/* Blockchain Telemetry Pill Banner */}
      {blockchainStatus && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900/90 border border-slate-200 dark:border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {blockchainStatus.network}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">
                Contract: <span className="font-mono text-brand-accent">{blockchainStatus.contract_address.slice(0, 10)}...{blockchainStatus.contract_address.slice(-6)}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-300">
            <span>Registered: <strong>{blockchainStatus.total_registered}</strong></span>
            <span>Status: <strong className="text-emerald-500 uppercase">{blockchainStatus.mode === 'live_rpc' ? 'Live EVM RPC' : 'Local Fallback'}</strong></span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchCredentialsAndStatus}
              icon={<RefreshCw className="w-3 h-3 text-slate-400" />}
              className="text-[11px] py-1"
            >
              Sync
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-navy-800 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-3 transition-colors ${
            activeTab === 'my'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          My Credentials ({credentials.filter((c) => c.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('issued')}
          className={`pb-3 transition-colors ${
            activeTab === 'issued'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          All Institutional Records ({credentials.length})
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`pb-3 transition-colors ${
            activeTab === 'verify'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          Verify Credential
        </button>
      </div>

      {/* TAB 1 & 2: Grid of Credentials */}
      {(activeTab === 'my' || activeTab === 'issued') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials
            .filter((c) => (activeTab === 'my' ? c.status === 'active' : true))
            .map((cred) => (
              <Card
                key={cred.id}
                className="p-5 border border-slate-200 dark:border-navy-800 flex flex-col justify-between hover:shadow-md transition bg-white dark:bg-navy-900"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-brand-accent" />
                        <span className="font-mono text-xs font-bold text-brand-accent">
                          {cred.credential_id}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-brand-text dark:text-white mt-1 line-clamp-1">
                        {cred.program_or_course}
                      </h3>
                      <p className="text-xs text-brand-muted dark:text-slate-400 mt-0.5">
                        {cred.issuing_institution}
                      </p>
                    </div>
                    {getStatusBadge(cred.status)}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recipient:</span>
                      <span className="font-semibold">{cred.holder_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issue Date:</span>
                      <span>{cred.issue_date}</span>
                    </div>
                    {cred.blockchain_tx_hash && (
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-navy-800">
                        <span className="text-slate-400">On-Chain Tx:</span>
                        <span className="font-mono text-[10px] text-brand-teal truncate max-w-[120px]">
                          {cred.blockchain_tx_hash}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCredential(cred)}
                    icon={<QrCode className="w-3.5 h-3.5" />}
                  >
                    View QR Proof
                  </Button>

                  {(role === 'institution' || role === 'admin') && cred.status === 'active' && (
                    <button
                      onClick={() => handleRevoke(cred.credential_id)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* TAB 3: Multi-Method Blockchain Verification */}
      {activeTab === 'verify' && (
        <Card className="p-6 max-w-3xl mx-auto shadow-sm border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-brand-text dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-accent" />
              Direct Blockchain Registry Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify credentials through three independent pathways: Credential ID lookup, raw file SHA-256 byte comparison, or QR code link.
            </p>
          </div>

          {/* Sub-method tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-navy-950 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setVerifyMethod('id');
                setVerifyResult(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                verifyMethod === 'id'
                  ? 'bg-white dark:bg-navy-800 text-brand-accent shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Verify by ID
            </button>
            <button
              onClick={() => {
                setVerifyMethod('file');
                setVerifyResult(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                verifyMethod === 'file'
                  ? 'bg-white dark:bg-navy-800 text-brand-accent shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Verify by File (SHA-256)
            </button>
            <button
              onClick={() => {
                setVerifyMethod('qr');
                setVerifyResult(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                verifyMethod === 'qr'
                  ? 'bg-white dark:bg-navy-800 text-brand-accent shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Verify by QR Payload
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyCredential} className="space-y-4 text-xs">
            {verifyMethod === 'id' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Credential Identifier
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyId}
                    onChange={(e) => setVerifyId(e.target.value)}
                    placeholder="e.g. TC-2026-MIT941"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm"
                  />
                  <Button type="submit" variant="primary" disabled={isVerifying}>
                    {isVerifying ? 'Checking...' : 'Check Registry'}
                  </Button>
                </div>
              </div>
            )}

            {verifyMethod === 'file' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 dark:border-navy-700 rounded-xl p-5 text-center bg-slate-50/50 dark:bg-navy-950/50">
                  <FileCheck2 className="w-8 h-8 text-brand-accent mx-auto mb-1.5 opacity-80" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {verifyFile ? verifyFile.name : 'Select document file to hash & verify'}
                  </p>
                  <input
                    type="file"
                    id="doc-verify-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVerifyFile(e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="doc-verify-input"
                    className="mt-3 inline-block px-3 py-1.5 bg-white dark:bg-navy-800 border border-slate-300 dark:border-navy-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-100 transition"
                  >
                    {verifyFile ? 'Change File' : 'Choose Document'}
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyId}
                    onChange={(e) => setVerifyId(e.target.value)}
                    placeholder="Optional: Specific Credential ID to match against"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm"
                  />
                  <Button type="submit" variant="primary" disabled={isVerifying || !verifyFile}>
                    {isVerifying ? 'Comparing...' : 'Compare Hashes'}
                  </Button>
                </div>
              </div>
            )}

            {verifyMethod === 'qr' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paste QR Payload or Verification Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyQrText}
                    onChange={(e) => setVerifyQrText(e.target.value)}
                    placeholder="http://localhost:5173/verify/credential/TC-2026-MIT941"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm"
                  />
                  <Button type="submit" variant="primary" disabled={isVerifying || !verifyQrText.trim()}>
                    Verify URL
                  </Button>
                </div>
              </div>
            )}
          </form>

          {verifyError && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}

          {/* Verification Results Panel */}
          {verifyResult && (
            <div className="pt-4 border-t border-slate-200 dark:border-navy-800 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                <div className="flex items-center gap-3">
                  {verifyResult.status === 'Verified' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {verifyResult.status === 'Verified'
                        ? 'Credential Confirmed Authentic'
                        : verifyResult.status === 'Hash Mismatch'
                        ? 'Document Integrity Mismatch'
                        : verifyResult.status === 'Revoked'
                        ? 'Revoked by Issuing Institution'
                        : 'Unregistered Record'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {verifyResult.message}
                    </p>
                  </div>
                </div>
                {getStatusBadge(verifyResult.status)}
              </div>

              {/* Hash match box */}
              <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Credential ID:</span>
                  <span className="font-mono font-bold text-brand-accent">
                    {verifyResult.credential_id || verifyId}
                  </span>
                </div>

                {verifyResult.document_hash && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">On-Chain SHA-256:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                      {verifyResult.document_hash}
                    </span>
                  </div>
                )}

                {verifyResult.computed_sha256 && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Uploaded File SHA-256:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                      {verifyResult.computed_sha256}
                    </span>
                  </div>
                )}

                {verifyResult.issuer && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Issuer Wallet:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400 truncate max-w-[280px]">
                      {verifyResult.issuer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Detail / QR Modal */}
      {selectedCredential && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCredential(null)}
          title="Digital Credential Certificate"
          subtitle={selectedCredential.credential_id}
        >
          <div className="space-y-5 text-xs">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800">
              <div className="p-3 bg-white rounded-xl shadow-md border border-slate-100">
                <QRCodeSVG
                  value={`http://localhost:5173/verify/credential/${selectedCredential.credential_id}`}
                  size={150}
                  level="H"
                />
              </div>
              <span className="font-mono text-xs font-bold text-brand-accent mt-3">
                {selectedCredential.credential_id}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Zero-PII Encoded Verification Proof
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-navy-950 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="font-bold">{selectedCredential.holder_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Institution:</span>
                <span className="font-semibold">{selectedCredential.issuing_institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Program:</span>
                <span>{selectedCredential.program_or_course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issued On:</span>
                <span>{selectedCredential.issue_date}</span>
              </div>
              {selectedCredential.blockchain_tx_hash && (
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-navy-800">
                  <span className="text-slate-400">Transaction:</span>
                  <span className="font-mono text-[10px] text-brand-teal truncate max-w-[200px]">
                    {selectedCredential.blockchain_tx_hash}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    'link',
                    `http://localhost:5173/verify/credential/${selectedCredential.credential_id}`
                  )
                }
              >
                {copiedKey === 'link' ? 'Copied!' : 'Copy Verification Link'}
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedCredential(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Issue Credential Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Smart Contract-Anchored Credential"
        subtitle="Registers on-chain with immutable SHA-256 byte fingerprinting"
      >
        <form onSubmit={handleIssueCredential} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Mercer"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipient Email (Optional)
            </label>
            <input
              type="email"
              placeholder="alex@stanford.alumni.edu"
              value={holderEmail}
              onChange={(e) => setHolderEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credential Type
              </label>
              <select
                value={credentialType}
                onChange={(e) => setCredentialType(e.target.value as DocumentCategory)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              >
                <option value="degree">Degree</option>
                <option value="marksheet">Marksheet</option>
                <option value="internship">Internship</option>
                <option value="training">Training</option>
                <option value="skill">Skill</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Program, Course, or Degree Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master of Science in AI Engineering"
              value={programOrCourse}
              onChange={(e) => setProgramOrCourse(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Certificate Document File (Optional - for direct SHA-256 anchoring)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setIssueFile(e.target.files[0]);
                }
              }}
              className="w-full text-[11px] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-brand-accent file:text-white cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-navy-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsIssueModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isIssuing}>
              {isIssuing ? 'Anchoring On-Chain...' : 'Issue & Anchor on Blockchain'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
