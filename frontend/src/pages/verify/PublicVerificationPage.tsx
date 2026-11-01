import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Upload,
  QrCode,
  FileText,
  Copy,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
  Lock,
  ArrowRight,
  Info,
  RefreshCw,
  FileCheck2,
} from 'lucide-react';
import { api } from '../../services/api';
import { BlockchainVerifyResponse } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const PublicVerificationPage: React.FC = () => {
  const { credentialId: urlCredentialId } = useParams<{ credentialId?: string }>();

  const [activeTab, setActiveTab] = useState<'id' | 'file' | 'qr'>('id');
  const [credIdInput, setCredIdInput] = useState(urlCredentialId || 'TC-2026-MIT941');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [qrTextInput, setQrTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<BlockchainVerifyResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-verify if credentialId is present in URL
  useEffect(() => {
    if (urlCredentialId && urlCredentialId.trim()) {
      setCredIdInput(urlCredentialId.trim());
      handleVerifyById(urlCredentialId.trim());
    }
  }, [urlCredentialId]);

  const copyText = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyById = async (idToVerify?: string) => {
    const targetId = (idToVerify || credIdInput).trim();
    if (!targetId) return;
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await api.post<BlockchainVerifyResponse>('/blockchain/credentials/verify', {
        credential_id: targetId,
      });
      setResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification service was temporarily unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyByFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (credIdInput.trim()) {
        formData.append('credential_id', credIdInput.trim());
      }

      const res = await api.postForm<BlockchainVerifyResponse>(
        '/blockchain/credentials/verify-file',
        formData
      );
      setResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify document file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyByQrText = async (e: React.FormEvent) => {
    e.preventDefault();
    let text = qrTextInput.trim();
    if (!text) return;

    // Extract ID if a full URL was provided
    if (text.includes('/verify/credential/')) {
      const parts = text.split('/verify/credential/');
      text = parts[1]?.split('?')[0] || text;
    } else if (text.includes('id=')) {
      const urlParams = new URLSearchParams(text.split('?')[1]);
      text = urlParams.get('id') || text;
    }

    setCredIdInput(text);
    handleVerifyById(text);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success">Verified On-Chain</Badge>;
      case 'Hash Mismatch':
        return <Badge variant="danger">Hash Mismatch</Badge>;
      case 'Revoked':
        return <Badge variant="danger">Revoked by Issuer</Badge>;
      case 'Expired':
        return <Badge variant="warning">Validity Expired</Badge>;
      case 'Unregistered':
        return <Badge variant="neutral">Unregistered Record</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-brand-text dark:text-slate-100 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center text-white shadow-md shadow-brand-accent/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg text-brand-text dark:text-white tracking-tight">
                TrustChain<span className="text-brand-accent">.AI</span>
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-accent/10 text-brand-accent">
                Public Verifier
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/app/verify">
              <Button variant="ghost" size="sm">
                Full AI Workspace
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" size="sm">
                Platform Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Banner */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text dark:text-white tracking-tight">
            Decentralized Credential Verification
          </h1>
          <p className="mt-2 text-sm text-brand-muted dark:text-slate-400 max-w-2xl mx-auto">
            Independently verify academic and corporate credentials against immutable smart contracts
            anchored on Ethereum testnet without creating an account.
          </p>
        </div>

        {/* Verification Card & Tabs */}
        <Card className="p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
          <div className="flex border-b border-slate-200 dark:border-navy-800 gap-6 text-xs font-semibold mb-6">
            <button
              onClick={() => {
                setActiveTab('id');
                setResult(null);
                setErrorMsg(null);
              }}
              className={`pb-3 flex items-center gap-2 transition-colors ${
                activeTab === 'id'
                  ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              Verify by Credential ID
            </button>
            <button
              onClick={() => {
                setActiveTab('file');
                setResult(null);
                setErrorMsg(null);
              }}
              className={`pb-3 flex items-center gap-2 transition-colors ${
                activeTab === 'file'
                  ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              Verify by Document File (SHA-256)
            </button>
            <button
              onClick={() => {
                setActiveTab('qr');
                setResult(null);
                setErrorMsg(null);
              }}
              className={`pb-3 flex items-center gap-2 transition-colors ${
                activeTab === 'qr'
                  ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
                  : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Scan QR / URL
            </button>
          </div>

          {/* Tab 1: Credential ID */}
          {activeTab === 'id' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Enter Public Credential Identifier
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={credIdInput}
                    onChange={(e) => setCredIdInput(e.target.value)}
                    placeholder="e.g. TC-2026-MIT941 or TC-2025-REV811"
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleVerifyById()}
                  disabled={isLoading || !credIdInput.trim()}
                  className="whitespace-nowrap"
                >
                  {isLoading ? 'Verifying On-Chain...' : 'Verify Credential'}
                </Button>
              </div>

              {/* Preset demo triggers */}
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Try Live Demo Identifiers:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCredIdInput('TC-2026-MIT941');
                    handleVerifyById('TC-2026-MIT941');
                  }}
                  className="font-mono text-brand-accent hover:underline bg-brand-accent/5 px-2 py-0.5 rounded"
                >
                  TC-2026-MIT941 (Active)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCredIdInput('TC-2025-REV811');
                    handleVerifyById('TC-2025-REV811');
                  }}
                  className="font-mono text-red-500 hover:underline bg-red-500/5 px-2 py-0.5 rounded"
                >
                  TC-2025-REV811 (Revoked)
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Document File Upload */}
          {activeTab === 'file' && (
            <form onSubmit={handleVerifyByFile} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-navy-700 rounded-xl p-6 text-center hover:border-brand-accent transition-colors bg-slate-50/50 dark:bg-navy-950/50">
                <FileCheck2 className="w-10 h-10 text-brand-accent mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'Upload Certificate to Check Integrity'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supported formats: PDF, PNG, JPG (up to 15MB). We hash bytes client-side to protect privacy.
                </p>
                <input
                  type="file"
                  id="cert-file-input"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="cert-file-input"
                  className="mt-4 inline-block px-4 py-2 bg-white dark:bg-navy-800 border border-slate-300 dark:border-navy-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-navy-700 transition"
                >
                  {selectedFile ? 'Change File' : 'Select File from Device'}
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  value={credIdInput}
                  onChange={(e) => setCredIdInput(e.target.value)}
                  placeholder="Optional: Enter specific Credential ID to match against"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !selectedFile}
                  className="w-full sm:w-auto whitespace-nowrap"
                >
                  {isLoading ? 'Computing Hash & Verifying...' : 'Compute Hash & Verify'}
                </Button>
              </div>
            </form>
          )}

          {/* Tab 3: QR Code Text */}
          {activeTab === 'qr' && (
            <form onSubmit={handleVerifyByQrText} className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Paste QR Code Payload or Verification URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <QrCode className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={qrTextInput}
                    onChange={(e) => setQrTextInput(e.target.value)}
                    placeholder="https://trustchain.ai/verify/credential/TC-2026-MIT941"
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !qrTextInput.trim()}
                  className="whitespace-nowrap"
                >
                  Decode & Verify
                </Button>
              </div>
            </form>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Verification Result Showcase */}
          {result && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-navy-800 space-y-6">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${
                      result.status === 'Verified'
                        ? 'bg-emerald-600'
                        : result.status === 'Hash Mismatch' || result.status === 'Revoked'
                        ? 'bg-rose-600'
                        : 'bg-amber-600'
                    }`}
                  >
                    {result.status === 'Verified' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : result.status === 'Revoked' || result.status === 'Hash Mismatch' ? (
                      <XCircle className="w-7 h-7" />
                    ) : (
                      <AlertTriangle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-brand-text dark:text-white">
                        {result.status === 'Verified'
                          ? 'Valid & Authenticated Credential'
                          : result.status === 'Hash Mismatch'
                          ? 'Document Hash Mismatch Detected'
                          : result.status === 'Revoked'
                          ? 'Revoked Credential Notice'
                          : result.status === 'Expired'
                          ? 'Credential Validity Expired'
                          : 'Unregistered Credential Record'}
                      </h3>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-xs text-brand-muted dark:text-slate-400 mt-0.5">
                      {result.message}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Credential Identifier
                  </span>
                  <span className="font-mono text-sm font-bold text-brand-accent">
                    {result.credential_id || credIdInput}
                  </span>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left Card: Blockchain Anchoring */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-navy-950/40 border border-slate-200 dark:border-navy-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
                    <Lock className="w-4 h-4 text-brand-accent" />
                    <span>Cryptographic Ledger Details</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Network & Smart Contract
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {result.credential?.network || 'Hardhat Localhost (ChainID: 31337)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Registered Document SHA-256 Hash
                      </span>
                      <div className="flex items-center justify-between font-mono text-[11px] bg-white dark:bg-navy-900 px-2 py-1.5 rounded border border-slate-200 dark:border-navy-700">
                        <span className="truncate max-w-[260px]">
                          {result.document_hash || result.credential?.document_hash || 'N/A'}
                        </span>
                        <button
                          onClick={() =>
                            copyText(
                              'reg_hash',
                              result.document_hash || result.credential?.document_hash || ''
                            )
                          }
                          className="text-slate-400 hover:text-brand-accent p-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {result.computed_sha256 && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Computed Uploaded File Hash
                        </span>
                        <div
                          className={`flex items-center justify-between font-mono text-[11px] px-2 py-1.5 rounded border ${
                            result.hash_matches
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <span className="truncate max-w-[260px]">{result.computed_sha256}</span>
                          <span className="text-[10px] font-bold">
                            {result.hash_matches ? 'MATCH' : 'MISMATCH'}
                          </span>
                        </div>
                      </div>
                    )}

                    {result.credential?.transaction_hash && (
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          On-Chain Transaction Hash
                        </span>
                        <div className="flex items-center justify-between font-mono text-[11px] bg-white dark:bg-navy-900 px-2 py-1.5 rounded border border-slate-200 dark:border-navy-700">
                          <span className="truncate max-w-[260px]">
                            {result.credential.transaction_hash}
                          </span>
                          <button
                            onClick={() =>
                              copyText('tx', result.credential.transaction_hash)
                            }
                            className="text-slate-400 hover:text-brand-accent p-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Card: Institutional Authority & QR */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-navy-950/40 border border-slate-200 dark:border-navy-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
                    <Building2 className="w-4 h-4 text-brand-teal" />
                    <span>Issuing Authority & QR Proof</span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 dark:border-navy-700 shrink-0">
                      <QRCodeSVG
                        value={`http://localhost:5173/verify/credential/${result.credential_id || credIdInput}`}
                        size={84}
                        level="M"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                          Issuing Institution
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {result.credential?.organization ||
                            result.issuer ||
                            'Accredited Institutional Authority'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                          Signer Address
                        </span>
                        <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                          {result.issuer || result.credential?.issuer || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                          Classification
                        </span>
                        <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                          {result.credential_type || result.credential?.credential_type || 'Degree Certificate'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.status === 'Revoked' && (
                    <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px]">
                      <strong>Revocation Reason:</strong>{' '}
                      {result.credential?.revocation_reason ||
                        'Administrative invalidation or program withdrawal by institution.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Educational Advisory */}
              <div className="p-4 rounded-xl bg-brand-accent/5 border border-brand-accent/20 flex gap-3 items-start text-xs text-slate-600 dark:text-slate-300">
                <Info className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-brand-accent">
                    Understanding Blockchain Document Integrity
                  </span>
                  <p className="leading-relaxed">
                    Blockchain verification establishes whether the document file matches the cryptographic
                    SHA-256 fingerprint registered by an authorized issuer. Any subsequent edit, compression,
                    or re-saving changes the file's binary digest. Blockchain registration proves document
                    immutability, but authentic credential status also depends on the issuing institution's
                    official accreditation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-navy-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          TrustChain AI — Intelligent Digital Credential & Document Authentication Platform &copy; 2026.
        </p>
      </footer>
    </div>
  );
};

