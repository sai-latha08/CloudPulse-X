import React from 'react';
import { SeverityLevel } from '../../types';
import { cn } from '../../utils/formatters';

interface SeverityBadgeProps {
  severity: SeverityLevel | string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sevLower = severity.toLowerCase();

  const styles: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  };

  const current = styles[sevLower] || styles.info;

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono uppercase tracking-wider font-semibold rounded border',
        current.bg,
        current.text,
        current.border,
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      )}
    >
      {severity}
    </span>
  );
};
