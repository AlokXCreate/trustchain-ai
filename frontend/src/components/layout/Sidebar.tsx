import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  FileText,
  History,
  Award,
  Building2,
  BotMessageSquare,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Layers,
  Users,
  ShieldAlert,
  Cpu,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Sidebar: React.FC = () => {
  const { role, user, logout } = useAuth();

  const isInst = role === 'institution';
  const isAdmin = role === 'admin';
  const isVerifier = role === 'verifier';

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-brand-accent text-white shadow-sm font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-brand-text dark:hover:text-white'
    }`;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 flex flex-col h-screen select-none transition-colors">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-navy-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center text-white shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight text-brand-text dark:text-white">
            TrustChain
          </span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/20">
            AI
          </span>
        </div>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Core Navigation */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Verification Core
          </p>
          <div className="space-y-1">
            <NavLink to="/app/dashboard" className={navClass}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/app/upload" className={navClass}>
              <FileCheck className="w-4 h-4 flex-shrink-0" />
              <span>Verify Document</span>
            </NavLink>
            <NavLink to="/app/history" className={navClass}>
              <History className="w-4 h-4 flex-shrink-0" />
              <span>Verification History</span>
            </NavLink>
            <NavLink to="/app/credentials" className={navClass}>
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>Digital Credentials</span>
            </NavLink>
            <NavLink to="/verify/public" target="_blank" className={navClass}>
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-brand-accent" />
              <div className="flex items-center justify-between flex-1">
                <span>Public Verifier</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </div>
            </NavLink>
            <NavLink to="/app/issuers" className={navClass}>
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span>Issuer Registry</span>
            </NavLink>
            <NavLink to="/app/assistant" className={navClass}>
              <BotMessageSquare className="w-4 h-4 flex-shrink-0 text-brand-teal" />
              <div className="flex items-center justify-between flex-1">
                <span>AI Assistant</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold uppercase">
                  RAG
                </span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Intelligence & Audit */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Intelligence & Trail
          </p>
          <div className="space-y-1">
            <NavLink to="/app/analytics" className={navClass}>
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span>Analytics & Insights</span>
            </NavLink>
            <NavLink to="/app/audit" className={navClass}>
              <Cpu className="w-4 h-4 flex-shrink-0" />
              <div className="flex items-center justify-between flex-1">
                <span>Audit Trail</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-navy-700 text-slate-600 dark:text-slate-300 font-mono">
                  SHA-256
                </span>
              </div>
            </NavLink>
            <NavLink to="/app/settings" className={navClass}>
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>

        {/* Institutional & HR Suite (Always visible or highlighted for authorized roles) */}
        {(isInst || isVerifier || isAdmin) && (
          <div>
            <div className="px-3 flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Enterprise & HR
              </p>
              <Badge variant="purple" size="sm">
                Pro
              </Badge>
            </div>
            <div className="space-y-1">
              <NavLink to="/app/bulk" className={navClass}>
                <Layers className="w-4 h-4 flex-shrink-0" />
                <span>Bulk Verification</span>
              </NavLink>
              <NavLink to="/app/credentials" className={navClass}>
                <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
                <span>Issue Credentials</span>
              </NavLink>
            </div>
          </div>
        )}

        {/* Administrator Control Center */}
        {isAdmin && (
          <div>
            <div className="px-3 flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500/90 dark:text-rose-400">
                Admin Control
              </p>
              <Badge variant="danger" size="sm">
                Admin
              </Badge>
            </div>
            <div className="space-y-1">
              <NavLink to="/app/issuers" className={navClass}>
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Institution Approval</span>
              </NavLink>
              <NavLink to="/app/settings" className={navClass}>
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>User Management</span>
              </NavLink>
            </div>
          </div>
        )}
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 dark:border-navy-800">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200/60 dark:border-navy-750">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-accent to-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-brand-text dark:text-slate-200 truncate">
                {user?.full_name || 'Alex Mercer'}
              </p>
              <p className="text-[10px] text-brand-muted dark:text-slate-400 capitalize truncate">
                {role} account
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
