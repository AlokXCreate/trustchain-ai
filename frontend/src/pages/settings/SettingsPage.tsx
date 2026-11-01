import React, { useState } from 'react';
import {
  User,
  Building2,
  Lock,
  Bell,
  Sun,
  Moon,
  Shield,
  Save,
  CheckCircle2,
  Sparkles,
  Key,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const SettingsPage: React.FC = () => {
  const { user, role, switchDemoRole } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'security' | 'notifications' | 'demo'>('profile');

  // Profile Form State
  const [fullName, setFullName] = useState(user?.full_name || 'Alex Mercer');
  const [email] = useState(user?.email || 'individual@trustchain.ai');
  const [designation, setDesignation] = useState(user?.designation || 'Graduate Engineer');
  const [country, setCountry] = useState(user?.country || 'United States');

  // Organization Form State
  const [orgName, setOrgName] = useState(user?.organization_name || 'Stanford Alumni');
  const [orgType, setOrgType] = useState(user?.organization_type || 'University');

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [verificationAlerts, setVerificationAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const rolesList: { id: UserRole; title: string; desc: string }[] = [
    { id: 'individual', title: 'Individual / Student', desc: 'Alex Mercer • Upload and verify personal degrees & certificates' },
    { id: 'institution', title: 'Accredited Issuer / Registrar', desc: 'Dr. Eleanor Vance • Issue credentials from MIT Registrar Office' },
    { id: 'verifier', title: 'Corporate HR / Verifier', desc: 'Marcus Chen • Apex Talent • Run bulk pre-screening pipelines' },
    { id: 'admin', title: 'Platform Operations Admin', desc: 'Sarah Connor • RegTech Ops • Approve issuer applications & system keys' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
          Manage your account profile, organization parameters, security policies, and demo mode.
        </p>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Settings successfully updated!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-navy-800 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          User Profile
        </button>
        <button
          onClick={() => setActiveTab('organization')}
          className={`pb-3 whitespace-nowrap transition-colors ${
            activeTab === 'organization'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          Organization
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 whitespace-nowrap transition-colors ${
            activeTab === 'security'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          Security & Access
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 whitespace-nowrap transition-colors ${
            activeTab === 'notifications'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          Notifications & Theme
        </button>
        <button
          onClick={() => setActiveTab('demo')}
          className={`pb-3 whitespace-nowrap transition-colors ${
            activeTab === 'demo'
              ? 'border-b-2 border-brand-accent text-brand-accent font-bold'
              : 'text-slate-500 hover:text-brand-text dark:hover:text-white'
          }`}
        >
          Demo Persona Switcher
        </button>
      </div>

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <Card className="max-w-2xl p-6">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-brand-text dark:text-white border-b border-slate-100 dark:border-navy-800 pb-3">
              Profile Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email (Read Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: Organization */}
      {activeTab === 'organization' && (
        <Card className="max-w-2xl p-6">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-brand-text dark:text-white border-b border-slate-100 dark:border-navy-800 pb-3">
              Organization & Authority Details
            </h2>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization / University Legal Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization Entity Type
              </label>
              <input
                type="text"
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="primary" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
                Update Organization
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: Security */}
      {activeTab === 'security' && (
        <Card className="max-w-2xl p-6 space-y-5 text-xs">
          <h2 className="text-sm font-bold text-brand-text dark:text-white border-b border-slate-100 dark:border-navy-800 pb-3">
            Security & Authentication
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
              <div>
                <p className="font-bold text-brand-text dark:text-white">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-brand-muted dark:text-slate-400">
                  Secure your account using time-based one-time passcodes (TOTP)
                </p>
              </div>
              <Badge variant="success">ENABLED</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
              <div>
                <p className="font-bold text-brand-text dark:text-white">Active Session Token</p>
                <p className="text-[11px] text-brand-muted dark:text-slate-400 font-mono">
                  Bearer Token Valid (24h Expiry)
                </p>
              </div>
              <span className="text-[11px] text-slate-500">127.0.0.1</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: Notifications & Theme */}
      {activeTab === 'notifications' && (
        <Card className="max-w-2xl p-6 space-y-5 text-xs">
          <h2 className="text-sm font-bold text-brand-text dark:text-white border-b border-slate-100 dark:border-navy-800 pb-3">
            Notification & Interface Preferences
          </h2>

          {/* Theme selector */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300">
              Interface Theme
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  theme === 'light'
                    ? 'border-brand-accent bg-blue-50 text-brand-accent shadow-xs'
                    : 'border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-600'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" /> Light Mode
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  theme === 'dark'
                    ? 'border-brand-accent bg-navy-800 text-blue-300 shadow-xs'
                    : 'border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 text-blue-400" /> Deep Navy Dark Mode
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent"
              />
              <span>Email notification when document verification completes</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={verificationAlerts}
                onChange={(e) => setVerificationAlerts(e.target.checked)}
                className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent"
              />
              <span>High anomaly and forgery risk instant alerts</span>
            </label>
          </div>
        </Card>
      )}

      {/* TAB 5: Demo Persona Switcher */}
      {activeTab === 'demo' && (
        <Card className="max-w-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-accent" />
            <h2 className="text-sm font-bold text-brand-text dark:text-white">
              Instant Persona Switcher (Demo Mode)
            </h2>
          </div>
          <p className="text-xs text-brand-muted dark:text-slate-400">
            Switch between simulated platform personas with full role-based permissions to explore different workflows immediately.
          </p>

          <div className="space-y-2.5">
            {rolesList.map((r) => (
              <div
                key={r.id}
                onClick={() => switchDemoRole(r.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  role === r.id
                    ? 'border-brand-accent bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-brand-accent'
                    : 'border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-900'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-brand-text dark:text-white">{r.title}</p>
                  <p className="text-[11px] text-brand-muted dark:text-slate-400 mt-0.5">{r.desc}</p>
                </div>
                {role === r.id && (
                  <Badge variant="info" size="sm">ACTIVE</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
