import React, { useState } from 'react';
import { RCAData } from '../../types';
import { IncidentTimeline } from './IncidentTimeline';
import { SeverityBadge } from '../common/SeverityBadge';
import { HealthBadge } from '../common/HealthBadge';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Server,
  ArrowRight,
  ShieldAlert,
  GitCommit,
  Wrench,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface RCADetailViewProps {
  rca: RCAData;
  onRemediationExecuted?: () => void;
}

export const RCADetailView: React.FC<RCADetailViewProps> = ({ rca, onRemediationExecuted }) => {
  const [executing, setExecuting] = useState<string | null>(null);
  const [executedSuccess, setExecutedSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleExecuteAction = async (action: any) => {
    setExecuting(action.id);
    try {
      if (rca.remediation_id) {
        await api.approveRemediation(rca.remediation_id, 'Admin (Interview Demo)', true);
      }
      setExecutedSuccess(action.id);
      if (onRemediationExecuted) {
        onRemediationExecuted();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* RCA Header Banner */}
      <div className="bg-gradient-to-r from-peach-100 via-peach-50 to-white border border-peach-200 rounded-3xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-peach-900 bg-peach-200 px-2.5 py-1 rounded-lg border border-peach-300">
              {rca.incident_code}
            </span>
            <SeverityBadge severity={rca.severity} />
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-300" />
              {Math.round(rca.confidence_score * 100)}% Correlation Confidence
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-charcoal-800 mt-2 font-sans tracking-tight">{rca.title}</h2>
          <p className="text-xs text-charcoal-600 mt-1">Detected at {rca.detection_time} • Continuous Multi-Signal Evaluation</p>
        </div>

        <button
          onClick={() => navigate('/copilot')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-charcoal-800 bg-white hover:bg-peach-100 border border-peach-300 rounded-2xl shadow-subtle transition-all"
        >
          <Sparkles className="w-4 h-4 text-peach-600" />
          <span>Ask Copilot about this RCA</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timeline & Evidence (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Incident Timeline */}
          <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EDE3DE]">
              <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                Chronological Event Sequence
              </h3>
              <span className="text-xs text-charcoal-500">Triage Reconstruction</span>
            </div>
            <IncidentTimeline timeline={rca.timeline} />
          </div>

          {/* Evidence Matrix */}
          <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDE3DE]">
              <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                Multi-Signal Evidence Log
              </h3>
              <span className="text-xs font-bold text-peach-700 bg-peach-50 px-2 py-0.5 rounded border border-peach-200">
                {rca.evidence.length} Artifacts Verified
              </span>
            </div>

            <div className="space-y-3">
              {rca.evidence.map((ev, i) => (
                <div key={i} className="p-4 rounded-2xl bg-peach-50/40 border border-peach-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white border border-peach-200 text-peach-700 flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-charcoal-800">{ev.description}</h5>
                      <p className="text-[11px] text-charcoal-500 mt-0.5">{ev.correlation_note}</p>
                    </div>
                  </div>

                  {ev.value_before && ev.value_after && (
                    <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-1.5 rounded-xl border border-[#EDE3DE] self-start sm:self-center">
                      <span className="text-charcoal-400">{ev.value_before}</span>
                      <ArrowRight className="w-3 h-3 text-peach-600" />
                      <span className="font-bold text-rose-600">{ev.value_after}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Probable Cause, Impact & Recommendations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Probable Cause Card */}
          <div className="bg-white border border-peach-300 rounded-3xl p-6 shadow-card relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-peach-500 text-white">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                Probable Root Cause
              </h3>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed font-medium bg-peach-50/80 p-4 rounded-2xl border border-peach-200">
              {rca.probable_root_cause}
            </p>

            <div className="mt-4 pt-4 border-t border-[#EDE3DE]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 mb-1">
                Correlation Explanation
              </p>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {rca.correlation_explanation}
              </p>
            </div>
          </div>

          {/* Affected Services List */}
          <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono mb-4 pb-2 border-b border-[#EDE3DE]">
              Impacted Topology Services
            </h3>
            <div className="space-y-2.5">
              {rca.affected_services.map((svc) => (
                <div key={svc.resource_id} className="p-3 rounded-2xl bg-charcoal-50/70 border border-[#EDE3DE] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-charcoal-600" />
                    <div>
                      <h5 className="text-xs font-bold text-charcoal-800">{svc.name}</h5>
                      <span className="text-[10px] font-mono text-charcoal-500 uppercase">{svc.type}</span>
                    </div>
                  </div>
                  <HealthBadge status={svc.status} score={svc.health_score} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Remediations */}
          <div className="bg-white border border-peach-300 rounded-3xl p-6 shadow-subtle">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#EDE3DE]">
              <Wrench className="w-4 h-4 text-peach-600" />
              <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
                Controlled Remediation
              </h3>
            </div>

            <div className="space-y-4">
              {rca.recommended_actions.map((act) => {
                const isThisExecuted = executedSuccess === act.id;
                const isThisLoading = executing === act.id;

                return (
                  <div key={act.id} className="p-4 rounded-2xl bg-peach-50/50 border border-peach-200">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-charcoal-800">{act.title}</h5>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {act.risk}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">{act.description}</p>
                    
                    <div className="mt-3 pt-3 border-t border-peach-200 flex items-center justify-between">
                      <span className="text-[11px] text-charcoal-500">Est. Time: {act.estimated_time}</span>
                      
                      {isThisExecuted ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-xl">
                          <Check className="w-3.5 h-3.5" />
                          <span>Remediation Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleExecuteAction(act)}
                          disabled={isThisLoading}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 disabled:opacity-50 rounded-xl transition-all shadow-subtle hover:scale-[1.02]"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>{isThisLoading ? 'Simulating...' : 'Approve & Execute'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
