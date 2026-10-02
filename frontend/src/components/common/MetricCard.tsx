import React from 'react';
import { cn } from '../../utils/formatters';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  badgeText?: string;
  badgeColor?: 'peach' | 'emerald' | 'rose' | 'amber';
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  badgeText,
  badgeColor = 'peach',
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#FFFDFC] border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle relative overflow-hidden transition-all',
        onClick && 'cursor-pointer hover:border-peach-500 hover:shadow-card hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-charcoal-800 tracking-tight">{value}</h3>
            {badgeText && (
              <span
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                  badgeColor === 'peach' && 'bg-peach-100 text-peach-800 border-peach-300',
                  badgeColor === 'emerald' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  badgeColor === 'rose' && 'bg-rose-50 text-rose-700 border-rose-200',
                  badgeColor === 'amber' && 'bg-amber-50 text-amber-700 border-amber-200'
                )}
              >
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-charcoal-500">{subtitle}</p>}
          {change && (
            <p
              className={cn(
                'mt-2 text-xs font-medium flex items-center gap-1',
                changeType === 'positive' && 'text-emerald-600',
                changeType === 'negative' && 'text-rose-600',
                changeType === 'neutral' && 'text-charcoal-500'
              )}
            >
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-peach-50 border border-peach-200 text-peach-700">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
