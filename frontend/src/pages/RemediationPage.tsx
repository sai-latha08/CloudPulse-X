import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Remediation, AuditLog } from '../types';
import { useScenario } from '../store/scenarioContext';
import { RemediationModal } from '../components/remediation/RemediationModal';
import { AuditLogTable } from '../components/remediation/AuditLogTable';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Play, CheckCircle2 } from 'lucide-react';

export const RemediationPage: React.FC = () => {
  const [remediations, setRemediations] = useState<Remediation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRemediation, setSelectedRemediation] = useState<Remediation | null>(null);
  const { refreshTrigger } = useScenario();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rems, logs] = await Promise.all([
        api.getRemediations(),
        api.getAuditLogs(),
      ]);
      setRemediations(rems);
      setAuditLogs(logs);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch remediation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  if (loading) return <LoadingState message="Fetching automated remediation queue and immutable audit trail..." />;
  if (error) return <ErrorState title="Remediation Hub Error" message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
            Controlled Remediation Center
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
            Safety Guardrailed
          </span>
        </div>
        <p className="text-xs text-charcoal-500 mt-1">
          Detect ➔ Analyze ➔ Recommend ➔ User Approval ➔ Execute. Never destructive without human sign-off.
        </p>
      </div>

      {/* Recommended Actions Queue */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
          Pending Approval & Recommended Workflows
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {remediations.map((rem) => {
            const isDone = rem.status === 'completed';

            return (
              <div
                key={rem.id}
                className={`bg-white border rounded-3xl p-5 shadow-subtle flex flex-col justify-between transition-all ${
                  isDone ? 'border-emerald-200 bg-emerald-50/10' : 'border-[#EDE3DE] hover:border-peach-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-peach-100 text-peach-800 border border-peach-200">
                      {rem.action_type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {rem.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-charcoal-800 mt-1">{rem.title}</h4>
                  <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">{rem.description}</p>

                  <div className="mt-3 py-2 border-t border-[#EDE3DE] text-xs space-y-1">
                    <p className="text-charcoal-500 text-[11px]">
                      Target: <strong className="font-mono text-charcoal-700">{rem.target_resource_id}</strong>
                    </p>
                    <p className="text-charcoal-500 text-[11px]">
                      Requested by: <span className="font-semibold text-charcoal-700">{rem.requested_by}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE3DE] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-charcoal-500">
                    Risk: <strong className="text-emerald-700 uppercase">{rem.risk_level}</strong>
                  </span>

                  {isDone ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Executed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedRemediation(rem)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 rounded-xl transition-all shadow-subtle hover:scale-105"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Review & Execute</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <AuditLogTable logs={auditLogs} />

      {/* Approval Modal */}
      <RemediationModal
        remediation={selectedRemediation}
        onClose={() => setSelectedRemediation(null)}
        onSuccess={fetchData}
      />
    </div>
  );
};
