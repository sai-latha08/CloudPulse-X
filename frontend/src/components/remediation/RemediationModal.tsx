import React, { useState } from 'react';
import { Remediation } from '../../types';
import { X, Wrench, ShieldCheck, AlertTriangle, Play, Check } from 'lucide-react';
import { api } from '../../services/api';

interface RemediationModalProps {
  remediation: Remediation | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RemediationModal: React.FC<RemediationModalProps> = ({ remediation, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [approvedBy, setApprovedBy] = useState('Alex Mercer (Admin)');

  if (!remediation) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await api.approveRemediation(remediation.id, approvedBy, true);
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-[#EDE3DE] shadow-elevated w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#EDE3DE] bg-peach-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-peach-100 text-peach-800 border border-peach-200">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-800">Remediation Approval</h3>
              <p className="text-xs text-charcoal-500">Human-In-The-Loop Safety Gate</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-charcoal-400 hover:text-charcoal-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Action Title
            </label>
            <p className="text-sm font-bold text-charcoal-800">{remediation.title}</p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Description
            </label>
            <p className="text-charcoal-700 leading-relaxed bg-peach-50/50 p-3 rounded-xl border border-peach-200">
              {remediation.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
                Target Resource
              </label>
              <p className="font-mono font-semibold text-charcoal-800 bg-charcoal-50 p-2 rounded-lg border border-[#EDE3DE]">
                {remediation.target_resource_id}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
                Risk Classification
              </label>
              <span className="inline-block font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {remediation.risk_level.toUpperCase()}
              </span>
            </div>
          </div>

          {remediation.rollback_plan && (
            <div className="pt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
                Rollback Strategy
              </label>
              <p className="text-charcoal-600 bg-charcoal-50 p-2.5 rounded-xl border border-[#EDE3DE]">
                {remediation.rollback_plan}
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Controlled Execution:</strong> In Demo Mode, this executes an audited simulation and updates the live infrastructure health state.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-peach-50/40 border-t border-[#EDE3DE] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-charcoal-600 hover:bg-charcoal-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 disabled:opacity-50 rounded-xl shadow-subtle transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{loading ? 'Executing Action...' : 'Approve & Execute Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
