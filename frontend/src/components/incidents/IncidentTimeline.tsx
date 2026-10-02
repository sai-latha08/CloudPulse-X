import React from 'react';
import { TimelineEvent } from '../../types';
import { Clock, GitCommit, Activity, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface IncidentTimelineProps {
  timeline: TimelineEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ timeline }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deployment':
        return GitCommit;
      case 'metric_change':
        return Activity;
      case 'alert':
        return AlertTriangle;
      case 'incident':
        return AlertOctagon;
      case 'resolution':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  const getEventColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 border-rose-200' };
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-700', badge: 'bg-orange-50 border-orange-200' };
      case 'info':
        return { bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-50 border-blue-200' };
      case 'low':
      case 'normal':
        return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200' };
      default:
        return { bg: 'bg-peach-500', text: 'text-peach-700', badge: 'bg-peach-50 border-peach-200' };
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-peach-200">
      {timeline.map((event, idx) => {
        const Icon = getEventIcon(event.type);
        const colors = getEventColor(event.severity);

        return (
          <div key={idx} className="relative group">
            {/* Timeline Dot Indicator */}
            <div className={cn(
              'absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white transition-transform group-hover:scale-110',
              colors.bg
            )}>
              <Icon className="w-2.5 h-2.5" />
            </div>

            {/* Timeline Item Box */}
            <div className="bg-[#FFFDFC] border border-[#EDE3DE] rounded-2xl p-4 shadow-subtle hover:border-peach-400 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-charcoal-800 font-sans">{event.title}</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
                  {event.time}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
