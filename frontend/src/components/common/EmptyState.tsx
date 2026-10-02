import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  minHeight?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  message = 'There are no active records matching your filter parameters.',
  icon: Icon = Inbox,
  actionText,
  onAction,
  minHeight = 'min-h-[260px]',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${minHeight} bg-white border border-[#EDE3DE] rounded-2xl`}>
      <div className="p-3.5 rounded-full bg-peach-50 text-peach-600 mb-3 border border-peach-200">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-charcoal-800">{title}</h4>
      <p className="mt-1 text-xs text-charcoal-500 max-w-sm">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-peach-500 rounded-xl hover:bg-peach-600 transition-colors shadow-subtle"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
