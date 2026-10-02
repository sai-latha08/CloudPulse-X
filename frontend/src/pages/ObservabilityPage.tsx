import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CloudResource, ResourceMetrics } from '../types';
import { useScenario } from '../store/scenarioContext';
import { MetricFilterBar } from '../components/observability/MetricFilterBar';
import { MetricsChart } from '../components/observability/MetricsChart';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ObservabilityPage: React.FC = () => {
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>('api-server-01');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [metrics, setMetrics] = useState<ResourceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useScenario();
  const navigate = useNavigate();

  useEffect(() => {
    api.getResources()
      .then((resList) => {
        setResources(resList);
        if (resList.length > 0 && !resList.some((r) => r.resource_id === selectedResourceId)) {
          setSelectedResourceId(resList[0].resource_id);
        }
      })
      .catch(console.error);
  }, [refreshTrigger]);

  const fetchMetrics = async () => {
    if (!selectedResourceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMetrics(selectedResourceId, timeRange);
      setMetrics(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch telemetry metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [selectedResourceId, timeRange, refreshTrigger]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Observability & Telemetry Hub
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              High Resolution
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time multi-dimensional time series covering compute CPU, memory, network bandwidth, request latency percentiles, and 5xx error rates.
          </p>
        </div>

        <button
          onClick={() => navigate('/copilot')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-charcoal-800 bg-peach-100 hover:bg-peach-200 border border-peach-300 rounded-xl transition-colors shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 text-peach-600 fill-peach-400" />
          <span>Ask Copilot to Analyze Anomalies</span>
        </button>
      </div>

      {/* Metric Filter Toolbar */}
      <MetricFilterBar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedResourceId={selectedResourceId}
        onResourceChange={setSelectedResourceId}
        resources={resources}
      />

      {/* Metrics Chart View */}
      {loading ? (
        <LoadingState message={`Synthesizing ${timeRange} telemetry curves for ${selectedResourceId}...`} />
      ) : error || !metrics ? (
        <ErrorState title="Telemetry Error" message={error || 'Failed to fetch time-series data'} onRetry={fetchMetrics} />
      ) : (
        <MetricsChart metrics={metrics} />
      )}
    </div>
  );
};
