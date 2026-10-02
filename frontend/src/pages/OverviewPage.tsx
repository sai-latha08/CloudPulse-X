import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { OverviewData } from '../types';
import { useScenario } from '../store/scenarioContext';
import { MetricCard } from '../components/common/MetricCard';
import { HealthBadge } from '../components/common/HealthBadge';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  Activity,
  AlertOctagon,
  ShieldAlert,
  DollarSign,
  Server,
  Sparkles,
  GitCommit,
  Clock,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const OverviewPage: React.FC = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useScenario();
  const navigate = useNavigate();

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.getOverview();
      setData(resp);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch overview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [refreshTrigger]);

  if (loading) return <LoadingState message="Correlating cloud telemetry and computing health scores..." />;
  if (error || !data) return <ErrorState title="Overview Unavailable" message={error || 'Unable to connect to backend'} onRetry={fetchOverview} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Executive Cloud Overview
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              AWS Production
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time unified health scoring, active incidents, security exposures, and FinOps metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/copilot"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-charcoal-800 bg-peach-100 hover:bg-peach-200 border border-peach-300 rounded-xl transition-colors shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-peach-600 fill-peach-400" />
            <span>AI Copilot Briefing</span>
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Cloud Health"
          value={formatPercent(data.overall_health.overall)}
          subtitle={data.overall_health.status_label}
          badgeText={data.overall_health.status_label}
          badgeColor={data.overall_health.overall >= 90 ? 'emerald' : data.overall_health.overall >= 70 ? 'amber' : 'rose'}
          icon={Activity}
          onClick={() => navigate('/observability')}
        />

        <MetricCard
          title="Active Incidents"
          value={data.active_incidents_count}
          subtitle={data.active_incidents_count > 0 ? 'Requires attention' : 'All clear'}
          badgeText={data.active_incidents_count > 0 ? 'Action Req.' : 'Nominal'}
          badgeColor={data.active_incidents_count > 0 ? 'rose' : 'emerald'}
          icon={AlertOctagon}
          onClick={() => navigate('/incidents')}
        />

        <MetricCard
          title="Critical Security"
          value={data.critical_security_count}
          subtitle={`${data.total_security_findings} total findings`}
          badgeText={data.critical_security_count > 0 ? 'Exposures' : 'Secured'}
          badgeColor={data.critical_security_count > 0 ? 'rose' : 'emerald'}
          icon={ShieldAlert}
          onClick={() => navigate('/security')}
        />

        <MetricCard
          title="Monthly Cost"
          value={formatCurrency(data.monthly_estimated_cost)}
          subtitle="Projected AWS spend"
          icon={DollarSign}
          onClick={() => navigate('/cost')}
        />

        <MetricCard
          title="Potential Savings"
          value={formatCurrency(data.potential_savings)}
          subtitle="FinOps Rightsizing"
          badgeText="Optimize"
          badgeColor="emerald"
          icon={TrendingDown}
          onClick={() => navigate('/cost')}
        />

        <MetricCard
          title="Monitored Assets"
          value={data.resources_monitored}
          subtitle={`SLA: ${data.availability_sla}%`}
          icon={Server}
          onClick={() => navigate('/infrastructure')}
        />
      </div>

      {/* Multi-Dimensional Health Breakdown Bar */}
      <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EDE3DE] gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-peach-600" />
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Computed Health Score Breakdown (0 - 100)
            </h3>
          </div>
          <span className="text-xs text-charcoal-500 font-medium">Dynamic multi-signal algorithm</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-charcoal-600">Performance</span>
              <span className="font-mono text-charcoal-800">{data.overall_health.performance}%</span>
            </div>
            <div className="w-full h-2.5 bg-charcoal-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  data.overall_health.performance >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${data.overall_health.performance}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-charcoal-600">Reliability & SLA</span>
              <span className="font-mono text-charcoal-800">{data.overall_health.reliability}%</span>
            </div>
            <div className="w-full h-2.5 bg-charcoal-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  data.overall_health.reliability >= 85 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${data.overall_health.reliability}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-charcoal-600">Security Posture</span>
              <span className="font-mono text-charcoal-800">{data.overall_health.security}%</span>
            </div>
            <div className="w-full h-2.5 bg-charcoal-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  data.overall_health.security >= 85 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${data.overall_health.security}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-charcoal-600">Cost Efficiency</span>
              <span className="font-mono text-charcoal-800">{data.overall_health.cost_efficiency}%</span>
            </div>
            <div className="w-full h-2.5 bg-charcoal-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-peach-500 transition-all"
                style={{ width: `${data.overall_health.cost_efficiency}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Incidents & Recommended Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Incidents & RCA summary */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE3DE] mb-4">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                  Active Correlated Incidents
                </h3>
              </div>
              <Link to="/incidents" className="text-xs font-bold text-peach-700 hover:text-peach-800 flex items-center gap-1">
                <span>View All ({data.top_incidents.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {data.top_incidents.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-charcoal-800">Zero Active Incidents</h4>
                <p className="text-xs text-charcoal-500 mt-1">All cloud infrastructure signals are operating within normal baseline limits.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.top_incidents.map((inc: any) => (
                  <div key={inc.id} className="p-4 rounded-2xl bg-peach-50/40 border border-peach-200">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-peach-800 bg-peach-100 px-2 py-0.5 rounded border border-peach-200">
                          {inc.incident_code}
                        </span>
                        <SeverityBadge severity={inc.severity} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {Math.round(inc.confidence_score * 100)}% Confidence
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-charcoal-800">{inc.title}</h4>
                    <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">{inc.probable_cause}</p>

                    <div className="mt-3 pt-3 border-t border-peach-200/80 flex items-center justify-between">
                      <span className="text-[11px] text-charcoal-500">
                        Target: <strong className="font-mono text-charcoal-700">{inc.affected_resources?.join(', ')}</strong>
                      </span>
                      <Link
                        to="/rca"
                        className="inline-flex items-center gap-1 text-xs font-bold text-peach-800 hover:text-peach-900"
                      >
                        <span>Deep-Dive RCA</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Deployments Strip */}
          <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE3DE] mb-4">
              <div className="flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-peach-600" />
                <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                  Recent Production Deployments
                </h3>
              </div>
              <span className="text-xs text-charcoal-500">CI/CD Correlation Stream</span>
            </div>

            <div className="space-y-3">
              {data.recent_deployments.map((dep: any) => (
                <div key={dep.id} className="p-3.5 rounded-2xl bg-charcoal-50/50 border border-[#EDE3DE] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-peach-100 text-peach-800">
                      <GitCommit className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal-800">{dep.title}</h4>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">{dep.actor} • {dep.description}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-charcoal-500">
                    {new Date(dep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controlled Remediations & Live Events */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Remediation Actions */}
          <div className="bg-white border border-peach-300 rounded-3xl p-6 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE3DE] mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-peach-600" />
                <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                  Actionable Remediations
                </h3>
              </div>
              <Link to="/remediation" className="text-xs font-bold text-peach-700">
                Remediation Center
              </Link>
            </div>

            <div className="space-y-3">
              {data.high_priority_remediations.map((rem: any) => (
                <div key={rem.id} className="p-4 rounded-2xl bg-peach-50/50 border border-peach-200">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-bold text-charcoal-800">{rem.title}</h5>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {rem.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">{rem.description}</p>
                  
                  <div className="mt-3 pt-2 border-t border-peach-200/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-charcoal-500">{rem.target_resource_id}</span>
                    <Link
                      to="/remediation"
                      className="px-3 py-1 text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 rounded-xl shadow-subtle transition-colors"
                    >
                      Review & Approve
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Real-time Event Stream */}
          <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE3DE] mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-peach-600" />
                <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                  Live Infrastructure Events
                </h3>
              </div>
              <Link to="/events" className="text-xs font-bold text-peach-700">
                Full Stream
              </Link>
            </div>

            <div className="space-y-3">
              {data.recent_events.slice(0, 4).map((evt: any) => (
                <div key={evt.id} className="p-3 rounded-2xl bg-charcoal-50/50 border border-[#EDE3DE] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-charcoal-800">{evt.title}</span>
                    <span className="text-[10px] font-mono text-charcoal-500">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 leading-relaxed">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
