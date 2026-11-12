import React, { useState, useEffect } from 'react';
import {
  Key,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Cpu,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { aiProviderService, AIModelProvider } from '../../services/aiProviderService';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../ui/Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  if (!isOpen) return null;

  const notify = useNotification();
  const [provider, setProvider] = useState<AIModelProvider>('offline');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const cfg = aiProviderService.getStoredConfig();
    setProvider(cfg.provider);
    setGeminiKey(cfg.geminiKey || '');
    setOpenaiKey(cfg.openaiKey || '');
  }, [isOpen]);

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const activeKey = provider === 'gemini' ? geminiKey : openaiKey;
      const res = await aiProviderService.testConnection(provider, activeKey);
      setTestResult(res);
      if (res.success) {
        notify.success('AI Model Connected', res.message);
      } else {
        notify.error('Connection Failed', res.message);
      }
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    aiProviderService.saveConfig({
      provider,
      geminiKey,
      openaiKey,
    });
    notify.success('AI Settings Saved', `Active model set to: ${aiProviderService.getActiveProviderName()}`);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-navy-850 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 text-brand-accent flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Model & API Key Configuration
              </h3>
              <p className="text-[11px] text-slate-500">
                Enhance TrustChain AI Assistant with live Gemini or OpenAI models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Provider Selector Cards */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Inference Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProvider('gemini');
                  setTestResult(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-brand-accent bg-brand-accent/10 text-brand-accent font-bold ring-1 ring-brand-accent'
                    : 'border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Google Gemini</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] text-slate-500">1.5 Flash (Recommended)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProvider('openai');
                  setTestResult(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'border-brand-accent bg-brand-accent/10 text-brand-accent font-bold ring-1 ring-brand-accent'
                    : 'border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">OpenAI</span>
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] text-slate-500">GPT-4o / GPT-4o-mini</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProvider('offline');
                  setTestResult(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'offline'
                    ? 'border-brand-accent bg-brand-accent/10 text-brand-accent font-bold ring-1 ring-brand-accent'
                    : 'border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Built-In Offline</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-[10px] text-slate-500">No Key Needed</p>
              </button>
            </div>
          </div>

          {/* Key Input depending on chosen provider */}
          {provider === 'gemini' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Google Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-brand-accent hover:underline flex items-center gap-1"
                >
                  Get free key from Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showGemini ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 pr-9 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-brand-accent/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showGemini ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {provider === 'openai' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  OpenAI API Key
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-brand-accent hover:underline flex items-center gap-1"
                >
                  Get API key from OpenAI <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showOpenai ? 'text' : 'password'}
                  placeholder="sk-proj-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 pr-9 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-brand-accent/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenai(!showOpenai)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOpenai ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {provider === 'offline' && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Zero-Configuration Offline Forensic Mode</p>
                <p className="text-[11px] mt-0.5 text-emerald-700 dark:text-emerald-400">
                  Operates 100% locally with TrustChain's built-in forensic rules, OCR checks, and smart contract registry simulators without sending data to external APIs.
                </p>
              </div>
            </div>
          )}

          {/* Test Status Feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-center space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              )}
              <span className="text-[11px] font-semibold">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-navy-850 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
          <div>
            {provider !== 'offline' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestKey}
                disabled={testing}
                icon={<RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />}
              >
                {testing ? 'Verifying Key...' : 'Test Connection'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save AI Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

