import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  User,
  Building2,
  Briefcase,
  ShieldAlert,
  Mail,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole, loginAsGuest, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const notify = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const continueToNext = () => {
    const isCompleted = localStorage.getItem('tc_profile_completed') === 'true';
    if (!isCompleted) {
      navigate('/profile-setup');
    } else {
      navigate('/app/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      notify.success('Authentication Successful', `Welcome to TrustChain AI, ${email}`);
      continueToNext();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      notify.error('Login Failed', err.message || 'Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const gUser = await loginWithGoogle();
      notify.success('Google Authentication Successful', `Connected as ${gUser.email}`);
      continueToNext();
    } catch (err: any) {
      notify.error('Google Sign-in Failed', err.message || 'Could not connect with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      await switchDemoRole(role);
      const roleNames: Record<UserRole, string> = {
        individual: 'Alex Mercer (Student / Individual)',
        institution: 'Dr. Eleanor Vance (MIT Registrar)',
        verifier: 'Marcus Chen (Corporate HR Verifier)',
        admin: 'Sarah Connor (Platform Admin)',
      };
      notify.success('Persona Switched', `Logged in as ${roleNames[role]}`);
      continueToNext();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    loginAsGuest();
    notify.info('Guest Mode Active', 'Exploring TrustChain AI platform as a guest.');
    continueToNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg dark:bg-navy-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-brand-text dark:text-white">
              TrustChain <span className="text-brand-accent text-sm font-bold uppercase">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-brand-text dark:text-white">
            Welcome to TrustChain AI
          </h2>
          <p className="text-xs text-brand-muted dark:text-slate-400">
            Sign in with Google, email, or explore instantly as a Guest.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-xl space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-navy-600 hover:border-slate-400 dark:hover:border-navy-500 bg-white dark:bg-navy-900 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* 2. Instant Guest Explorer */}
          <button
            type="button"
            onClick={handleGuestAccess}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-amber-300 dark:border-amber-700/60 hover:bg-amber-50 dark:hover:bg-amber-950/20 bg-amber-50/50 dark:bg-amber-950/10 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Login as Guest Explorer (Instant 1-Click)</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 dark:border-navy-700 w-full" />
            <span className="bg-white dark:bg-navy-850 px-3 text-[10px] font-bold uppercase text-slate-400 absolute">
              Or sign in with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work or Academic Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu or name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2.5 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-brand-accent hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2.5 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Quick Demo Personas */}
          <div className="pt-3 border-t border-slate-100 dark:border-navy-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-accent" /> Or Select Demo Role
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Instant Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleDemoLogin('individual')}
                className="p-2 rounded-lg border border-slate-200 dark:border-navy-700 hover:border-brand-accent bg-slate-50 dark:bg-navy-900 text-left transition-colors"
              >
                <p className="text-[11px] font-bold text-brand-text dark:text-slate-200">Alex Mercer</p>
                <p className="text-[9px] text-brand-muted">Individual / Student</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('institution')}
                className="p-2 rounded-lg border border-slate-200 dark:border-navy-700 hover:border-brand-accent bg-slate-50 dark:bg-navy-900 text-left transition-colors"
              >
                <p className="text-[11px] font-bold text-brand-text dark:text-slate-200">Dr. Vance (MIT)</p>
                <p className="text-[9px] text-brand-muted">University Registrar</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('verifier')}
                className="p-2 rounded-lg border border-slate-200 dark:border-navy-700 hover:border-brand-accent bg-slate-50 dark:bg-navy-900 text-left transition-colors"
              >
                <p className="text-[11px] font-bold text-brand-text dark:text-slate-200">Marcus Chen</p>
                <p className="text-[9px] text-brand-muted">Corporate HR Verifier</p>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2 rounded-lg border border-slate-200 dark:border-navy-700 hover:border-brand-accent bg-slate-50 dark:bg-navy-900 text-left transition-colors"
              >
                <p className="text-[11px] font-bold text-brand-text dark:text-slate-200">Sarah Connor</p>
                <p className="text-[9px] text-brand-muted">Platform Admin</p>
              </button>
            </div>

            <button
              type="button"
              onClick={handleGuestAccess}
              className="w-full py-2 px-3 mt-2 rounded-xl border border-dashed border-slate-300 dark:border-navy-600 hover:border-brand-accent hover:bg-slate-50 dark:hover:bg-navy-900 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Guest Explorer (No Credentials Required)</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-brand-muted dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-accent hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const notify = useNotification();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('individual');
  const [organizationName, setOrganizationName] = useState('');
  const [designation, setDesignation] = useState('');
  const [country, setCountry] = useState('United States');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({
        full_name: fullName,
        email,
        password,
        role,
        organization_name: organizationName || undefined,
        designation: designation || undefined,
        country,
      });
      notify.success('Account Created', `Welcome to TrustChain AI, ${fullName || email}!`);
      navigate('/profile-setup');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      notify.error('Registration Failed', err.message || 'Please verify form fields.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions: { id: UserRole; title: string; desc: string; icon: any }[] = [
    {
      id: 'individual',
      title: 'Individual User',
      desc: 'Verify diplomas, store credentials & share proofs',
      icon: <User className="w-4 h-4 text-brand-accent" />,
    },
    {
      id: 'institution',
      title: 'Institution / Issuer',
      desc: 'Issue accredited degrees and verifiable certificates',
      icon: <Building2 className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'verifier',
      title: 'HR / Recruiter',
      desc: 'Bulk verify candidates and audit credentials',
      icon: <Briefcase className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'admin',
      title: 'Administrator',
      desc: 'Accredit institutions and monitor audit logs',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg dark:bg-navy-950">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-brand-text dark:text-white">
              TrustChain <span className="text-brand-accent text-sm font-bold uppercase">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-brand-text dark:text-white">
            Create Your Account
          </h2>
          <p className="text-xs text-brand-muted dark:text-slate-400">
            Select your account type to configure role-based verification features.
          </p>
        </div>

        <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Choose Account Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roleOptions.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      role === r.id
                        ? 'border-brand-accent bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-brand-accent'
                        : 'border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {r.icon}
                      <span className="text-xs font-bold text-brand-text dark:text-slate-200">
                        {r.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-brand-muted dark:text-slate-400">
                      {r.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / University (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MIT, Stanford, Apex HR"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Graduate Student, Registrar"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-muted dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg dark:bg-navy-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-brand-text dark:text-white">
              TrustChain <span className="text-brand-accent text-sm font-bold uppercase">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-brand-text dark:text-white">
            Reset Password
          </h2>
          <p className="text-xs text-brand-muted dark:text-slate-400">
            Enter your email to receive secure recovery instructions.
          </p>
        </div>

        <div className="bg-white dark:bg-navy-850 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-xl space-y-5">
          {submitted ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-brand-text dark:text-white">
                Recovery Instructions Dispatched
              </p>
              <p className="text-xs text-brand-muted dark:text-slate-400">
                If an account exists for {email}, a recovery link has been sent.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm" className="mt-4">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Account Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-brand-muted dark:text-slate-400">
          Remember password?{' '}
          <Link to="/login" className="font-semibold text-brand-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
