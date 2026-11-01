import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

// Route Code-Splitting (Optimized Bundle Size)
const LandingPage = lazy(() => import('./pages/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/auth/AuthPages').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/AuthPages').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/AuthPages').then(m => ({ default: m.ForgotPasswordPage })));
const PublicVerificationPage = lazy(() => import('./pages/verify/PublicVerificationPage').then(m => ({ default: m.PublicVerificationPage })));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DocumentUploadPage = lazy(() => import('./pages/upload/DocumentUploadPage').then(m => ({ default: m.DocumentUploadPage })));
const VerificationWorkspacePage = lazy(() => import('./pages/verify/VerificationWorkspacePage').then(m => ({ default: m.VerificationWorkspacePage })));
const VerificationHistoryPage = lazy(() => import('./pages/history/VerificationHistoryPage').then(m => ({ default: m.VerificationHistoryPage })));
const DigitalCredentialsPage = lazy(() => import('./pages/credentials/DigitalCredentialsPage').then(m => ({ default: m.DigitalCredentialsPage })));
const IssuerRegistryPage = lazy(() => import('./pages/issuers/IssuerRegistryPage').then(m => ({ default: m.IssuerRegistryPage })));
const BulkVerificationPage = lazy(() => import('./pages/bulk/BulkVerificationPage').then(m => ({ default: m.BulkVerificationPage })));
const AIAssistantPage = lazy(() => import('./pages/assistant/AIAssistantPage').then(m => ({ default: m.AIAssistantPage })));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const AuditTrailPage = lazy(() => import('./pages/audit/AuditTrailPage').then(m => ({ default: m.AuditTrailPage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-3">
    <div className="w-10 h-10 border-3 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading TrustChain Module...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* Public Landing, Authentication & Public Verifier */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/verify/public" element={<PublicVerificationPage />} />
              <Route path="/verify/credential/:credentialId" element={<PublicVerificationPage />} />
              <Route path="/verify-credential" element={<PublicVerificationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Authenticated Application Shell */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="upload" element={<DocumentUploadPage />} />
                <Route path="verify" element={<VerificationWorkspacePage />} />
                <Route path="verify/:docId" element={<VerificationWorkspacePage />} />
                <Route path="history" element={<VerificationHistoryPage />} />
                <Route path="credentials" element={<DigitalCredentialsPage />} />
                <Route path="issuers" element={<IssuerRegistryPage />} />
                <Route path="bulk" element={<BulkVerificationPage />} />
                <Route path="assistant" element={<AIAssistantPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="audit" element={<AuditTrailPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
