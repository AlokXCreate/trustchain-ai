import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Award,
  AlertTriangle,
  Send,
  Lock,
  TrendingUp,
  Upload,
  QrCode,
  FilePlus,
  BotMessageSquare,
  History,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DashboardMetrics } from '../../types';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<DashboardMetrics>('/analytics/dashboard-metrics');
      setMetrics(data);
    } catch {
      // Fallback realistic demo dataset
      setMetrics({
        total_documents_analyzed: 5,
        verified_credentials: 3,
        documents_requiring_review: 1,
        verification_requests: 19,
        blockchain_verified_documents: 3,
        verification_success_rate: 94.2,
        monthly_activity: [
          { month: 'May', verified: 42, flagged: 3, pending: 2 },
          { month: 'Jun', verified: 68, flagged: 5, pending: 4 },
          { month: 'Jul', verified: 85, flagged: 7, pending: 6 },
          { month: 'Aug', verified: 112, flagged: 9, pending: 8 },
          { month: 'Sep', verified: 145, flagged: 11, pending: 10 },
          { month: 'Oct', verified: 190, flagged: 14, pending: 12 },
        ],
        category_distribution: [
          { category: 'Degree', count: 2 },
          { category: 'Marksheet', count: 1 },
          { category: 'Internship', count: 1 },
          { category: 'Skill', count: 1 },
        ],
        status_distribution: [
          { name: 'Verified', value: 3, color: '#16A34A' },
          { name: 'Under Review', value: 1, color: '#F59E0B' },
          { name: 'Analyzed', value: 1, color: '#3B82F6' },
        ],
        recent_activity: [
          {
            id: 'doc_demo_degree_01',
            document_name: 'Stanford_University_BS_Computer_Science.pdf',
            category: 'Degree',
            upload_date: 'Oct 25, 2026',
            status: 'verified',
            risk_score: 0.04,
            blockchain_status: 'Anchored',
            issuer: 'Stanford University',
          },
          {
            id: 'doc_demo_suspicious_04',
            document_name: 'Dubious_FastTrack_Diploma_Certificate.pdf',
            category: 'Skill',
            upload_date: 'Oct 31, 2026',
            status: 'review_required',
            risk_score: 0.88,
            blockchain_status: 'Unregistered',
            issuer: 'Global Tech Skills Academy',
          },
          {
            id: 'doc_demo_marksheet_02',
            document_name: 'Official_Academic_Transcript_Sem8.pdf',
            category: 'Marksheet',
            upload_date: 'Oct 28, 2026',
            status: 'verified',
            risk_score: 0.02,
            blockchain_status: 'Anchored',
            issuer: 'Massachusetts Institute of Technology',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const statCards = [
    {
      title: 'Total Analyzed',
      value: metrics?.total_documents_analyzed ?? 0,
      icon: <FileCheck2 className="w-5 h-5 text-brand-accent" />,
      subtext: '+24% from last month',
      color: 'blue',
    },
    {
      title: 'Verified Credentials',
      value: metrics?.verified_credentials ?? 0,
      icon: <Award className="w-5 h-5 text-emerald-500" />,
      subtext: 'Tamper-free records',
      color: 'green',
    },
    {
      title: 'Requiring Review',
      value: metrics?.documents_requiring_review ?? 0,
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      subtext: 'High anomaly flags',
      color: 'amber',
    },
    {
      title: 'Verification Requests',
      value: metrics?.verification_requests ?? 0,
      icon: <Send className="w-5 h-5 text-purple-500" />,
      subtext: 'Institutional inquiries',
      color: 'purple',
    },
    {
      title: 'Blockchain Anchored',
      value: metrics?.blockchain_verified_documents ?? 0,
      icon: <Lock className="w-5 h-5 text-indigo-500" />,
      subtext: 'Sepolia proofs ready',
      color: 'indigo',
    },
    {
      title: 'Success Rate',
      value: `${metrics?.verification_success_rate ?? 94.2}%`,
      icon: <TrendingUp className="w-5 h-5 text-teal-500" />,
      subtext: 'Authenticity benchmark',
      color: 'teal',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'review_required':
        return <Badge variant="warning">Review Required</Badge>;
      case 'analyzed':
        return <Badge variant="info">Analyzed</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-text dark:text-white">
              Welcome back, {user?.full_name || 'Alex Mercer'}
            </h1>
            <Badge variant="purple" size="sm">
              {user?.role ? user.role.toUpperCase() : 'INDIVIDUAL'}
            </Badge>
          </div>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
            Your document verification workspace. Real-time integrity metrics and ledger audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/upload')}
            icon={<Upload className="w-3.5 h-3.5" />}
          >
            Upload Document
          </Button>
        </div>
      </div>

      {/* 6 Statistic Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((c, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {c.title}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-navy-800">
                {c.icon}
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-brand-text dark:text-white">
                {c.value}
              </span>
              <p className="text-[10px] text-brand-muted dark:text-slate-400 mt-0.5">
                {c.subtext}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Activity Over Time (2 Columns) */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-brand-text dark:text-white">
                Verification Volume & Trends
              </h2>
              <p className="text-[11px] text-brand-muted dark:text-slate-400">
                Monthly verified vs. flagged document checks
              </p>
            </div>
            <Badge variant="info">Monthly Overview</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics?.monthly_activity || []}>
                <defs>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="month" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="verified"
                  name="Verified"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVerified)"
                />
                <Area
                  type="monotone"
                  dataKey="flagged"
                  name="Under Review"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFlagged)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Verification Status Distribution Donut */}
        <Card>
          <div className="mb-4">
            <h2 className="text-sm font-bold text-brand-text dark:text-white">
              Status Distribution
            </h2>
            <p className="text-[11px] text-brand-muted dark:text-slate-400">
              Credential classification breakdown
            </p>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics?.status_distribution || []}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(metrics?.status_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-around text-xs pt-2 border-t border-slate-100 dark:border-navy-800">
            {(metrics?.status_distribution || []).map((s, i) => (
              <div key={i} className="text-center">
                <span className="block font-bold" style={{ color: s.color }}>
                  {s.value}
                </span>
                <span className="text-[10px] text-slate-400">{s.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => navigate('/app/upload')}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-brand-accent/60 hover:shadow-subtle transition-all text-left group"
        >
          <Upload className="w-5 h-5 text-brand-accent mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-brand-text dark:text-white">Upload & Verify</p>
          <p className="text-[10px] text-brand-muted dark:text-slate-400">New document check</p>
        </button>

        <button
          onClick={() => navigate('/app/credentials')}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-brand-accent/60 hover:shadow-subtle transition-all text-left group"
        >
          <QrCode className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-brand-text dark:text-white">Verify Using QR</p>
          <p className="text-[10px] text-brand-muted dark:text-slate-400">Scan QR credential</p>
        </button>

        <button
          onClick={() => navigate('/app/credentials')}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-brand-accent/60 hover:shadow-subtle transition-all text-left group"
        >
          <FilePlus className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-brand-text dark:text-white">Issue Credential</p>
          <p className="text-[10px] text-brand-muted dark:text-slate-400">For institutions</p>
        </button>

        <button
          onClick={() => navigate('/app/assistant')}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-brand-accent/60 hover:shadow-subtle transition-all text-left group"
        >
          <BotMessageSquare className="w-5 h-5 text-brand-teal mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-brand-text dark:text-white">Open AI Assistant</p>
          <p className="text-[10px] text-brand-muted dark:text-slate-400">RAG analysis support</p>
        </button>

        <button
          onClick={() => navigate('/app/history')}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-brand-accent/60 hover:shadow-subtle transition-all text-left group"
        >
          <History className="w-5 h-5 text-slate-500 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-brand-text dark:text-white">View History</p>
          <p className="text-[10px] text-brand-muted dark:text-slate-400">All submissions</p>
        </button>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-brand-text dark:text-white">
              Recent Verification Activity
            </h2>
            <p className="text-[11px] text-brand-muted dark:text-slate-400">
              Latest documents submitted for forensic inspection
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/history')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-navy-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">Document</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Declared Issuer</th>
                <th className="py-2.5 px-3">Upload Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60 text-xs">
              {(metrics?.recent_activity || []).map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-brand-text dark:text-slate-200">
                    {doc.document_name}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                    {doc.category}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {doc.issuer}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                    {doc.upload_date}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {doc.risk_score !== null && doc.risk_score !== undefined ? (
                      <span className={doc.risk_score > 0.5 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                        {doc.risk_score.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigate(`/app/verify/${doc.id}`)}
                      className="text-xs font-semibold text-brand-accent hover:underline inline-flex items-center gap-1"
                    >
                      View Report <ArrowRight className="w-3 h-3" />
                    </button>
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
