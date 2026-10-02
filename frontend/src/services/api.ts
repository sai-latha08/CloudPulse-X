import {
  OverviewData,
  CloudResource,
  ResourceGroupSummary,
  ResourceMetrics,
  Incident,
  RCAData,
  SecuritySummary,
  SecurityFinding,
  CostSummary,
  CloudEvent,
  Alert,
  TopologyGraph,
  Remediation,
  AuditLog,
  ScenarioItem,
  CopilotResponse,
  User
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('cloudpulse_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string; role: string; name: string; email: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request<User>('/auth/me'),

  // Overview
  getOverview: () => request<OverviewData>('/overview'),

  // Infrastructure Resources
  getResources: (params?: { category?: string; environment?: string; status?: string; search?: string; sort_by?: string; sort_order?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.environment) query.append('environment', params.environment);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.sort_order) query.append('sort_order', params.sort_order);
    return request<CloudResource[]>(`/resources?${query.toString()}`);
  },
  getResourcesByCategory: () => request<ResourceGroupSummary[]>('/resources/by-category'),
  getResourceDetail: (id: string) => request<CloudResource>(`/resources/${id}`),

  // Observability & Metrics
  getMetrics: (resourceId: string, timeRange: string = '24h') =>
    request<ResourceMetrics>(`/metrics/${resourceId}?time_range=${timeRange}`),

  // Incidents & RCA
  getIncidents: () => request<Incident[]>('/incidents'),
  getIncident: (id: string) => request<Incident>(`/incidents/${id}`),
  getIncidentRCA: (id: string) => request<RCAData>(`/incidents/${id}/rca`),

  // Security
  getSecuritySummary: () => request<SecuritySummary>('/security/summary'),
  getSecurityFindings: (params?: { category?: string; severity?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.severity) query.append('severity', params.severity);
    if (params?.status) query.append('status', params.status);
    return request<SecurityFinding[]>(`/security/findings?${query.toString()}`);
  },
  remediateFinding: (id: string) => request<{ message: string; status: string }>(`/security/findings/${id}/remediate`, { method: 'POST' }),

  // Cost & FinOps
  getCostSummary: () => request<CostSummary>('/cost/summary'),

  // Events & Timeline
  getEvents: (params?: { event_type?: string; severity?: string; resource_id?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.event_type) query.append('event_type', params.event_type);
    if (params?.severity) query.append('severity', params.severity);
    if (params?.resource_id) query.append('resource_id', params.resource_id);
    if (params?.limit) query.append('limit', params.limit.toString());
    return request<CloudEvent[]>(`/events?${query.toString()}`);
  },

  // Alerts
  getAlerts: () => request<Alert[]>('/alerts'),
  markAlertRead: (id: string) => request<Alert>(`/alerts/${id}/read`, { method: 'POST' }),
  resolveAlert: (id: string) => request<Alert>(`/alerts/${id}/resolve`, { method: 'POST' }),

  // Digital Twin Graph
  getTopologyGraph: () => request<TopologyGraph>('/infrastructure/graph'),

  // Copilot AI
  queryCopilot: (query: string, resourceId?: string, incidentCode?: string) =>
    request<CopilotResponse>('/copilot/query', {
      method: 'POST',
      body: JSON.stringify({ query, resource_id: resourceId, incident_code: incidentCode }),
    }),
  getCopilotSuggestions: () => request<string[]>('/copilot/suggestions'),

  // Remediation & Audit
  getRemediations: () => request<Remediation[]>('/remediations'),
  approveRemediation: (id: number, approvedBy: string = 'Admin', executeImmediately: boolean = true) =>
    request<Remediation>(`/remediations/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approved_by: approvedBy, execute_immediately: executeImmediately }),
    }),
  executeRemediation: (id: number) =>
    request<Remediation>(`/remediations/${id}/execute`, { method: 'POST' }),
  getAuditLogs: () => request<AuditLog[]>('/remediations/audit-logs'),

  // Scenarios
  getScenarios: () => request<ScenarioItem[]>('/scenarios'),
  getActiveScenario: () => request<{ active_scenario_id: string; details: any }>('/scenarios/active'),
  switchScenario: (id: string) => request<{ message: string; active_scenario: string }>(`/scenarios/switch/${id}`, { method: 'POST' }),
  resetScenario: () => request<any>('/scenarios/reset', { method: 'POST' }),
};
