import React from 'react';
import { Incident } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { AlertOctagon, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const isResolved = incident.status === 'resolved' || incident.status === 'mitigated';

  return (
    <div className={`bg-white border rounded-3xl p-6 shadow-subtle transition-all hover:shadow-card ${
      isResolved ? 'border-emerald-200 bg-emerald-50/10' : 'border-[#EDE3DE] hover:border-peach-400'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE3DE]">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {isResolved ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-peach-800 bg-peach-100 px-2 py-0.5 rounded border border-peach-200">
                {incident.incident_code}
              </span>
              <SeverityBadge severity={incident.severity} />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize border ${
                incident.status === 'detected'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : incident.status === 'mitigated'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {incident.status}
              </span>
            </div>
            <h4 className="text-base font-bold text-charcoal-800 mt-1">{incident.title}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-charcoal-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Active for {incident.duration_minutes} mins</span>
        </div>
      </div>

      {/* Symptoms & Probable Cause summary */}
      <div className="py-4 space-y-3">
        {incident.symptoms && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Observed Telemetry Symptoms</p>
            <p className="text-xs text-charcoal-700 mt-0.5 font-medium leading-relaxed">{incident.symptoms}</p>
          </div>
        )}

        {incident.probable_cause && (
          <div className="p-3.5 rounded-2xl bg-peach-50/70 border border-peach-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-peach-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-peach-600" />
                AIOps Correlated Root Cause
              </span>
              <span className="text-xs font-bold font-mono text-peach-800 bg-white px-2 py-0.5 rounded-full border border-peach-300">
                {Math.round(incident.confidence_score * 100)}% Confidence
              </span>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">{incident.probable_cause}</p>
          </div>
        )}
      </div>

      {/* Footer link to RCA deep-dive */}
      <div className="pt-4 border-t border-[#EDE3DE] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-charcoal-500">
          <span className="font-semibold text-charcoal-700">Affected:</span>
          {incident.affected_resources?.map((resId) => (
            <span key={resId} className="px-2 py-0.5 rounded bg-charcoal-50 border border-[#EDE3DE] font-mono text-[11px]">
              {resId}
            </span>
          ))}
        </div>

        <Link
          to={`/rca`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-peach-800 bg-peach-100 hover:bg-peach-200 border border-peach-300 rounded-xl transition-all shadow-subtle hover:scale-[1.02]"
        >
          <span>Open Full RCA Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
