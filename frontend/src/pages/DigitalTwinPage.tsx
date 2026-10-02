import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { TopologyGraph, CloudResource } from '../types';
import { useScenario } from '../store/scenarioContext';
import { DigitalTwinMap } from '../components/infrastructure/DigitalTwinMap';
import { ResourceDetailModal } from '../components/infrastructure/ResourceDetailModal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { RefreshCw } from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const [graph, setGraph] = useState<TopologyGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<CloudResource | null>(null);
  const { refreshTrigger } = useScenario();

  const fetchGraph = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTopologyGraph();
      setGraph(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load topology digital twin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [refreshTrigger]);

  const handleSelectResource = async (resourceId: string) => {
    if (resourceId === 'internet-gateway') return;
    try {
      const res = await api.getResourceDetail(resourceId);
      setSelectedResource(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Infrastructure Digital Twin
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              Live Topology Graph
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Dynamic node-based relationship map tracing internet ingress down to persistence storage layers.
          </p>
        </div>

        <button
          onClick={fetchGraph}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-charcoal-700 bg-white hover:bg-peach-50 border border-[#EDE3DE] hover:border-peach-300 rounded-xl transition-colors shadow-subtle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Map</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Synthesizing digital twin topology and dependency nodes..." />
      ) : error || !graph ? (
        <ErrorState title="Topology Map Unavailable" message={error || 'Failed to load topology'} onRetry={fetchGraph} />
      ) : (
        <DigitalTwinMap graph={graph} onSelectResource={handleSelectResource} />
      )}

      {/* Selected Resource Inspector Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
};
