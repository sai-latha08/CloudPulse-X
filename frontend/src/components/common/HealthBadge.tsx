import React from 'react';
import { HealthStatus } from '../../types';
import { cn } from '../../utils/formatters';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface HealthBadgeProps {
  status: HealthStatus;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({
  status,
  score,
  showIcon = true,
  size = 'md',
}) => {
  const config = {
    healthy: {
      bg: 'bg-status-healthy-light',
      text: 'text-emerald-700',
      border: 'border-status-healthy-border',
      dot: 'bg-emerald-500',
      label: 'Healthy',
      icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-status-warning-light',
      text: 'text-amber-700',
      border: 'border-status-warning-border',
      dot: 'bg-amber-500',
      label: 'Warning',
      icon: AlertTriangle,
    },
    critical: {
      bg: 'bg-status-critical-light',
      text: 'text-rose-700',
      border: 'border-status-critical-border',
      dot: 'bg-rose-500',
      label: 'Critical',
      icon: AlertOctagon,
    },
  }[status] || {
    bg: 'bg-charcoal-100',
    text: 'text-charcoal-700',
    border: 'border-charcoal-200',
    dot: 'bg-charcoal-400',
    label: status,
    icon: CheckCircle2,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors',
        config.bg,
        config.text,
        config.border,
        sizeClasses
      )}
    >
      {showIcon ? (
        <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      ) : (
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      )}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-75 font-mono text-[10px]">({Math.round(score)}%)</span>
      )}
    </span>
  );
};
