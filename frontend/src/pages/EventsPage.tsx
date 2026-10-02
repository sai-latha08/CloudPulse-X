import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CloudEvent } from '../types';
import { useScenario } from '../store/scenarioContext';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { GitCommit, Activity, ShieldAlert, Wrench, AlertOctagon, Settings } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CloudEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const { refreshTrigger } = useScenario();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvents({
        event_type: selectedType === 'all' ? undefined : selectedType,
      });
      setEvents(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load event timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedType, refreshTrigger]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deployment':
        return GitCommit;
      case 'metric_anomaly':
        return Activity;
      case 'security_alert':
        return ShieldAlert;
      case 'remediation':
        return Wrench;
      case 'incident':
        return AlertOctagon;
      default:
        return Settings;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Unified Infrastructure Event Stream
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time chronological timeline linking deployments, telemetry anomalies, configuration updates, and remediations.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'deployment', label: 'Deployments' },
          { id: 'incident', label: 'Incidents' },
          { id: 'metric_anomaly', label: 'Metric Spikes' },
          { id: 'security_alert', label: 'Security Alerts' },
          { id: 'config_change', label: 'Config Changes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border whitespace-nowrap ${
              selectedType === tab.id
                ? 'bg-peach-500 text-white border-peach-600 shadow-sm'
                : 'bg-white text-charcoal-700 border-[#EDE3DE] hover:border-peach-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Stream */}
      {loading ? (
        <LoadingState message="Streaming cloud infrastructure events..." />
      ) : error ? (
        <ErrorState title="Event Stream Error" message={error} onRetry={fetchEvents} />
      ) : (
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle space-y-4">
          {events.map((evt) => {
            const Icon = getEventIcon(evt.event_type);
            return (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EDE3DE] hover:border-peach-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-peach-50 border border-peach-200 text-peach-700 flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-peach-100 text-peach-800 border border-peach-200">
                        {evt.event_type}
                      </span>
                      {evt.resource_name && (
                        <span className="text-xs font-mono font-bold text-charcoal-700">{evt.resource_name}</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-charcoal-800">{evt.title}</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5 leading-relaxed">{evt.description}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-[11px] text-charcoal-500 self-start sm:self-center">
                  <div>{evt.actor}</div>
                  <div className="text-charcoal-400 mt-0.5">{new Date(evt.timestamp).toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
