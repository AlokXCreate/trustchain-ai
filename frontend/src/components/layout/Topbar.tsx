import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Check,
  ChevronDown,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole, NotificationItem } from '../../types';
import { api } from '../../services/api';
import { Badge } from '../ui/Badge';

export const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, role, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDrawer, setShowNotifDrawer] = useState<boolean>(false);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await api.get<NotificationItem[]>('/notifications/list');
        setNotifications(notifs);
      } catch {
        // Fallback demo notifications
        setNotifications([
          {
            id: 'n1',
            user_id: 'usr_01',
            title: 'Verification Completed',
            message: 'Stanford BS Degree verification is ready to review.',
            type: 'success',
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 'n2',
            user_id: 'usr_01',
            title: 'Digital Credential Issued',
            message: 'MIT Office of Credentialing registered a new credential.',
            type: 'info',
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
    } catch {
      // local state update
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // Convert current path into friendly breadcrumb title
  const getBreadcrumbTitle = () => {
    const path = location.pathname.replace('/app/', '');
    switch (path) {
      case 'dashboard':
        return 'Overview';
      case 'upload':
        return 'Document Verification';
      case 'verify':
        return 'Verification Workspace';
      case 'history':
        return 'Verification History';
      case 'credentials':
        return 'Digital Credentials';
      case 'issuers':
        return 'Issuer Registry';
      case 'bulk':
        return 'Bulk Verification Suite';
      case 'assistant':
        return 'TrustChain AI Assistant';
      case 'analytics':
        return 'Analytics & Insights';
      case 'audit':
        return 'Tamper-Evident Audit Trail';
      case 'settings':
        return 'Account & Security Settings';
      default:
        return 'Workspace';
    }
  };

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'individual', label: 'Individual User', desc: 'Alex Mercer (Student / Graduate)' },
    { id: 'institution', label: 'Issuer / University', desc: 'Dr. Vance (MIT Registrar)' },
    { id: 'verifier', label: 'HR / Recruiter', desc: 'Marcus Chen (Apex Talent)' },
    { id: 'admin', label: 'Platform Administrator', desc: 'Sarah Connor (Security Ops)' },
  ];

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-navy-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-brand-text dark:text-white tracking-tight">
          {getBreadcrumbTitle()}
        </h1>
        <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400">
          TrustChain v1.0
        </span>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, credentials, issuers... (Press /)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700/80 rounded-xl pl-9 pr-4 py-2 text-brand-text dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
          />
        </div>
      </div>

      {/* Right Actions & Switchers */}
      <div className="flex items-center gap-3">
        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100/60 transition-colors"
            title="Switch demo persona"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="capitalize">{role}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-850 rounded-xl shadow-xl border border-slate-200 dark:border-navy-700 p-2 z-50 animate-in fade-in slide-in-from-top-1">
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Demo Persona
              </p>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    switchDemoRole(r.id);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                    role === r.id
                      ? 'bg-brand-accent text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800'
                  }`}
                >
                  <div>
                    <p className="font-medium">{r.label}</p>
                    <p className={`text-[10px] ${role === r.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {r.desc}
                    </p>
                  </div>
                  {role === r.id && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="Toggle color theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="p-2 relative rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-navy-900 animate-pulse" />
            )}
          </button>

          {showNotifDrawer && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-navy-850 rounded-xl shadow-2xl border border-slate-200 dark:border-navy-700 overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 dark:border-navy-750 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-text dark:text-white">
                  Notifications ({unreadCount} new)
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-brand-accent hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-800">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.action_url) navigate(n.action_url);
                      setShowNotifDrawer(false);
                    }}
                    className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer transition-colors ${
                      !n.is_read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-brand-text dark:text-slate-200">
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      )}
                    </div>
                    <p className="text-[11px] text-brand-muted dark:text-slate-400 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
