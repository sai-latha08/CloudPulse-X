import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ScenarioItem } from '../types';
import { api } from '../services/api';

interface ScenarioContextType {
  scenarios: ScenarioItem[];
  activeScenarioId: string;
  activeScenario: ScenarioItem | null;
  isLoading: boolean;
  switchScenario: (id: string) => Promise<void>;
  resetScenario: () => Promise<void>;
  refreshTrigger: number;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

const DEFAULT_SCENARIOS: ScenarioItem[] = [
  {
    id: 'performance_degradation',
    name: 'Scenario 2: API Performance Degradation & Deployment v2.8',
    badge: 'Deployment Regression',
    description: 'Production deployment v2.8 causes CPU spike (94%) on api-server-01, elevating P95 latency to 2.8s and triggering INC-1024 with RCA correlation.',
    active: true,
    key_metrics: { overall_health: 78.4, active_incidents: 1, critical_security: 2, cost_savings: 428.0 },
  },
  {
    id: 'healthy',
    name: 'Scenario 1: Healthy Infrastructure Baseline',
    badge: 'All Systems Nominal',
    description: 'All compute, storage, database, and network resources are operating in optimal parameters. Health score 99.4%, zero active incidents.',
    active: false,
    key_metrics: { overall_health: 99.4, active_incidents: 0, critical_security: 0, cost_savings: 428.0 },
  },
  {
    id: 'security_misconfig',
    name: 'Scenario 3: Critical Security Misconfiguration',
    badge: 'Security Exposure',
    description: 'Port 22 SSH exposed publicly (0.0.0.0/0), unencrypted public S3 bucket discovered, and wildcard IAM AdministratorAccess assigned.',
    active: false,
    key_metrics: { overall_health: 68.2, active_incidents: 1, critical_security: 3, cost_savings: 428.0 },
  },
  {
    id: 'cost_anomaly',
    name: 'Scenario 4: Cloud Cost Anomaly & Underutilization',
    badge: 'FinOps Optimization',
    description: 'worker-server-01 idle at 7.8% CPU, staging-db oversized, unattached EBS volume generating waste. $795/month potential savings identified.',
    active: false,
    key_metrics: { overall_health: 88.5, active_incidents: 0, critical_security: 1, cost_savings: 795.0 },
  },
  {
    id: 'deployment_failure',
    name: 'Scenario 5: Worker Crash Loop & Memory Exhaustion',
    badge: 'High Blast Radius',
    description: 'Worker node worker-server-02 hit 96% memory saturation after v3.1 hotfix, causing 14 restarts and 18.4% task failure rate.',
    active: false,
    key_metrics: { overall_health: 62.0, active_incidents: 2, critical_security: 1, cost_savings: 428.0 },
  },
];

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenarios, setScenarios] = useState<ScenarioItem[]>(DEFAULT_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('performance_degradation');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const fetchScenarios = useCallback(async () => {
    try {
      const data = await api.getScenarios();
      if (data && data.length > 0) {
        setScenarios(data);
        const active = data.find((s) => s.active);
        if (active) setActiveScenarioId(active.id);
      }
    } catch (e) {
      console.warn('Using local fallback scenarios');
    }
  }, []);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const switchScenario = async (id: string) => {
    setIsLoading(true);
    try {
      await api.switchScenario(id);
      setActiveScenarioId(id);
      setScenarios((prev) =>
        prev.map((s) => ({
          ...s,
          active: s.id === id,
        }))
      );
      setRefreshTrigger((c) => c + 1);
    } catch (e) {
      // Fallback local switch
      setActiveScenarioId(id);
      setScenarios((prev) =>
        prev.map((s) => ({
          ...s,
          active: s.id === id,
        }))
      );
      setRefreshTrigger((c) => c + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScenario = async () => {
    await switchScenario('performance_degradation');
  };

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <ScenarioContext.Provider
      value={{
        scenarios,
        activeScenarioId,
        activeScenario,
        isLoading,
        switchScenario,
        resetScenario,
        refreshTrigger,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (!context) throw new Error('useScenario must be used within a ScenarioProvider');
  return context;
};
