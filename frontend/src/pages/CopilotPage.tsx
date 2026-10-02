import React from 'react';
import { CopilotDrawer } from '../components/copilot/CopilotDrawer';

export const CopilotPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
            AI Cloud Copilot Workspace
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
            AIOps Assistant
          </span>
        </div>
        <p className="text-xs text-charcoal-500 mt-1">
          Interactive AI assistant grounded in live telemetry, correlated incident signals, security benchmarks, and AWS cost records.
        </p>
      </div>

      <CopilotDrawer />
    </div>
  );
};
