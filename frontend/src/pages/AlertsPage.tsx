import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Alert } from '../types';
import { useScenario } from '../store/scenarioContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Check, CheckCheck, AlertTriangle, Shield, DollarSign, Activity } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useScenario();

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [refreshTrigger]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markAlertRead(id);
      await fetchAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.resolveAlert(id);
      await fetchAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return Shield;
      case 'cost':
        return DollarSign;
      case 'performance':
        return Activity;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Active Alerts Center
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              {alerts.filter((a) => !a.is_resolved).length} Unresolved
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time threshold alerts across compute saturation, latency SLA breaches, security policy violations, and FinOps anomalies.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Fetching active infrastructure alert rules..." />
      ) : error ? (
        <ErrorState title="Alerts Center Error" message={error} onRetry={fetchAlerts} />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = getCategoryIcon(alert.category);
            return (
              <div
                key={alert.id}
                className={`bg-white border rounded-3xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  alert.is_resolved ? 'opacity-60 border-[#EDE3DE]' : 'border-peach-300 hover:shadow-card'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-2xl flex-shrink-0 mt-0.5 ${
                    alert.is_resolved ? 'bg-charcoal-100 text-charcoal-500' : 'bg-peach-100 text-peach-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-peach-800 bg-peach-100 px-2 py-0.5 rounded">
                        {alert.alert_code}
                      </span>
                      <SeverityBadge severity={alert.severity} />
                      <span className="text-[10px] font-bold uppercase font-mono text-charcoal-500">
                        {alert.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-charcoal-800">{alert.title}</h4>
                    <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed">{alert.message}</p>
                    <p className="text-[11px] font-mono text-charcoal-400 mt-2">
                      Target: {alert.resource_name} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!alert.is_read && (
                    <button
                      onClick={() => handleMarkRead(alert.alert_code)}
                      className="px-3 py-1.5 text-xs font-semibold text-charcoal-700 bg-charcoal-50 hover:bg-peach-50 border border-[#EDE3DE] rounded-xl transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  {!alert.is_resolved ? (
                    <button
                      onClick={() => handleResolve(alert.alert_code)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve Alert</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
