import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { RCAData } from '../types';
import { useScenario } from '../store/scenarioContext';
import { RCADetailView } from '../components/incidents/RCADetailView';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RCADetailPage: React.FC = () => {
  const [rca, setRca] = useState<RCAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger, activeScenarioId } = useScenario();

  const fetchRCA = async () => {
    setLoading(true);
    setError(null);
    try {
      const incCode = activeScenarioId === 'deployment_failure' ? 'INC-1025' : 'INC-1024';
      const data = await api.getIncidentRCA(incCode);
      setRca(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load RCA report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRCA();
  }, [activeScenarioId, refreshTrigger]);

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/incidents"
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-600 hover:text-peach-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Incident Queue</span>
        </Link>
      </div>

      {loading ? (
        <LoadingState message="Reconstructing multi-signal evidence matrix and root-cause timeline..." />
      ) : error || !rca ? (
        <ErrorState title="RCA Report Unavailable" message={error || 'Failed to load correlation report'} onRetry={fetchRCA} />
      ) : (
        <RCADetailView rca={rca} onRemediationExecuted={fetchRCA} />
      )}
    </div>
  );
};
