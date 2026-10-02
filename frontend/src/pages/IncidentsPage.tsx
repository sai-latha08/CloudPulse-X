import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Incident } from '../types';
import { useScenario } from '../store/scenarioContext';
import { IncidentCard } from '../components/incidents/IncidentCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const { refreshTrigger } = useScenario();

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [refreshTrigger]);

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter === 'active' && (inc.status === 'resolved' || inc.status === 'mitigated')) return false;
    if (statusFilter === 'resolved' && inc.status !== 'resolved' && inc.status !== 'mitigated') return false;
    if (severityFilter !== 'all' && inc.severity.toLowerCase() !== severityFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Incident Management Center
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {incidents.filter((i) => i.status === 'detected' || i.status === 'investigating').length} Active
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Automated correlation of cloud telemetry, configuration regressions, and infrastructure anomalies into actionable root-cause tickets.
          </p>
        </div>

        <Link
          to="/rca"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 rounded-xl transition-all shadow-subtle hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch RCA Workspace</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-peach-500 text-white shadow-sm'
                  : 'bg-peach-50/70 text-charcoal-700 hover:bg-peach-100 border border-peach-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-charcoal-500">Severity:</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs font-semibold text-charcoal-700 bg-charcoal-50 border border-[#EDE3DE] rounded-xl px-3 py-1.5 focus:border-peach-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Incident List */}
      {loading ? (
        <LoadingState message="Correlating active infrastructure signals into incident tickets..." />
      ) : error ? (
        <ErrorState title="Incident Hub Error" message={error} onRetry={fetchIncidents} />
      ) : filteredIncidents.length === 0 ? (
        <EmptyState
          title="No incidents found"
          message="There are no active or historical incidents matching your filter criteria."
          actionText="View All Incidents"
          onAction={() => {
            setStatusFilter('all');
            setSeverityFilter('all');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
};
