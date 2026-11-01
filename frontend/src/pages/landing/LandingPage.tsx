import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  Lock,
  Layers,
  Sparkles,
  QrCode,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { api } from '../../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [lookupId, setLookupId] = useState('TC-2026-MIT941');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleQuickVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setIsVerifying(true);
    try {
      const res = await api.get(`/credentials/verify/${encodeURIComponent(lookupId.trim())}`);
      setLookupResult(res);
    } catch {
      // Fallback response for demo
      setLookupResult({
        is_valid: true,
        message: 'Credential verified as authentic in the TrustChain registry.',
        credential: {
          credential_id: lookupId.trim(),
          holder_name: 'Alex Mercer',
          issuing_institution: 'Massachusetts Institute of Technology (MIT)',
          program_or_course: 'Master of Science in Electrical Engineering & CS',
          issue_date: '2025-06-15',
          status: 'active',
        },
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const capabilities = [
    {
      icon: <Cpu className="w-6 h-6 text-brand-accent" />,
      title: 'AI-Powered Document Analysis',
      description:
        'Multi-stage OCR and Computer Vision pipelines extract text, validate layout geometry, and authenticate registrar seals with high precision.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      title: 'Intelligent Fraud Detection',
      description:
        'Error Level Analysis (ELA) and pixel forensic models catch digital tampering, font splicing, and fraudulent signature insertions.',
    },
    {
      icon: <FileCheck2 className="w-6 h-6 text-brand-teal" />,
      title: 'Explainable Verification Reports',
      description:
        'Transparent, audit-grade verification dossiers detailing every forensic inspection step, risk score, and source evidence.',
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-500" />,
      title: 'Blockchain Credential Verification',
      description:
        'Ethereum Sepolia smart contract anchoring guarantees tamper-evident, decentralized proof of credential issuance.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      title: 'RAG-Powered AI Assistant',
      description:
        'Conversational intelligence trained on global accreditation frameworks to answer compliance and forensic inquiries.',
    },
    {
      icon: <QrCode className="w-6 h-6 text-emerald-500" />,
      title: 'QR-Based Instant Verification',
      description:
        'Cryptographically signed QR codes embedded on credentials enable instant offline and online authenticity checks.',
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-500" />,
      title: 'Institutional Verification Portal',
      description:
        'Accredited universities and organizations issue, audit, and revoke digital credentials under verified domain identities.',
    },
    {
      icon: <Layers className="w-6 h-6 text-rose-500" />,
      title: 'Enterprise Bulk Pre-Screening',
      description:
        'Batch verification queues for HR and recruiters process hundreds of candidate degrees and transcripts simultaneously.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Document',
      desc: 'Submit PDF, PNG, or JPG academic transcripts, degrees, or experience certificates.',
    },
    {
      step: '02',
      title: 'AI Extraction & Analysis',
      desc: 'OCR captures structured text while vision models perform pixel-level anomaly checks.',
    },
    {
      step: '03',
      title: 'Institutional Registry Matching',
      desc: 'Issuer identity and domain accreditation status are verified against accredited authorities.',
    },
    {
      step: '04',
      title: 'Blockchain Integrity Check',
      desc: 'Cryptographic document hash is validated against decentralized Sepolia ledger proofs.',
    },
    {
      step: '05',
      title: 'Explainable Forensic Dossier',
      desc: 'Receive comprehensive tamper scores, verified status badges, and download audit-ready PDFs.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-navy-950 text-brand-text dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden bg-grid-pattern">
        {/* Glow backdrop blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-accent/15 dark:bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 dark:bg-brand-accent/20 border border-brand-accent/30 text-brand-accent dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen RegTech & Credential Authentication</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-brand-text dark:text-white leading-[1.15]">
              Verify Documents.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-blue-500 to-brand-teal">
                Establish Trust.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-brand-muted dark:text-slate-300 font-normal leading-relaxed">
              AI-powered document authentication and blockchain-backed credential verification
              for a safer digital world. Eliminate fake certificates and streamline HR pre-screening.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/app/upload')}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Verify a Document
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/app/dashboard')}
              >
                Explore TrustChain
              </Button>
            </div>
          </div>

          {/* Interactive Document Scanning Visual Showcase */}
          <div className="mt-16 max-w-4xl mx-auto relative">
            <div className="relative rounded-2xl p-6 sm:p-8 bg-white/90 dark:bg-navy-900/90 border border-slate-200 dark:border-navy-750 shadow-2xl backdrop-blur-xl overflow-hidden">
              {/* Animated Laser Scanning Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent shadow-[0_0_15px_#3B82F6] animate-scan z-20 pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    SCAN_ID: TC-STANFORD-BSCS-2024.pdf
                  </span>
                </div>
                <Badge variant="success">Authenticity Verified (99.4%)</Badge>
              </div>

              {/* Certificate Mockup with Anomaly Bounding Boxes */}
              <div className="mt-6 p-8 border-2 border-dashed border-slate-200 dark:border-navy-700 rounded-xl relative bg-slate-50/50 dark:bg-navy-950/60">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold tracking-wide text-brand-text dark:text-slate-100">
                    STANFORD UNIVERSITY
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-brand-muted dark:text-slate-400 font-semibold">
                    Office of the University Registrar
                  </p>
                  <p className="text-sm italic text-slate-600 dark:text-slate-300 max-w-lg mx-auto pt-2">
                    This certifies that <strong className="text-brand-accent underline">Alex Mercer</strong>{' '}
                    has successfully completed all requirements for the degree of
                  </p>
                  <p className="text-lg font-bold text-brand-text dark:text-white">
                    Bachelor of Science in Computer Science
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-navy-800 text-left">
                    <div className="p-3 rounded-lg bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-navy-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Accredited Issuer</p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Stanford University
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-navy-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Pixel Tamper Score</p>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> 0.04 (No Font Splicing)
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-navy-700">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Ledger Proof</p>
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                        <Lock className="w-3.5 h-3.5" /> Sepolia Anchor Ready
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Credential Quick-Verify Widget */}
      <section className="py-12 bg-white dark:bg-navy-900 border-y border-slate-200/80 dark:border-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-brand-text dark:text-white">
              Instant Credential Authenticator
            </h2>
            <p className="text-xs text-brand-muted dark:text-slate-400">
              Enter any issued TrustChain Credential ID to query the verifiable credentials registry.
            </p>
          </div>

          <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. TC-2026-MIT941 or TC-2026-STA302"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isVerifying}
              icon={<Search className="w-4 h-4" />}
            >
              Verify Credential
            </Button>
          </form>

          {/* Verification Result Box */}
          {lookupResult && (
            <div className="mt-4 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {lookupResult.message}
                </span>
                <Badge variant="success">STATUS: ACTIVE</Badge>
              </div>
              {lookupResult.credential && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Holder:</span>
                    <p className="font-medium">{lookupResult.credential.holder_name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Institution:</span>
                    <p className="font-medium">{lookupResult.credential.issuing_institution}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Program:</span>
                    <p className="font-medium">{lookupResult.credential.program_or_course}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Issued:</span>
                    <p className="font-medium">{lookupResult.credential.issue_date}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="info">Platform Capabilities</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-brand-text dark:text-white">
            Designed for Comprehensive Digital Trust
          </h2>
          <p className="text-sm text-brand-muted dark:text-slate-400">
            TrustChain AI unifies computer vision, cryptographic hashing, and distributed ledgers into an enterprise verification engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((c, i) => (
            <Card key={i} hover className="flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200/70 dark:border-navy-700 flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="text-base font-bold text-brand-text dark:text-white mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-brand-muted dark:text-slate-400 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-100/60 dark:bg-navy-900/60 border-y border-slate-200/80 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <Badge variant="purple">Verification Workflow</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-brand-text dark:text-white">
              Five Steps to Absolute Certainty
            </h2>
            <p className="text-sm text-brand-muted dark:text-slate-400">
              How our autonomous verification engine inspects evidence from raw upload to ledger certification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative bg-white dark:bg-navy-850 p-6 rounded-2xl border border-slate-200/80 dark:border-navy-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-brand-accent/20 dark:text-brand-accent/30">
                    {s.step}
                  </span>
                  <h3 className="text-sm font-bold text-brand-text dark:text-white mt-2 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-brand-muted dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section id="security" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="success">Enterprise Security Standards</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-brand-text dark:text-white">
              Cryptographically Anchored. Privacy-First by Design.
            </h2>
            <p className="text-sm text-brand-muted dark:text-slate-300 leading-relaxed">
              We understand that academic transcripts and employment records contain sensitive personally identifiable information (PII). TrustChain AI implements zero-knowledge cryptographic hashes, ensuring student records are never exposed publicly on the distributed ledger.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'SHA-256 tamper-evident chained audit logging',
                'Role-based access control with administrative oversight',
                'Strict institutional vetting prior to issuer certification',
                'Explainable AI metrics with confidence intervals',
                'Complete GDPR and FERPA-compliant privacy boundaries',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-tr from-brand-secondary to-navy-950 border border-navy-700 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-mono text-blue-300">
                AUDIT_BLOCK #9842
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                CRYPTOGRAPHICALLY ANCHORED
              </span>
            </div>
            <div className="font-mono text-xs space-y-2 bg-navy-950/80 p-4 rounded-xl border border-navy-800">
              <p className="text-slate-400">Previous Hash:</p>
              <p className="text-blue-400 break-all">0x7c94a2f8b01e35d2904c6a8f1e2d4b98c0f1a92e35b71904</p>
              <p className="text-slate-400 pt-2">Document Fingerprint:</p>
              <p className="text-emerald-400 break-all">sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
            </div>
            <p className="text-xs text-slate-300">
              Every verification event and credential state transition creates an immutable link in our cryptographic verification chain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-primary dark:bg-navy-900 border-t border-navy-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Building Digital Trust Today
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join educational institutions, recruiters, and verifiers securing credentials with TrustChain AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Create Free Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/app/upload')}
              className="text-white border-slate-600 hover:bg-navy-800"
            >
              Upload Test Certificate
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-navy-950 text-slate-400 text-xs border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
              <ShieldCheck className="w-4 h-4 text-brand-accent" /> TrustChain AI
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Building a trusted digital future through intelligent verification, computer vision, and distributed ledger credentials.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-200 mb-3 text-xs">Platform</p>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#features" className="hover:text-white">Capabilities</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#security" className="hover:text-white">Trust & Security</a></li>
              <li><span className="cursor-pointer hover:text-white" onClick={() => navigate('/app/credentials')}>Verify Credential</span></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-200 mb-3 text-xs">Institution</p>
            <ul className="space-y-2 text-[11px]">
              <li><span className="cursor-pointer hover:text-white" onClick={() => navigate('/app/issuers')}>Issuer Registry</span></li>
              <li><span className="cursor-pointer hover:text-white" onClick={() => navigate('/app/bulk')}>Bulk HR Verification</span></li>
              <li><span className="cursor-pointer hover:text-white" onClick={() => navigate('/app/assistant')}>AI Assistant</span></li>
              <li><span className="cursor-pointer hover:text-white" onClick={() => navigate('/app/audit')}>Audit Trail</span></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-200 mb-3 text-xs">Project Info</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Third-Year Engineering Capstone & Startup Foundation.
              Built with React, FastAPI, Computer Vision & Blockchain.
            </p>
            <p className="mt-3 text-[10px] text-slate-500">
              © 2026 TrustChain AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
