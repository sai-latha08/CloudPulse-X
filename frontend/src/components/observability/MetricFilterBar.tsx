import React from 'react';
import { Clock, Server } from 'lucide-react';
import { CloudResource } from '../../types';

interface MetricFilterBarProps {
  timeRange: string;
  onTimeRangeChange: (val: string) => void;
  selectedResourceId: string;
  onResourceChange: (val: string) => void;
  resources: CloudResource[];
}

export const MetricFilterBar: React.FC<MetricFilterBarProps> = ({
  timeRange,
  onTimeRangeChange,
  selectedResourceId,
  onResourceChange,
  resources,
}) => {
  const timeRanges = [
    { id: '1h', label: 'Last 1 Hour' },
    { id: '6h', label: 'Last 6 Hours' },
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
  ];

  return (
    <div className="bg-white border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Resource Picker */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-peach-50 text-peach-700 border border-peach-200">
          <Server className="w-4 h-4" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
            Target Resource
          </label>
          <select
            value={selectedResourceId}
            onChange={(e) => onResourceChange(e.target.value)}
            className="text-xs font-semibold text-charcoal-800 bg-transparent border-none focus:ring-0 p-0 cursor-pointer"
          >
            {resources.map((r) => (
              <option key={r.resource_id} value={r.resource_id}>
                {r.name} ({r.type.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-1.5 bg-peach-50/70 p-1 rounded-xl border border-peach-200">
        <Clock className="w-3.5 h-3.5 text-peach-700 ml-2 mr-1 hidden sm:block" />
        {timeRanges.map((range) => (
          <button
            key={range.id}
            onClick={() => onTimeRangeChange(range.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              timeRange === range.id
                ? 'bg-peach-500 text-white shadow-sm'
                : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-white/60'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};
