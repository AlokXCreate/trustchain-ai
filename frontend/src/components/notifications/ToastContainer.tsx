import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Download,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useNotification, ToastItem, ToastType } from '../../context/NotificationContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const getTheme = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          border: 'border-emerald-500/40 dark:border-emerald-500/30',
          bg: 'bg-emerald-50/95 dark:bg-emerald-950/80',
          glow: 'shadow-emerald-500/10',
          bar: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
          badgeText: 'SUCCESS',
        };
      case 'download':
        return {
          icon: <Download className="w-5 h-5 text-blue-500 shrink-0" />,
          border: 'border-blue-500/40 dark:border-blue-500/30',
          bg: 'bg-blue-50/95 dark:bg-navy-900/90',
          glow: 'shadow-blue-500/10',
          bar: 'bg-blue-500',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
          badgeText: 'DOWNLOAD',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          border: 'border-rose-500/40 dark:border-rose-500/30',
          bg: 'bg-rose-50/95 dark:bg-rose-950/80',
          glow: 'shadow-rose-500/10',
          bar: 'bg-rose-500',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
          badgeText: 'ACTION ERROR',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          border: 'border-amber-500/40 dark:border-amber-500/30',
          bg: 'bg-amber-50/95 dark:bg-amber-950/80',
          glow: 'shadow-amber-500/10',
          bar: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
          badgeText: 'NOTICE',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
          border: 'border-indigo-500/40 dark:border-indigo-500/30',
          bg: 'bg-indigo-50/95 dark:bg-navy-900/90',
          glow: 'shadow-indigo-500/10',
          bar: 'bg-indigo-500',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
          badgeText: 'SYSTEM',
        };
    }
  };

  const theme = getTheme(toast.type);
  const duration = toast.duration || 4200;

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-xl border backdrop-blur-md shadow-xl ${theme.border} ${theme.bg} ${theme.glow} transition-all duration-200 transform translate-y-0 opacity-100`}
      role="alert"
    >
      <div className="p-3.5 flex items-start space-x-3">
        {theme.icon}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-2">
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded ${theme.badge}`}>
              {theme.badgeText}
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {toast.title}
            </h4>
          </div>
          {toast.message && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug break-words">
              {toast.message}
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors shrink-0"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Countdown Progress Bar */}
      {duration > 0 && (
        <div className="w-full bg-slate-200/50 dark:bg-slate-700/40 h-0.5">
          <div
            className={`h-full ${theme.bar}`}
            style={{
              animation: `shrinkWidth ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

