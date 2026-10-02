import React from 'react';
import { CloudResource } from '../../types';
import { HealthBadge } from '../common/HealthBadge';
import { Server, Database, HardDrive, Network, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { formatLatency } from '../../utils/formatters';

interface ResourceCardProps {
  resource: CloudResource;
  onClick: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  const getIcon = () => {
    switch (resource.type) {
      case 'ec2':
        return Server;
      case 'rds':
        return Database;
      case 's3':
        return HardDrive;
      case 'lambda':
        return Zap;
      case 'security_group':
        return Shield;
      default:
        return Network;
    }
  };

  const Icon = getIcon();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#EDE3DE] hover:border-peach-400 rounded-2xl p-5 shadow-subtle hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-peach-50 border border-peach-200 text-peach-700 group-hover:bg-peach-500 group-hover:text-white transition-colors">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal-800 group-hover:text-peach-700 transition-colors">
                {resource.name}
              </h4>
              <p className="text-[11px] font-mono text-charcoal-500">{resource.resource_id}</p>
            </div>
          </div>
          <HealthBadge status={resource.status} score={resource.health_score} size="sm" />
        </div>

        <div className="flex items-center gap-2 mb-4 text-[11px] text-charcoal-500">
          <span className="px-2 py-0.5 rounded bg-charcoal-50 border border-[#EDE3DE] uppercase font-mono">
            {resource.type}
          </span>
          <span>•</span>
          <span>{resource.region}</span>
          <span>•</span>
          <span className="capitalize">{resource.environment}</span>
        </div>

        {/* Telemetry preview bars */}
        <div className="space-y-2 pt-3 border-t border-[#EDE3DE]">
          {resource.type === 'ec2' && (
            <>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-charcoal-500">CPU Load</span>
                  <span className={`font-mono font-bold ${resource.cpu_utilization > 80 ? 'text-rose-600' : 'text-charcoal-800'}`}>
                    {resource.cpu_utilization}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      resource.cpu_utilization > 80 ? 'bg-rose-500' : resource.cpu_utilization > 60 ? 'bg-amber-500' : 'bg-peach-500'
                    }`}
                    style={{ width: `${Math.min(100, resource.cpu_utilization)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-charcoal-500 pt-1">
                <span>P95 Latency</span>
                <span className={`font-mono font-semibold ${resource.latency_p95_ms > 1000 ? 'text-rose-600' : 'text-charcoal-700'}`}>
                  {formatLatency(resource.latency_p95_ms)}
                </span>
              </div>
            </>
          )}

          {resource.type === 'rds' && (
            <div className="flex justify-between text-[11px] text-charcoal-600">
              <span>Query Latency:</span>
              <span className="font-mono font-bold text-emerald-600">
                {resource.latency_p95_ms}ms (Optimal)
              </span>
            </div>
          )}

          {resource.type === 's3' && (
            <div className="flex justify-between text-[11px] text-charcoal-600">
              <span>Encryption:</span>
              <span className={`font-mono font-semibold ${resource.status === 'critical' ? 'text-rose-600' : 'text-emerald-600'}`}>
                {resource.status === 'critical' ? 'Missing SSE-KMS' : 'AES-256 Enabled'}
              </span>
            </div>
          )}

          {resource.type === 'alb' && (
            <div className="flex justify-between text-[11px] text-charcoal-600">
              <span>P95 Gateway Latency:</span>
              <span className={`font-mono font-bold ${resource.latency_p95_ms > 1000 ? 'text-rose-600' : 'text-charcoal-800'}`}>
                {formatLatency(resource.latency_p95_ms)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EDE3DE] flex items-center justify-between text-xs text-peach-700 font-semibold group-hover:text-peach-800">
        <span>Inspect Telemetry & Config</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
};
