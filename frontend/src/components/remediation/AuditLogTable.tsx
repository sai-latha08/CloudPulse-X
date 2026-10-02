import React from 'react';
import { AuditLog } from '../../types';
import { ShieldCheck, Clock, User, CheckCircle2 } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  return (
    <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
      <div className="flex items-center justify-between pb-4 border-b border-[#EDE3DE] mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-peach-600" />
          <h3 className="text-base font-bold text-charcoal-800">Immutable Remediation Audit Trail</h3>
        </div>
        <span className="text-xs font-mono text-charcoal-500">{logs.length} Operations Logged</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#EDE3DE] text-charcoal-400 font-mono uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Action & Target</th>
              <th className="pb-3 font-semibold">Executed By</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Execution Mode</th>
              <th className="pb-3 font-semibold">Timestamp</th>
              <th className="pb-3 font-semibold">Result Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE3DE]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-peach-50/40 transition-colors">
                <td className="py-3.5 pr-3 font-semibold text-charcoal-800">
                  <div>{log.action}</div>
                  {log.resource_id && (
                    <span className="font-mono text-[10px] text-charcoal-500">{log.resource_id}</span>
                  )}
                </td>
                <td className="py-3.5 pr-3">
                  <span className="inline-flex items-center gap-1.5 text-charcoal-700 font-medium">
                    <User className="w-3.5 h-3.5 text-peach-600" />
                    {log.actor}
                  </span>
                </td>
                <td className="py-3.5 pr-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {log.status}
                  </span>
                </td>
                <td className="py-3.5 pr-3 font-mono text-charcoal-600">
                  {log.simulation_mode ? 'Simulation (Safety)' : 'Live AWS Execution'}
                </td>
                <td className="py-3.5 pr-3 font-mono text-charcoal-500">
                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                </td>
                <td className="py-3.5 text-charcoal-600 max-w-xs truncate" title={log.details}>
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
