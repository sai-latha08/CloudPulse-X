export type ResourceType = 'ec2' | 'rds' | 's3' | 'lambda' | 'alb' | 'vpc' | 'security_group' | 'edge';
export type ResourceCategory = 'compute' | 'storage' | 'database' | 'network' | 'serverless';
export type HealthStatus = 'healthy' | 'warning' | 'critical';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type UserRole = 'ADMIN' | 'ENGINEER' | 'VIEWER';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface CloudResource {
  id: number;
  resource_id: string;
  name: string;
  type: ResourceType;
  category: ResourceCategory;
  region: string;
  environment: 'production' | 'staging' | 'development';
  status: HealthStatus;
  health_score: number;
  cpu_utilization: number;
  memory_utilization: number;
  network_in_mb: number;
  network_out_mb: number;
  request_rate: number;
  latency_p95_ms: number;
  error_rate: number;
  ip_address?: string;
  instance_type?: string;
  last_activity: string;
  metadata_json?: Record<string, any>;
}

export interface ResourceGroupSummary {
  category: ResourceCategory;
  total_count: number;
  healthy_count: number;
  warning_count: number;
  critical_count: number;
  resources: CloudResource[];
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface LatencyPoint {
  timestamp: string;
  p50: number;
  p95: number;
  p99: number;
}

export interface NetworkPoint {
  timestamp: string;
  network_in: number;
  network_out: number;
}

export interface ResourceMetrics {
  resource_id: string;
  resource_name: string;
  time_range: string;
  cpu_series: MetricPoint[];
  memory_series: MetricPoint[];
  network_series: NetworkPoint[];
  request_rate_series: MetricPoint[];
  latency_series: LatencyPoint[];
  error_rate_series: MetricPoint[];
  current_summary: {
    avg_cpu: number;
    peak_cpu: number;
    avg_latency_p95: number;
    max_latency_p99: number;
    total_requests: number;
    avg_error_rate: number;
  };
}

export interface IncidentEvidenceItem {
  evidence_type: string;
  description: string;
  timestamp: string;
  severity: SeverityLevel;
  metric_name?: string;
  value_before?: string;
  value_after?: string;
  correlation_note?: string;
}

export interface Incident {
  id: number;
  incident_code: string;
  title: string;
  severity: SeverityLevel;
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  detection_time: string;
  affected_resources: string[];
  duration_minutes: number;
  symptoms?: string;
  probable_cause?: string;
  confidence_score: number;
  impact_summary?: string;
  recommended_action?: string;
  mitigation_action?: string;
  created_at: string;
  resolved_at?: string;
  evidence_items?: IncidentEvidenceItem[];
}

export interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: 'normal' | 'deployment' | 'metric_change' | 'alert' | 'incident' | 'resolution';
  severity: SeverityLevel;
}

export interface RCAData {
  incident_id: string;
  incident_code: string;
  title: string;
  severity: SeverityLevel;
  status: string;
  detection_time: string;
  confidence_score: number;
  timeline: TimelineEvent[];
  evidence: IncidentEvidenceItem[];
  correlation_explanation: string;
  probable_root_cause: string;
  affected_services: Array<{
    resource_id: string;
    name: string;
    type: string;
    status: HealthStatus;
    health_score: number;
    latency_p95_ms: number;
    cpu_utilization: number;
  }>;
  recommended_actions: Array<{
    id: string;
    action_type: string;
    title: string;
    description: string;
    risk: string;
    estimated_time: string;
    target_resource_id: string;
    action_available: boolean;
  }>;
  remediation_id?: number;
}

export interface SecurityFinding {
  id: number;
  finding_code: string;
  title: string;
  severity: SeverityLevel;
  category: 'iam' | 'security_group' | 's3' | 'infrastructure';
  resource_id: string;
  resource_name: string;
  description: string;
  evidence: string;
  recommendation: string;
  status: 'open' | 'remediated' | 'suppressed';
  created_at: string;
}

export interface SecuritySummary {
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  security_score: number;
  by_category: Record<string, number>;
  findings: SecurityFinding[];
}

export interface CostOptimizationItem {
  resource_id: string;
  resource_name: string;
  service_name: string;
  current_cost: number;
  recommended_cost: number;
  monthly_savings: number;
  utilization_rate: number;
  observation: string;
  recommended_action: string;
}

export interface CostSummary {
  monthly_estimated: number;
  current_month: number;
  previous_month: number;
  potential_savings: number;
  cost_efficiency_score: number;
  by_service: Record<string, number>;
  by_environment: Record<string, number>;
  cost_trend: Array<{ month: string; cost: number; budget: number }>;
  optimizations: CostOptimizationItem[];
  provider_mode: string;
}

export interface CloudEvent {
  id: number;
  event_type: 'deployment' | 'metric_anomaly' | 'security_alert' | 'config_change' | 'remediation' | 'incident';
  title: string;
  description: string;
  resource_id?: string;
  resource_name?: string;
  severity: SeverityLevel;
  actor: string;
  timestamp: string;
  metadata_json?: Record<string, any>;
}

export interface Alert {
  id: number;
  alert_code: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  category: 'performance' | 'security' | 'cost' | 'availability';
  resource_id?: string;
  resource_name?: string;
  is_read: boolean;
  is_resolved: boolean;
  timestamp: string;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: string;
  category: string;
  status: HealthStatus;
  health_score: number;
  ip_address?: string;
  metrics_summary: Record<string, any>;
  layer: number;
  environment: string;
}

export interface TopologyLink {
  source: string;
  target: string;
  label?: string;
  protocol?: string;
  status: string;
}

export interface TopologyGraph {
  nodes: TopologyNode[];
  links: TopologyLink[];
  total_resources: number;
  health_summary: {
    healthy: number;
    warning: number;
    critical: number;
  };
}

export interface Remediation {
  id: number;
  action_type: string;
  target_resource_id: string;
  target_resource_name: string;
  title: string;
  description: string;
  risk_level: string;
  status: 'recommended' | 'pending_approval' | 'approved' | 'completed' | 'failed' | 'rejected';
  requested_by: string;
  approved_by?: string;
  execution_time?: string;
  simulation_mode: boolean;
  result_log?: string;
  rollback_plan?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  action: string;
  actor: string;
  resource_id?: string;
  status: string;
  details: string;
  simulation_mode: boolean;
  timestamp: string;
}

export interface HealthScoreBreakdown {
  overall: number;
  performance: number;
  reliability: number;
  security: number;
  cost_efficiency: number;
  status_label: string;
}

export interface OverviewData {
  overall_health: HealthScoreBreakdown;
  active_incidents_count: number;
  critical_security_count: number;
  total_security_findings: number;
  monthly_estimated_cost: number;
  potential_savings: number;
  resources_monitored: number;
  availability_sla: number;
  active_scenario: string;
  recent_deployments: CloudEvent[];
  recent_events: CloudEvent[];
  top_incidents: Incident[];
  high_priority_remediations: Remediation[];
  cloud_provider: string;
}

export interface ScenarioItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  active: boolean;
  key_metrics: Record<string, any>;
}

export interface CopilotResponse {
  query: string;
  answer: string;
  structured_analysis: {
    summary: string;
    evidence: string[];
    probable_cause?: string;
    impact: string;
    recommendations: string[];
    confidence: number;
    confidence_label: string;
  };
  referenced_resources: string[];
  referenced_incidents: string[];
  suggested_follow_ups: string[];
  generated_at: string;
}
