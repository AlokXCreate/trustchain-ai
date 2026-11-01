import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Institution, InstitutionStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const IssuerRegistryPage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdmin = role === 'admin';

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [officialDomain, setOfficialDomain] = useState('');
  const [orgType, setOrgType] = useState('Higher Education University');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInstitutions = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Institution[]>('/institutions/registry', {
        search: search || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
      setInstitutions(data);
    } catch {
      // Fallback demo institutions
      setInstitutions([
        {
          id: 'inst_mit_01',
          name: 'Massachusetts Institute of Technology (MIT)',
          official_domain: 'mit.edu',
          organization_type: 'Higher Education University',
          registration_number: 'EDU-US-MIT-1861',
          website: 'https://mit.edu',
          address: '77 Massachusetts Ave, Cambridge, MA 02139',
          contact_email: 'registrar@mit.edu',
          status: 'approved',
          approval_date: '2025-06-01',
          credentials_issued_count: 1420,
          verification_count: 3890,
          created_at: new Date().toISOString(),
        },
        {
          id: 'inst_stanford_02',
          name: 'Stanford University Registrar',
          official_domain: 'stanford.edu',
          organization_type: 'Higher Education University',
          registration_number: 'EDU-US-STAN-1885',
          website: 'https://stanford.edu',
          address: '450 Jane Stanford Way, Stanford, CA 94305',
          contact_email: 'registrar@stanford.edu',
          status: 'approved',
          approval_date: '2025-08-15',
          credentials_issued_count: 2150,
          verification_count: 5210,
          created_at: new Date().toISOString(),
        },
        {
          id: 'inst_oxford_03',
          name: 'Oxford Digital Academy & Certification',
          official_domain: 'oxford-digital.org',
          organization_type: 'Professional Training Institute',
          registration_number: 'UK-CER-OX-2021',
          website: 'https://oxford-digital.org',
          address: 'Wellington Square, Oxford OX1 2JD, UK',
          contact_email: 'accreditation@oxford-digital.org',
          status: 'under_review',
          credentials_issued_count: 0,
          verification_count: 12,
          created_at: new Date().toISOString(),
        },
        {
          id: 'inst_unverified_04',
          name: 'Global Tech Skills Academy',
          official_domain: 'globaltechskills-fake.net',
          organization_type: 'Private Training Provider',
          registration_number: 'PVT-SKL-9921',
          website: 'http://globaltechskills-fake.net',
          address: '10 Industrial Park, Road 4',
          contact_email: 'support@globaltechskills-fake.net',
          status: 'rejected',
          credentials_issued_count: 0,
          verification_count: 4,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, [selectedStatus]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newInst = await api.post<Institution>('/institutions/apply', {
        name,
        official_domain: officialDomain,
        organization_type: orgType,
        registration_number: registrationNumber,
        website,
        address,
        contact_email: contactEmail,
      });
      setInstitutions((prev) => [newInst, ...prev]);
      setIsApplyModalOpen(false);
      alert('Application submitted! Your institution is under administrative review.');
    } catch (err: any) {
      alert(err.message || 'Application submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminApproval = async (institutionId: string, status: InstitutionStatus) => {
    try {
      await api.put(`/institutions/${institutionId}/approve`, {
        status,
        notes: `Admin status change to ${status}`,
      });
      fetchInstitutions();
    } catch (err: any) {
      alert(err.message || 'Approval update failed');
    }
  };

  const getStatusBadge = (status: InstitutionStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Accredited Issuer</Badge>;
      case 'under_review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'pending':
        return <Badge variant="info">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected / Blacklisted</Badge>;
      case 'suspended':
        return <Badge variant="danger">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{String(status).toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text dark:text-white tracking-tight">
            Institutional Issuer Registry
          </h1>
          <p className="text-xs text-brand-muted dark:text-slate-400 mt-1">
            Directory of accredited universities, colleges, and authorized certification authorities.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsApplyModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Apply as Accredited Issuer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by institution name, domain (.edu), or registration ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl pl-9 pr-3 py-2 text-brand-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white focus:outline-none"
          >
            <option value="all">All Accreditation Statuses</option>
            <option value="approved">Approved & Accredited</option>
            <option value="under_review">Under Review</option>
            <option value="pending">Pending Application</option>
            <option value="rejected">Rejected / Unaccredited</option>
          </select>
        </div>
      </Card>

      {/* Institutions Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {institutions.map((inst) => (
          <Card key={inst.id} className="flex flex-col justify-between p-6 space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-brand-accent font-bold text-lg flex-shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-text dark:text-white">
                      {inst.name}
                    </h3>
                    <span className="text-xs font-mono text-brand-accent font-semibold flex items-center gap-1 mt-0.5">
                      <Globe className="w-3.5 h-3.5" /> {inst.official_domain}
                    </span>
                  </div>
                </div>
                {getStatusBadge(inst.status)}
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Accreditation ID:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    {inst.registration_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Organization Type:</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {inst.organization_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered Office:</span>
                  <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                    {inst.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verifications Processed:</span>
                  <span className="text-emerald-600 font-bold">
                    {inst.verification_count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Controls Panel */}
            {isAdmin && (
              <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Admin Review:
                </span>
                <div className="flex items-center gap-2">
                  {inst.status !== 'approved' && (
                    <button
                      onClick={() => handleAdminApproval(inst.id, 'approved')}
                      className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100 font-semibold text-[11px]"
                    >
                      Approve
                    </button>
                  )}
                  {inst.status !== 'rejected' && (
                    <button
                      onClick={() => handleAdminApproval(inst.id, 'rejected')}
                      className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 font-semibold text-[11px]"
                    >
                      Reject
                    </button>
                  )}
                  {inst.status !== 'suspended' && (
                    <button
                      onClick={() => handleAdminApproval(inst.id, 'suspended')}
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 hover:bg-slate-200 font-semibold text-[11px]"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Apply as Accredited Issuer Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply as Accredited Issuer"
        subtitle="Submit institutional credentials for verification and domain registry authorization"
      >
        <form onSubmit={handleApply} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Institution Legal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Oxford Digital Academy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Domain
              </label>
              <input
                type="text"
                required
                placeholder="e.g. oxford.edu"
                value={officialDomain}
                onChange={(e) => setOfficialDomain(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization Type
              </label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              >
                <option value="Higher Education University">Higher Education University</option>
                <option value="Professional Training Institute">Professional Training Institute</option>
                <option value="Certification Body">Certification Body</option>
                <option value="Corporate Enterprise">Corporate Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                State Registration / Charter ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EDU-UK-OX-1249"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Website
              </label>
              <input
                type="url"
                required
                placeholder="https://oxford.edu"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registrar Contact Email
            </label>
            <input
              type="email"
              required
              placeholder="registrar@oxford.edu"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Physical Campus / Office Address
            </label>
            <textarea
              rows={2}
              required
              placeholder="Full address of the credential office..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl px-3 py-2 text-brand-text dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-navy-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
