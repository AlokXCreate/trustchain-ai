import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  User as UserIcon,
  Building2,
  Briefcase,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';

export const ProfileSetupPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const notify = useNotification();

  const [fullName, setFullName] = useState(user?.full_name || 'Alex Mercer');
  const [role, setRole] = useState<UserRole>(user?.role || 'individual');
  const [organizationName, setOrganizationName] = useState(
    user?.organization_name || (user?.role === 'institution' ? 'Stanford University Registrar' : 'Stanford University')
  );
  const [designation, setDesignation] = useState(
    user?.designation || (user?.role === 'institution' ? 'Chief Registrar' : user?.role === 'verifier' ? 'HR Talent Director' : 'Computer Science Graduate')
  );
  const [country, setCountry] = useState(user?.country || 'United States');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('gradient-blue');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatars = [
    { id: 'gradient-blue', bg: 'from-blue-600 to-indigo-600', label: 'Indigo' },
    { id: 'gradient-teal', bg: 'from-teal-500 to-emerald-600', label: 'Teal' },
    { id: 'gradient-purple', bg: 'from-purple-600 to-pink-600', label: 'Purple' },
    { id: 'gradient-amber', bg: 'from-amber-500 to-rose-500', label: 'Amber' },
  ];

  const roleOptions: {
    id: UserRole;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    defaultOrg: string;
    defaultDesig: string;
  }[] = [
    {
      id: 'individual',
      title: 'Individual / Student',
      subtitle: 'Upload, store, and share cryptographically authenticated credentials.',
      icon: <Award className="w-5 h-5 text-blue-500" />,
      defaultOrg: 'Stanford University Alumni',
      defaultDesig: 'Computer Science Graduate',
    },
    {
      id: 'institution',
      title: 'Issuing Institution',
      subtitle: 'Issue tamper-proof degrees, register hashes on-chain, and manage accreditation.',
      icon: <Building2 className="w-5 h-5 text-indigo-500" />,
      defaultOrg: 'Massachusetts Institute of Technology (MIT)',
      defaultDesig: 'Registrar & Credentialing Dean',
    },
    {
      id: 'verifier',
      title: 'Corporate Verifier / HR',
      subtitle: 'Authenticate applicant credentials with multi-modal forensic AI in seconds.',
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
      defaultOrg: 'Apex Global Talent Recruiter',
      defaultDesig: 'Head of Technical Recruiting',
    },
    {
      id: 'admin',
      title: 'Security Auditor / Admin',
      subtitle: 'Monitor cryptographic health, Ethereum smart contracts, and forensic logs.',
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      defaultOrg: 'TrustChain Security Operations',
      defaultDesig: 'Chief Compliance Officer',
    },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    const preset = roleOptions.find((r) => r.id === newRole);
    if (preset) {
      if (!organizationName || organizationName.includes('Stanford') || organizationName.includes('MIT') || organizationName.includes('Apex')) {
        setOrganizationName(preset.defaultOrg);
      }
      if (!designation || designation.includes('Graduate') || designation.includes('Registrar') || designation.includes('Recruiting')) {
        setDesignation(preset.defaultDesig);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateProfile({
        full_name: fullName.trim() || 'Verified Member',
        role,
        organization_name: organizationName.trim() || 'TrustChain Network',
        organization_type: role === 'institution' ? 'University' : role === 'verifier' ? 'Corporate HR' : 'Individual',
        designation: designation.trim() || 'Account Holder',
        country: country.trim() || 'United States',
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });

      notify.success(
        'Profile Configured Successfully',
        `Welcome to TrustChain AI, ${fullName.trim()}! Workspace is ready.`
      );

      setTimeout(() => {
        navigate('/app/dashboard');
      }, 700);
    } catch (err: any) {
      notify.error('Profile Setup Failed', err.message || 'Please verify form fields.');
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'TC';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Brand & Step Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-teal flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-brand-text dark:text-white">
              TrustChain <span className="text-brand-accent text-sm font-bold uppercase">AI</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2 of 2: Create Your Verification Profile</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Set Up Your Verification Identity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Personalize your role, organization, and cryptographic security credentials to unlock the TrustChain workspace.
          </p>
        </div>

        {/* Profile Card Form */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Avatar & Basic Identity */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-navy-800">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${
                    avatars.find((a) => a.id === selectedAvatar)?.bg || 'from-blue-600 to-indigo-600'
                  } flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20`}
                >
                  {getInitials(fullName)}
                </div>
                <div className="flex gap-1.5 mt-1">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`w-5 h-5 rounded-full bg-gradient-to-tr ${av.bg} transition-transform ${
                        selectedAvatar === av.id ? 'scale-125 ring-2 ring-brand-accent ring-offset-2' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={av.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'user@trustchain.ai'}
                    className="w-full text-xs bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2.5 text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select Your Primary Organization Role *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleRoleChange(opt.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      role === opt.id
                        ? 'border-brand-accent bg-blue-50/60 dark:bg-blue-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-navy-800 hover:border-slate-300 dark:hover:border-navy-700 bg-white dark:bg-navy-950'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white dark:bg-navy-900 shadow-sm flex-shrink-0">
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {opt.title}
                        </h4>
                        {role === opt.id && (
                          <CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Organization / University *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Designation *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Chief Registrar"
                    className="w-full text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Country / Jurisdiction *
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States"
                    className="w-full text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                  />
                </div>
              </div>
            </div>

            {/* Cryptographic Security Assurance */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                <span>
                  Default Ledger Anchor: <strong>Ethereum Sepolia Testnet</strong> • SHA-256 Vector Forensics Active
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                Online Ready
              </span>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/app/dashboard')}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline font-medium"
              >
                Skip for now, launch with defaults →
              </button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                icon={<ArrowRight className="w-4 h-4" />}
                className="px-6"
              >
                Complete Profile & Launch Workspace
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

