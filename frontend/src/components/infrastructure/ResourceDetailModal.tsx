import React, { useEffect, useState } from 'react';
import { CloudResource, ResourceMetrics } from '../../types';
import { api } from '../../services/api';
import { HealthBadge } from '../common/HealthBadge';
import { X, Activity, Server, Cpu, HardDrive, Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatLatency } from '../../utils/formatters';

interface ResourceDetailModalProps {
  resource: CloudResource | null;
  onClose: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, onClose }) => {
  const [metrics, setMetrics] = useState<ResourceMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'config'>('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resource) {
      setLoading(true);
      api.getMetrics(resource.resource_id, '24h')
        .then(setMetrics)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [resource]);

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#EDE3DE] shadow-elevated w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#EDE3DE] flex items-center justify-between bg-peach-50/40">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-peach-100 border border-peach-200 text-peach-800">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-charcoal-800">{resource.name}</h3>
                <HealthBadge status={resource.status} score={resource.health_score} />
              </div>
              <p className="text-xs font-mono text-charcoal-500">{resource.resource_id} • {resource.region} • {resource.environment}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 border-b border-[#EDE3DE] flex gap-4">
          {(['overview', 'metrics', 'config'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-peach-500 text-peach-800'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-peach-50/50 border border-peach-200">
                  <p className="text-[11px] text-charcoal-500 font-medium">CPU Utilization</p>
                  <p className="text-xl font-bold font-mono text-charcoal-800 mt-1">{resource.cpu_utilization}%</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-peach-50/50 border border-peach-200">
                  <p className="text-[11px] text-charcoal-500 font-medium">Memory Usage</p>
                  <p className="text-xl font-bold font-mono text-charcoal-800 mt-1">{resource.memory_utilization}%</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-peach-50/50 border border-peach-200">
                  <p className="text-[11px] text-charcoal-500 font-medium">P95 Latency</p>
                  <p className="text-xl font-bold font-mono text-charcoal-800 mt-1">{formatLatency(resource.latency_p95_ms)}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-peach-50/50 border border-peach-200">
                  <p className="text-[11px] text-charcoal-500 font-medium">Error Rate</p>
                  <p className="text-xl font-bold font-mono text-charcoal-800 mt-1">{resource.error_rate}%</p>
                </div>
              </div>

              {/* Status & Diagnostic Message */}
              {resource.status !== 'healthy' ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose-900">Active Operational Warning</h5>
                    <p className="text-xs mt-1 text-rose-700 leading-relaxed">
                      This resource has departed from normal baseline operating parameters. The AIOps correlation engine has registered this signal into active incident correlation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900">All Parameters Nominal</h5>
                    <p className="text-xs mt-1 text-emerald-700 leading-relaxed">
                      Operating within expected SLA thresholds with sub-second response times and zero elevated error rates.
                    </p>
                  </div>
                </div>
              )}

              {/* Mini CPU Trend Chart */}
              {metrics && metrics.cpu_series.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-[#EDE3DE]">
                  <h5 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-3">24-Hour CPU Utilization Curve</h5>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.cpu_series}>
                        <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={10} tickLine={false} />
                        <YAxis stroke="#9E938D" fontSize={10} domain={[0, 100]} unit="%" tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFDFC', borderColor: '#EDE3DE', borderRadius: '12px', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="value" stroke="#F4A582" strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'metrics' && metrics && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#EDE3DE]">
                <h5 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-3">P95 / P99 Latency (ms)</h5>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.latency_series}>
                      <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={10} />
                      <YAxis stroke="#9E938D" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFDFC', borderColor: '#EDE3DE', borderRadius: '12px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="p95" stroke="#E05252" strokeWidth={2} name="P95 Latency (ms)" dot={false} />
                      <Line type="monotone" dataKey="p50" stroke="#F4A582" strokeWidth={2} name="P50 Latency (ms)" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#EDE3DE]">
                <h5 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-3">Network I/O Throughput (MB/s)</h5>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.network_series}>
                      <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={10} />
                      <YAxis stroke="#9E938D" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFDFC', borderColor: '#EDE3DE', borderRadius: '12px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="network_in" stroke="#3B82F6" strokeWidth={2} name="Inbound (MB)" dot={false} />
                      <Line type="monotone" dataKey="network_out" stroke="#10B981" strokeWidth={2} name="Outbound (MB)" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="bg-charcoal-50 p-4 rounded-2xl border border-[#EDE3DE] font-mono text-xs">
                <p className="text-charcoal-400 mb-2">// AWS Resource Metadata Object</p>
                <pre className="text-charcoal-800 overflow-x-auto">
                  {JSON.stringify(
                    {
                      resource_id: resource.resource_id,
                      name: resource.name,
                      type: resource.type,
                      category: resource.category,
                      region: resource.region,
                      environment: resource.environment,
                      instance_type: resource.instance_type,
                      ip_address: resource.ip_address,
                      health_score: resource.health_score,
                      metadata: resource.metadata_json,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-peach-50/40 border-t border-[#EDE3DE] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-charcoal-700 bg-white hover:bg-peach-100/60 border border-[#EDE3DE] rounded-xl transition-colors shadow-subtle"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
