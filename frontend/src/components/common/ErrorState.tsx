import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  minHeight?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load telemetry data',
  message = 'An unexpected connection or processing error occurred while fetching cloud signals.',
  onRetry,
  minHeight = 'min-h-[300px]',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${minHeight} bg-rose-50/30 border border-rose-100 rounded-2xl`}>
      <div className="p-3 rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-charcoal-800">{title}</h4>
      <p className="mt-1 text-xs text-charcoal-500 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-charcoal-700 bg-white border border-[#EDE3DE] rounded-xl hover:bg-peach-50 hover:border-peach-400 transition-colors shadow-subtle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
