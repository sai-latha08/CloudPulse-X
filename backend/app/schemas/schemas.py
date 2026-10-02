from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str
    email: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = "VIEWER"
    name: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Resource Schemas ---
class ResourceBase(BaseModel):
    resource_id: str
    name: str
    type: str
    category: str
    region: str = "us-east-1"
    environment: str = "production"
    status: str = "healthy"
    health_score: float = 98.0
    cpu_utilization: float = 0.0
    memory_utilization: float = 0.0
    network_in_mb: float = 0.0
    network_out_mb: float = 0.0
    request_rate: float = 0.0
    latency_p95_ms: float = 0.0
    error_rate: float = 0.0
    ip_address: Optional[str] = None
    instance_type: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None

class ResourceResponse(ResourceBase):
    id: int
    last_activity: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class ResourceGroupSummary(BaseModel):
    category: str
    total_count: int
    healthy_count: int
    warning_count: int
    critical_count: int
    resources: List[ResourceResponse]

# --- Metrics Schemas ---
class MetricPoint(BaseModel):
    timestamp: str
    value: float

class LatencyPoint(BaseModel):
    timestamp: str
    p50: float
    p95: float
    p99: float

class NetworkPoint(BaseModel):
    timestamp: str
    network_in: float
    network_out: float

class ResourceMetricsResponse(BaseModel):
    resource_id: str
    resource_name: str
    time_range: str
    cpu_series: List[MetricPoint]
    memory_series: List[MetricPoint]
    network_series: List[NetworkPoint]
    request_rate_series: List[MetricPoint]
    latency_series: List[LatencyPoint]
    error_rate_series: List[MetricPoint]
    current_summary: Dict[str, Any]

# --- Incident & RCA Schemas ---
class EvidenceItem(BaseModel):
    evidence_type: str
    description: str
    timestamp: str
    severity: str
    metric_name: Optional[str] = None
    value_before: Optional[str] = None
    value_after: Optional[str] = None
    correlation_note: Optional[str] = None

    class Config:
        from_attributes = True

class IncidentResponse(BaseModel):
    id: int
    incident_code: str
    title: str
    severity: str
    status: str
    detection_time: datetime
    affected_resources: List[str]
    duration_minutes: int
    symptoms: Optional[str] = None
    probable_cause: Optional[str] = None
    confidence_score: float
    impact_summary: Optional[str] = None
    recommended_action: Optional[str] = None
    mitigation_action: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    evidence_items: Optional[List[EvidenceItem]] = []

    class Config:
        from_attributes = True

class TimelineEvent(BaseModel):
    time: str
    title: str
    description: str
    type: str  # normal, deployment, metric_change, alert, incident, resolution
    severity: str

class RCAResponse(BaseModel):
    incident_id: str
    incident_code: str
    title: str
    severity: str
    status: str
    detection_time: str
    confidence_score: float
    timeline: List[TimelineEvent]
    evidence: List[EvidenceItem]
    correlation_explanation: str
    probable_root_cause: str
    affected_services: List[Dict[str, Any]]
    recommended_actions: List[Dict[str, Any]]
    remediation_id: Optional[int] = None

# --- Security Schemas ---
class SecurityFindingResponse(BaseModel):
    id: int
    finding_code: str
    title: str
    severity: str
    category: str
    resource_id: str
    resource_name: str
    description: str
    evidence: str
    recommendation: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class SecuritySummary(BaseModel):
    total_findings: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    security_score: float
    by_category: Dict[str, int]
    findings: List[SecurityFindingResponse]

# --- Cost Schemas ---
class CostOptimizationItem(BaseModel):
    resource_id: str
    resource_name: str
    service_name: str
    current_cost: float
    recommended_cost: float
    monthly_savings: float
    utilization_rate: float
    observation: str
    recommended_action: str

class CostSummaryResponse(BaseModel):
    monthly_estimated: float
    current_month: float
    previous_month: float
    potential_savings: float
    cost_efficiency_score: float
    by_service: Dict[str, float]
    by_environment: Dict[str, float]
    cost_trend: List[Dict[str, Any]]
    optimizations: List[CostOptimizationItem]
    provider_mode: str

# --- Event & Alert Schemas ---
class CloudEventResponse(BaseModel):
    id: int
    event_type: str
    title: str
    description: str
    resource_id: Optional[str] = None
    resource_name: Optional[str] = None
    severity: str
    actor: str
    timestamp: datetime
    metadata_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    alert_code: str
    title: str
    message: str
    severity: str
    category: str
    resource_id: Optional[str] = None
    resource_name: Optional[str] = None
    is_read: bool
    is_resolved: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Graph / Digital Twin Schemas ---
class TopologyNode(BaseModel):
    id: str
    name: str
    type: str
    category: str
    status: str
    health_score: float
    ip_address: Optional[str] = None
    metrics_summary: Dict[str, Any]
    layer: int
    environment: str

class TopologyLink(BaseModel):
    source: str
    target: str
    label: Optional[str] = None
    protocol: Optional[str] = "HTTPS"
    status: str = "active"

class TopologyGraphResponse(BaseModel):
    nodes: List[TopologyNode]
    links: List[TopologyLink]
    total_resources: int
    health_summary: Dict[str, int]

# --- Copilot Schemas ---
class CopilotQueryRequest(BaseModel):
    query: str
    resource_id: Optional[str] = None
    incident_code: Optional[str] = None

class CopilotAnalysisSection(BaseModel):
    summary: str
    evidence: List[str]
    probable_cause: Optional[str] = None
    impact: str
    recommendations: List[str]
    confidence: float
    confidence_label: str  # High, Moderate, Low

class CopilotQueryResponse(BaseModel):
    query: str
    answer: str
    structured_analysis: CopilotAnalysisSection
    referenced_resources: List[str]
    referenced_incidents: List[str]
    suggested_follow_ups: List[str]
    generated_at: str

# --- Remediation Schemas ---
class RemediationResponse(BaseModel):
    id: int
    action_type: str
    target_resource_id: str
    target_resource_name: str
    title: str
    description: str
    risk_level: str
    status: str
    requested_by: str
    approved_by: Optional[str] = None
    execution_time: Optional[datetime] = None
    simulation_mode: bool
    result_log: Optional[str] = None
    rollback_plan: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RemediationApproveRequest(BaseModel):
    approved_by: Optional[str] = "Admin"
    execute_immediately: bool = True

class AuditLogResponse(BaseModel):
    id: int
    action: str
    actor: str
    resource_id: Optional[str] = None
    status: str
    details: str
    simulation_mode: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Scenario & Overview Schemas ---
class ScenarioItem(BaseModel):
    id: str
    name: str
    badge: str
    description: str
    active: bool
    key_metrics: Dict[str, Any]

class HealthScoreBreakdown(BaseModel):
    overall: float
    performance: float
    reliability: float
    security: float
    cost_efficiency: float
    status_label: str

class OverviewResponse(BaseModel):
    overall_health: HealthScoreBreakdown
    active_incidents_count: int
    critical_security_count: int
    total_security_findings: int
    monthly_estimated_cost: float
    potential_savings: float
    resources_monitored: int
    availability_sla: float
    active_scenario: str
    recent_deployments: List[CloudEventResponse]
    recent_events: List[CloudEventResponse]
    top_incidents: List[IncidentResponse]
    high_priority_remediations: List[RemediationResponse]
    cloud_provider: str
