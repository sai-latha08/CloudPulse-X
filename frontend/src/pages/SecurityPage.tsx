import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SecuritySummary } from '../types';
import { useScenario } from '../store/scenarioContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SecurityPage: React.FC = () => {
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [remediating, setRemediating] = useState<string | null>(null);
  const { refreshTrigger } = useScenario();
  const navigate = useNavigate();

  const fetchSecurity = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSecuritySummary();
      setSummary(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load security findings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurity();
  }, [refreshTrigger]);

  const handleRemediate = async (findingCode: string) => {
    setRemediating(findingCode);
    try {
      await api.remediateFinding(findingCode);
      await fetchSecurity();
    } catch (e) {
      console.error(e);
    } finally {
      setRemediating(null);
    }
  };

  if (loading) return <LoadingState message="Auditing AWS CIS benchmarks, IAM roles, and security groups..." />;
  if (error || !summary) return <ErrorState title="Security Audit Error" message={error || 'Failed to load findings'} onRetry={fetchSecurity} />;

  const filteredFindings = summary.findings.filter((f) => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Cloud Security Intelligence
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              AWS CIS Benchmarks
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Continuous posture evaluation across IAM permissions, public ingress security groups, S3 encryption, and VPC perimeter.
          </p>
        </div>

        <button
          onClick={() => navigate('/copilot')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-charcoal-800 bg-peach-100 hover:bg-peach-200 border border-peach-300 rounded-xl transition-colors shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 text-peach-600 fill-peach-400" />
          <span>Ask Copilot to Triage Security</span>
        </button>
      </div>

      {/* Security Posture Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Security Score</p>
          <p className={`text-3xl font-extrabold font-mono mt-1 ${summary.security_score >= 85 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.security_score}%
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Weighted posture index</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Critical Exposures</p>
          <p className={`text-3xl font-extrabold font-mono mt-1 ${summary.critical_count > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {summary.critical_count}
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Requires immediate patch</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">High Risk Findings</p>
          <p className="text-3xl font-extrabold font-mono text-orange-600 mt-1">
            {summary.high_count}
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">IAM & Access Policy</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Total Checks Evaluated</p>
          <p className="text-3xl font-extrabold font-mono text-charcoal-800 mt-1">
            {summary.total_findings}
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Multi-resource audit</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Findings' },
          { id: 'security_group', label: 'Security Groups (Firewalls)' },
          { id: 'iam', label: 'IAM Least Privilege' },
          { id: 's3', label: 'S3 Storage & KMS' },
          { id: 'infrastructure', label: 'Infrastructure & DBs' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-peach-500 text-white border-peach-600 shadow-sm'
                : 'bg-white text-charcoal-700 border-[#EDE3DE] hover:border-peach-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Findings Matrix */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => {
          const isRemediated = finding.status === 'remediated';
          const isProcessing = remediating === finding.finding_code;

          return (
            <div
              key={finding.id}
              className={`bg-white border rounded-3xl p-6 shadow-subtle transition-all ${
                isRemediated ? 'border-emerald-200 bg-emerald-50/10' : 'border-[#EDE3DE] hover:border-peach-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDE3DE]">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isRemediated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isRemediated ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-peach-800 bg-peach-100 px-2 py-0.5 rounded border border-peach-200">
                        {finding.finding_code}
                      </span>
                      <SeverityBadge severity={finding.severity} />
                      <span className="text-[11px] font-semibold text-charcoal-500 uppercase font-mono">
                        {finding.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-charcoal-800 mt-1">{finding.title}</h4>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize self-start sm:self-center ${
                  isRemediated
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {finding.status}
                </span>
              </div>

              {/* Finding Content */}
              <div className="py-4 space-y-3 text-xs">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Description & Risk</p>
                  <p className="text-charcoal-700 mt-0.5 leading-relaxed">{finding.description}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-charcoal-50/80 border border-[#EDE3DE] font-mono text-[11px]">
                  <span className="text-charcoal-400 font-bold block mb-1 uppercase">// Evaluated Evidence:</span>
                  <p className="text-charcoal-800">{finding.evidence}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-peach-50/70 border border-peach-200/80">
                  <span className="text-peach-900 font-bold block mb-1 uppercase text-[10px]">
                    Recommended Fix Strategy:
                  </span>
                  <p className="text-charcoal-700 leading-relaxed">{finding.recommendation}</p>
                </div>
              </div>

              {/* Footer with One-Click Fix */}
              <div className="pt-3 border-t border-[#EDE3DE] flex items-center justify-between">
                <span className="text-xs text-charcoal-500">
                  Target Asset: <strong className="font-mono text-charcoal-700">{finding.resource_name}</strong>
                </span>

                {isRemediated ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Remediated</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleRemediate(finding.finding_code)}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 disabled:opacity-50 rounded-xl transition-all shadow-subtle hover:scale-[1.02]"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'Applying Fix...' : 'Apply One-Click Fix'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
