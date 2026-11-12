import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileCode, Globe, ChevronDown, Check } from 'lucide-react';
import { api } from '../../services/api';
import { ClientReportGenerator, ReportGenerationInput } from '../../services/clientReportGenerator';
import { useNotification } from '../../context/NotificationContext';

interface ReportDownloadDropdownProps {
  reportId?: string;
  documentName?: string;
  category?: string;
  riskScore?: number;
  status?: string;
  sha256?: string;
  reportData?: any;
  buttonLabel?: string;
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md';
}

export const ReportDownloadDropdown: React.FC<ReportDownloadDropdownProps> = ({
  reportId = 'TC-REPORT-2026-0001',
  documentName = 'Verified_Document.pdf',
  category = 'Degree Certificate',
  riskScore = 12,
  status = 'verified',
  sha256,
  reportData,
  buttonLabel = 'Download Report',
  variant = 'primary',
  size = 'sm',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDownloading, setActiveDownloading] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notify = useNotification();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (format: 'pdf' | 'docx' | 'json' | 'html') => {
    setActiveDownloading(format);
    setIsOpen(false);

    try {
      // 1. Attempt server-side generation first
      try {
        const { blob, filename } = await api.downloadBlob(`/reports/${reportId}/download/${format}`);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `${reportId}_TRUSTCHAIN_REPORT.${format === 'docx' ? 'doc' : format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        notify.download(
          `${format.toUpperCase()} Report Downloaded`,
          `Official TrustChain AI verification dossier saved.`
        );
        return;
      } catch (backendErr) {
        // Fallback to client-side generator
      }

      // 2. Client-side generator fallback (runs on GitHub Pages & offline)
      const input: ReportGenerationInput = {
        reportId,
        documentName,
        category,
        riskScore,
        status,
        sha256: sha256 || reportData?.document_info?.sha256_hash,
        extractedFields: reportData?.ocr_and_extraction?.extracted_fields,
        tamperFindings: reportData?.ai_ml_analysis?.tamper_indicators,
        blockchain: reportData?.blockchain_verification,
      };

      ClientReportGenerator.download(input, format);
      notify.download(
        `${format.toUpperCase()} Report Generated`,
        `Saved official TRUSTCHAIN AI dossier [${reportId}].`
      );
    } catch (err: any) {
      notify.error('Download Failed', err.message || 'Could not export dossier.');
    } finally {
      setActiveDownloading(null);
    }
  };

  const buttonClasses =
    variant === 'primary'
      ? 'bg-brand-accent hover:bg-sky-600 text-white shadow-sm'
      : variant === 'secondary'
      ? 'bg-slate-800 hover:bg-slate-700 text-white'
      : 'border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 hover:border-brand-accent';

  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={activeDownloading !== null}
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold transition-all duration-150 ${buttonClasses} ${sizeClasses}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{activeDownloading ? `Exporting ${activeDownloading.toUpperCase()}...` : buttonLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 py-1.5 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-navy-800">
          <div className="px-3 py-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              TRUSTCHAIN AI EXPORT
            </span>
          </div>

          <div className="py-1">
            <button
              onClick={() => handleDownload('pdf')}
              className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors text-slate-700 dark:text-slate-200"
            >
              <FileText className="w-4 h-4 text-rose-500" />
              <div className="flex-1">
                <p className="font-bold">PDF Document (.pdf)</p>
                <p className="text-[10px] text-slate-400">Official Forensic Audit Certificate</p>
              </div>
            </button>

            <button
              onClick={() => handleDownload('docx')}
              className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors text-slate-700 dark:text-slate-200"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="font-bold">Microsoft Word (.doc)</p>
                <p className="text-[10px] text-slate-400">Structured Editable Dossier</p>
              </div>
            </button>

            <button
              onClick={() => handleDownload('html')}
              className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors text-slate-700 dark:text-slate-200"
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <div className="flex-1">
                <p className="font-bold">Web Report (.html)</p>
                <p className="text-[10px] text-slate-400">Self-Contained Responsive Dossier</p>
              </div>
            </button>

            <button
              onClick={() => handleDownload('json')}
              className="w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors text-slate-700 dark:text-slate-200"
            >
              <FileCode className="w-4 h-4 text-amber-500" />
              <div className="flex-1">
                <p className="font-bold">Machine JSON (.json)</p>
                <p className="text-[10px] text-slate-400">Schema v1.2.0 Cryptographic Data</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
