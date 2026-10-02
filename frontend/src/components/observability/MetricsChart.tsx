import React from 'react';
import { ResourceMetrics } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Activity, Server, Network, Clock, AlertTriangle } from 'lucide-react';

interface MetricsChartProps {
  metrics: ResourceMetrics;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ metrics }) => {
  const tooltipStyle = {
    backgroundColor: '#FFFDFC',
    borderColor: '#EDE3DE',
    borderRadius: '16px',
    boxShadow: '0 8px 24px -4px rgba(39, 35, 33, 0.08)',
    fontSize: '12px',
    padding: '10px 14px',
  };

  return (
    <div className="space-y-6">
      {/* 4-KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Average CPU Utilization</p>
          <p className={`text-2xl font-extrabold font-mono mt-1 ${metrics.current_summary.avg_cpu > 70 ? 'text-rose-600' : 'text-charcoal-800'}`}>
            {metrics.current_summary.avg_cpu}%
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Peak load: {metrics.current_summary.peak_cpu}%</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">P95 API Latency</p>
          <p className={`text-2xl font-extrabold font-mono mt-1 ${metrics.current_summary.avg_latency_p95 > 1000 ? 'text-rose-600' : 'text-charcoal-800'}`}>
            {Math.round(metrics.current_summary.avg_latency_p95)}ms
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Max P99: {Math.round(metrics.current_summary.max_latency_p99)}ms</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Total Inbound Requests</p>
          <p className="text-2xl font-extrabold font-mono mt-1 text-charcoal-800">
            {metrics.current_summary.total_requests.toLocaleString()}
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Window aggregate</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">HTTP Error Rate</p>
          <p className={`text-2xl font-extrabold font-mono mt-1 ${metrics.current_summary.avg_error_rate > 2 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {metrics.current_summary.avg_error_rate}%
          </p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">5xx / Gateway timeouts</p>
        </div>
      </div>

      {/* Grid of 6 Deep-Dive Time-Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. CPU Utilization Time-Series */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Compute CPU Utilization (%)
            </h4>
            <span className="text-[11px] font-mono text-charcoal-500">Threshold: 75%</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.cpu_series}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4A582" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F4A582" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={11} tickLine={false} />
                <YAxis stroke="#9E938D" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#F4A582" strokeWidth={2.5} fill="url(#cpuGradient)" name="CPU (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. API Latency Distribution (P50, P95, P99) */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              API Response Latency (P50 / P95 / P99 ms)
            </h4>
            <span className="text-[11px] font-mono text-rose-600">SLA: &lt;500ms</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.latency_series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={11} tickLine={false} />
                <YAxis stroke="#9E938D" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="p99" stroke="#E05252" strokeWidth={2} name="P99 (ms)" dot={false} />
                <Line type="monotone" dataKey="p95" stroke="#F4A582" strokeWidth={2} name="P95 (ms)" dot={false} />
                <Line type="monotone" dataKey="p50" stroke="#10B981" strokeWidth={2} name="P50 (ms)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Memory Utilization (%) */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Memory Utilization (%)
            </h4>
            <span className="text-[11px] font-mono text-charcoal-500">Resident Set Size</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.memory_series}>
                <defs>
                  <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={11} tickLine={false} />
                <YAxis stroke="#9E938D" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#memGradient)" name="Memory (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Network Inbound & Outbound (MB/s) */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Network I/O Throughput (MB/s)
            </h4>
            <span className="text-[11px] font-mono text-charcoal-500">VPC Interface Bandwidth</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.network_series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={11} tickLine={false} />
                <YAxis stroke="#9E938D" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="network_out" stroke="#F4A582" strokeWidth={2} name="Network Out (MB/s)" dot={false} />
                <Line type="monotone" dataKey="network_in" stroke="#10B981" strokeWidth={2} name="Network In (MB/s)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Request Rate (Requests / Sec) */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Incoming Request Volume (Req/s)
            </h4>
            <span className="text-[11px] font-mono text-charcoal-500">ALB Target Group</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.request_rate_series}>
                <defs>
                  <linearGradient id="reqGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={11} tickLine={false} />
                <YAxis stroke="#9E938D" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#reqGradient)" name="Requests/sec" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. HTTP Error Rate (%) */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              HTTP 5xx Error Rate (%)
            </h4>
            <span className="text-[11px] font-mono text-rose-600">Threshold: &gt;1.0%</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.error_rate_series}>
                <defs>
                  <linearGradient id="errGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E05252" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E05252" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#9E938D" fontSize={11} tickLine={false} />
                <YAxis stroke="#9E938D" fontSize={11} unit="%" tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#E05252" strokeWidth={2} fill="url(#errGradient)" name="Error Rate (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
