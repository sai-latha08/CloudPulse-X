import React, { useState } from 'react';
import { TopologyGraph, TopologyNode, CloudResource } from '../../types';
import { HealthBadge } from '../common/HealthBadge';
import {
  Globe,
  Server,
  Database,
  HardDrive,
  Zap,
  Shield,
  Network,
  Activity,
  ArrowRight,
  Info
} from 'lucide-react';
import { cn } from '../../utils/formatters';

interface DigitalTwinMapProps {
  graph: TopologyGraph;
  onSelectResource: (resourceId: string) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({ graph, onSelectResource }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  // Group nodes by architecture tier / layer
  // Layer 0: Global Ingress / CDN
  // Layer 1: Load Balancers & Edge
  // Layer 2: Compute Fleet (API Tier)
  // Layer 3: Serverless & Workers
  // Layer 4: Persistence (RDS & S3)

  const layerTitles = [
    'Layer 0: Ingress & Edge Gateway',
    'Layer 1: Application Load Balancers',
    'Layer 2: Compute & API Cluster',
    'Layer 3: Asynchronous Workers & Serverless',
    'Layer 4: Databases & Storage Buckets',
  ];

  const getNodeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'edge':
        return Globe;
      case 'alb':
        return Network;
      case 'ec2':
        return Server;
      case 'lambda':
        return Zap;
      case 'rds':
        return Database;
      case 's3':
        return HardDrive;
      case 'security_group':
        return Shield;
      default:
        return Activity;
    }
  };

  const getNodesByLayer = (layerIdx: number) => {
    return graph.nodes.filter((n) => n.layer === layerIdx);
  };

  return (
    <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle relative overflow-hidden">
      {/* Graph Controls & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EDE3DE] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-charcoal-800">Live Infrastructure Digital Twin</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-peach-100 text-peach-800 border border-peach-200">
              Interactive Dependency Graph
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time topology model correlating live telemetry, traffic flow, and security perimeters.
          </p>
        </div>

        {/* Health Summary Chips */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {graph.health_summary.healthy} Healthy
          </span>
          {graph.health_summary.warning > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {graph.health_summary.warning} Warning
            </span>
          )}
          {graph.health_summary.critical > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {graph.health_summary.critical} Critical
            </span>
          )}
        </div>
      </div>

      {/* Interactive Visual Graph Canvas */}
      <div className="py-8 space-y-10 relative">
        {[0, 1, 2, 3, 4].map((layerIdx) => {
          const layerNodes = getNodesByLayer(layerIdx);
          if (layerNodes.length === 0) return null;

          return (
            <div key={layerIdx} className="relative">
              {/* Layer Title Bar */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-charcoal-400">
                  {layerTitles[layerIdx]}
                </span>
                <div className="flex-1 h-px bg-peach-100" />
              </div>

              {/* Node Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {layerNodes.map((node) => {
                  const Icon = getNodeIcon(node.type);
                  const isHovered = hoveredNode === node.id;
                  const isCritical = node.status === 'critical';
                  const isWarning = node.status === 'warning';

                  return (
                    <div
                      key={node.id}
                      onClick={() => onSelectResource(node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={cn(
                        'bg-[#FFFDFC] border rounded-2xl p-4 transition-all cursor-pointer relative group flex flex-col justify-between shadow-subtle',
                        isCritical
                          ? 'border-rose-400 bg-rose-50/20 shadow-card ring-2 ring-rose-200'
                          : isWarning
                          ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-200'
                          : 'border-[#EDE3DE] hover:border-peach-400 hover:shadow-card hover:-translate-y-0.5'
                      )}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'p-2.5 rounded-xl transition-colors',
                                isCritical
                                  ? 'bg-rose-100 text-rose-700'
                                  : isWarning
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-peach-50 text-peach-700 group-hover:bg-peach-500 group-hover:text-white'
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-charcoal-800 group-hover:text-peach-700 transition-colors">
                                {node.name}
                              </h5>
                              <p className="text-[10px] font-mono text-charcoal-500">
                                {node.type.toUpperCase()} • {node.environment}
                              </p>
                            </div>
                          </div>
                          <HealthBadge status={node.status} score={node.health_score} size="sm" />
                        </div>

                        {/* Node Metrics Capsule */}
                        <div className="mt-3 pt-2.5 border-t border-[#EDE3DE] flex items-center justify-between text-[11px] font-mono text-charcoal-600">
                          {node.metrics_summary?.cpu !== undefined && (
                            <span>CPU: <strong className={node.metrics_summary.cpu > 80 ? 'text-rose-600' : 'text-charcoal-800'}>{node.metrics_summary.cpu}%</strong></span>
                          )}
                          {node.metrics_summary?.latency_p95 !== undefined && (
                            <span>P95: <strong className={node.metrics_summary.latency_p95 > 1000 ? 'text-rose-600' : 'text-charcoal-800'}>{Math.round(node.metrics_summary.latency_p95)}ms</strong></span>
                          )}
                          {node.metrics_summary?.request_rate !== undefined && (
                            <span>Req: <strong className="text-charcoal-800">{node.metrics_summary.request_rate}/s</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Connection Footnote */}
                      <div className="mt-2 text-[10px] text-peach-600 font-medium flex items-center justify-between">
                        <span>Click to inspect telemetry</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Twin Topology Legend */}
      <div className="mt-6 p-4 rounded-2xl bg-peach-50/60 border border-peach-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-charcoal-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-peach-700" />
          <span className="font-semibold text-charcoal-800">Traffic Routing Flow:</span>
          <span>Internet Gateway ➔ Application Load Balancer ➔ EC2 API Fleet ➔ RDS PostgreSQL & S3 Assets</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-charcoal-500">
          <span>Encrypted TLS 1.3 Ingress</span>
          <span>•</span>
          <span>Private DB Subnet Group</span>
        </div>
      </div>
    </div>
  );
};
