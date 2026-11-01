import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  File,
  FileCheck2,
  AlertCircle,
  X,
  Building2,
  Calendar,
  Hash,
  ArrowRight,
  ShieldAlert,
  Camera,
  Check,
} from 'lucide-react';
import { DocumentCategory } from '../../types';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const DocumentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState<DocumentCategory>('degree');
  const [issuerName, setIssuerName] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const maxBytes = 15 * 1024 * 1024; // 15MB

  const handleFileValidation = (file: File) => {
    setError('');
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setError(`Unsupported file type '${ext}'. Please upload PDF, JPG, or PNG.`);
      return false;
    }
    if (file.size > maxBytes) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 15MB.`);
      return false;
    }
    setSelectedFile(file);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or drop a document to upload.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    if (issuerName) formData.append('issuer_name', issuerName);
    if (certificateNumber) formData.append('certificate_number', certificateNumber);
    if (issueDate) formData.append('issue_date', issueDate);
    if (expirationDate) formData.append('expiration_date', expirationDate);

    try {
      setUploadProgress(60);
      const res = await api.postForm<any>('/documents/upload', formData);
      setUploadProgress(100);

      // Redirect immediately to verification workspace for this doc
      setTimeout(() => {
        navigate(`/app/verify/${res.id}`);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please verify network connection.');
      setUploadProgress(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { id: DocumentCategory; label: string }[] = [
    { id: 'degree', label: 'Degree Certificate' },
    { id: 'marksheet', label: 'Marksheet / Transcript' },
    { id: 'internship', label: 'Internship Certificate' },
    { id: 'training', label: 'Training Certificate' },
    { id: 'experience', label: 'Experience Letter' },
    { id: 'skill', label: 'Skill Certificate' },
    { id: 'other', label: 'Other Credential' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight">
          Upload & Verify Document
        </h1>
        <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
          Submit credential documents for multi-stage forensic analysis, issuer accreditation lookup, and ledger verification.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag and Drop Zone */}
        <Card className="p-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-brand-accent bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-navy-700 hover:border-brand-accent/50 bg-slate-50/50 dark:bg-navy-900/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileValidation(e.target.files[0]);
                }
              }}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 flex items-center justify-center">
                  <FileCheck2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-text dark:text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-brand-muted dark:text-slate-400 mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:underline mt-2 font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 dark:bg-brand-accent/20 border border-brand-accent/30 text-brand-accent flex items-center justify-center">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-text dark:text-white">
                    Drag and drop your document here, or <span className="text-brand-accent underline">browse</span>
                  </p>
                  <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
                    Supports high-resolution PDF, JPG, JPEG, or PNG (up to 15MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-brand-muted dark:text-slate-400">
                <span>Uploading and hashing document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-accent transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Metadata Configuration */}
        <Card className="space-y-5">
          <h2 className="text-sm font-bold text-brand-text dark:text-white border-b border-slate-100 dark:border-navy-800 pb-3">
            Document Categorization & Metadata
          </h2>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Document Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    category === c.id
                      ? 'bg-brand-accent text-white shadow-sm font-semibold'
                      : 'bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:border-brand-accent/50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Declared Issuing Institution
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Stanford University or MIT"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Certificate or Roll Number
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. STAN-CS-2024-8841"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expiration Date (If Applicable)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/app/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Submit for Verification
          </Button>
        </div>
      </form>
    </div>
  );
};
