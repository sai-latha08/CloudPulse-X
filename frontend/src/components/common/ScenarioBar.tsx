import React from 'react';
import { useScenario } from '../../store/scenarioContext';
import { Sparkles, Layers, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/formatters';

export const ScenarioBar: React.FC = () => {
  const { scenarios, activeScenarioId, switchScenario, resetScenario, isLoading } = useScenario();

  return (
    <div className="bg-peach-50 border-b border-peach-200 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Scenario Header */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-peach-500 text-white shadow-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-charcoal-800 tracking-wide uppercase">
                Interview Demo Mode
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-peach-200 text-peach-900 border border-peach-300">
                Live State Engine
              </span>
            </div>
            <p className="text-xs text-charcoal-600 hidden sm:block">
              Switch infrastructure scenarios to test real-time AIOps correlation and health response.
            </p>
          </div>
        </div>

        {/* Scenario Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {scenarios.map((sc) => {
            const isActive = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => switchScenario(sc.id)}
                disabled={isLoading}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border',
                  isActive
                    ? 'bg-peach-500 text-white border-peach-600 shadow-sm'
                    : 'bg-white text-charcoal-700 border-[#EDE3DE] hover:border-peach-400 hover:bg-peach-100/50'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-white' : 'bg-peach-400')} />
                <span>{sc.badge}</span>
              </button>
            );
          })}

          <button
            onClick={resetScenario}
            title="Reset Scenario to Default"
            className="p-1.5 rounded-xl text-charcoal-500 hover:text-charcoal-800 hover:bg-peach-200/60 border border-transparent transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
