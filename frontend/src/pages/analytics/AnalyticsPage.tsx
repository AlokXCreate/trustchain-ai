import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  ShieldCheck,
  Building2,
  PieChart as PieIcon,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AnalyticsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [dateRange, setDateRange] = useState('30d');

  const volumeTrends = [
    { month: 'Jun', verified: 320, flagged: 18, total: 338 },
    { month: 'Jul', verified: 480, flagged: 24, total: 504 },
    { month: 'Aug', verified: 650, flagged: 32, total: 682 },
    { month: 'Sep', verified: 890, flagged: 45, total: 935 },
    { month: 'Oct', verified: 1240, flagged: 62, total: 1302 },
    { month: 'Nov', verified: 1580, flagged: 78, total: 1658 },
  ];

  const riskHistogram = [
    { range: '0.0 - 0.2 (Safe)', count: 1240, color: '#16A34A' },
    { range: '0.2 - 0.4 (Low)', count: 210, color: '#14B8A6' },
    { range: '0.4 - 0.6 (Medium)', count: 85, color: '#F59E0B' },
    { range: '0.6 - 0.8 (Suspicious)', count: 42, color: '#F97316' },
    { range: '0.8 - 1.0 (Critical)', count: 21, color: '#DC2626' },
  ];

  const categoryBreakdown = [
    { category: 'Degree Certificates', percentage: 48, count: 790 },
    { category: 'Official Marksheets', percentage: 26, count: 430 },
    { category: 'Internship Certificates', percentage: 14, count: 230 },
    { category: 'Experience Letters', percentage: 8, count: 130 },
    { category: 'Training & Skill Badges', percentage: 4, count: 78 },
  ];

  const institutionalLeaderboard = [
    { name: 'Stanford University Registrar', verified: 4210, successRate: '99.2%', status: 'Approved' },
    { name: 'Massachusetts Institute of Technology (MIT)', verified: 3890, successRate: '98.9%', status: 'Approved' },
    { name: 'Oxford Digital Academy & Certification', verified: 12, successRate: '91.6%', status: 'Under Review' },
    { name: 'Amazon Web Services (Corporate Verification)', verified: 1240, successRate: '97.5%', status: 'Approved' },
    { name: 'Google DeepMind Research Credentials', verified: 890, successRate: '99.6%', status: 'Approved' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight">
            Analytics & Verification Intelligence
          </h1>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
            Aggregated authenticity rates, anomaly distributions, and institutional performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last 12 Months</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Analytics Report
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Verification Volume</span>
          <p className="text-2xl font-black text-brand-text dark:text-white mt-1">4,680</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+34% this quarter</span>
        </Card>
        <Card>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Authenticity Yield</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">96.8%</p>
          <span className="text-[10px] text-slate-400">Low tamper anomaly index</span>
        </Card>
        <Card>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Fraud Detected</span>
          <p className="text-2xl font-black text-rose-600 mt-1">63</p>
          <span className="text-[10px] text-rose-500 font-semibold">1.3% forgery rate intercepted</span>
        </Card>
        <Card>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Average Latency</span>
          <p className="text-2xl font-black text-brand-accent mt-1">2.4s</p>
          <span className="text-[10px] text-slate-400">High-speed OCR & Vision</span>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Volume Trends Area Chart */}
        <Card>
          <div className="mb-4">
            <h2 className="text-sm font-bold text-brand-text dark:text-white">
              Cumulative Verification Trajectory
            </h2>
            <p className="text-[11px] text-brand-muted dark:text-slate-400">
              Verified documents vs. suspicious documents flagged
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrends}>
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
                  name="Verified Authentic"
                  stroke="#16A34A"
                  fill="#16A34A"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="flagged"
                  name="Suspicious Flagged"
                  stroke="#DC2626"
                  fill="#DC2626"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Score Histogram */}
        <Card>
          <div className="mb-4">
            <h2 className="text-sm font-bold text-brand-text dark:text-white">
              Forensic Risk Score Histogram
            </h2>
            <p className="text-[11px] text-brand-muted dark:text-slate-400">
              Frequency of inspected documents across risk thresholds
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskHistogram}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="range" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" name="Documents Inspected" radius={[6, 6, 0, 0]}>
                  {riskHistogram.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Institutional Leaderboard & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 Column) */}
        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-brand-text dark:text-white">
            Document Category Share
          </h2>
          <div className="space-y-3">
            {categoryBreakdown.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {c.category}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {c.percentage}% ({c.count})
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-accent rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Institutional Leaderboard Table (2 Columns) */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-navy-800">
            <h2 className="text-sm font-bold text-brand-text dark:text-white">
              Issuer Verification Volume Leaderboard
            </h2>
            <p className="text-[11px] text-brand-muted dark:text-slate-400">
              Accredited institutions with highest verification activity
            </p>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4">Institution Name</th>
                  <th className="py-2.5 px-4">Verified Credentials</th>
                  <th className="py-2.5 px-4">Integrity Yield</th>
                  <th className="py-2.5 px-4">Registry Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60">
                {institutionalLeaderboard.map((inst, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-navy-800/30">
                    <td className="py-3 px-4 font-semibold text-brand-text dark:text-slate-200">
                      {inst.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {inst.verified.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-600 font-bold">
                      {inst.successRate}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={inst.status === 'Approved' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {inst.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
