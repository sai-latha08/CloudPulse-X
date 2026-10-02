import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Analyzing cloud signals...',
  minHeight = 'min-h-[320px]',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${minHeight}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-peach-200 border-t-peach-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-peach-100" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-charcoal-600 animate-pulse">{message}</p>
    </div>
  );
};
