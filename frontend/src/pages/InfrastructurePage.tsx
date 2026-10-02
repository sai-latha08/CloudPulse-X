import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CloudResource } from '../types';
import { useScenario } from '../store/scenarioContext';
import { ResourceCard } from '../components/infrastructure/ResourceCard';
import { ResourceDetailModal } from '../components/infrastructure/ResourceDetailModal';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Server, Search, ArrowUpDown, Layers, Database, HardDrive, Zap, Network } from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('health_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedResource, setSelectedResource] = useState<CloudResource | null>(null);
  const { refreshTrigger } = useScenario();

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getResources({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        environment: selectedEnvironment === 'all' ? undefined : selectedEnvironment,
        search: searchQuery || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setResources(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load cloud resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedEnvironment, searchQuery, sortBy, sortOrder, refreshTrigger]);

  const categories = [
    { id: 'all', label: 'All Resources', icon: Layers },
    { id: 'compute', label: 'Compute (EC2)', icon: Server },
    { id: 'database', label: 'Database (RDS)', icon: Database },
    { id: 'storage', label: 'Storage (S3)', icon: HardDrive },
    { id: 'serverless', label: 'Serverless (Lambda)', icon: Zap },
    { id: 'network', label: 'Network (VPC/ALB)', icon: Network },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Cloud Infrastructure Inventory
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              {resources.length} Assets
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Grouped topology across compute clusters, managed databases, object storage, and serverless runtimes.
          </p>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-peach-500 text-white border-peach-600 shadow-sm'
                  : 'bg-white text-charcoal-700 border-[#EDE3DE] hover:border-peach-300 hover:bg-peach-50/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-peach-600'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources by name, ID (e.g. api-server-01, production-db), or type..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-charcoal-50/60 border border-[#EDE3DE] rounded-xl focus:border-peach-500 focus:outline-none text-charcoal-800"
          />
        </div>

        {/* Environment Filter & Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedEnvironment}
            onChange={(e) => setSelectedEnvironment(e.target.value)}
            className="text-xs font-semibold text-charcoal-700 bg-charcoal-50/60 border border-[#EDE3DE] rounded-xl px-3 py-2 focus:border-peach-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Environments</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold text-charcoal-700 bg-charcoal-50/60 border border-[#EDE3DE] rounded-xl px-3 py-2 focus:border-peach-500 focus:outline-none cursor-pointer"
          >
            <option value="health_score">Sort by Health Score</option>
            <option value="name">Sort by Name</option>
            <option value="cpu_utilization">Sort by CPU Load</option>
            <option value="latency_p95_ms">Sort by Latency</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl border border-[#EDE3DE] hover:bg-peach-50 text-charcoal-600 transition-colors"
            title={`Order: ${sortOrder.toUpperCase()}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <LoadingState message="Fetching live infrastructure telemetry..." />
      ) : error ? (
        <ErrorState title="Failed to Load Assets" message={error} onRetry={fetchResources} />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources match your filters"
          message="Try resetting your search query or switching category filters."
          actionText="Clear Filters"
          onAction={() => {
            setSelectedCategory('all');
            setSelectedEnvironment('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => (
            <ResourceCard
              key={res.resource_id}
              resource={res}
              onClick={() => setSelectedResource(res)}
            />
          ))}
        </div>
      )}

      {/* Inspector Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
};
