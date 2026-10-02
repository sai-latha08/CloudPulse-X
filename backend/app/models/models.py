from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="ENGINEER")  # ADMIN, ENGINEER, VIEWER
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CloudResource(Base):
    __tablename__ = "cloud_resources"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    type = Column(String(50), nullable=False)  # ec2, rds, s3, lambda, alb, vpc, security_group
    category = Column(String(50), nullable=False)  # compute, storage, database, network, serverless
    region = Column(String(50), default="us-east-1")
    environment = Column(String(50), default="production")  # production, staging, development
    status = Column(String(50), default="healthy")  # healthy, warning, critical
    health_score = Column(Float, default=98.0)
    cpu_utilization = Column(Float, default=0.0)
    memory_utilization = Column(Float, default=0.0)
    network_in_mb = Column(Float, default=0.0)
    network_out_mb = Column(Float, default=0.0)
    request_rate = Column(Float, default=0.0)
    latency_p95_ms = Column(Float, default=0.0)
    error_rate = Column(Float, default=0.0)
    ip_address = Column(String(50), nullable=True)
    instance_type = Column(String(50), nullable=True)
    last_activity = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(String(100), index=True, nullable=False)
    metric_name = Column(String(100), nullable=False)  # cpu, memory, network_in, network_out, request_rate, latency_p50, latency_p95, latency_p99, error_rate
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    value = Column(Float, nullable=False)
    unit = Column(String(20), default="percent")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., INC-1024
    title = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)  # critical, high, medium, low
    status = Column(String(50), default="detected")  # detected, investigating, mitigated, resolved
    detection_time = Column(DateTime, default=datetime.utcnow)
    affected_resources = Column(JSON, default=list)  # list of resource_ids
    duration_minutes = Column(Integer, default=15)
    symptoms = Column(Text, nullable=True)
    probable_cause = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.85)  # 0.0 - 1.0
    impact_summary = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    mitigation_action = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    evidence_items = relationship("IncidentEvidence", back_populates="incident", cascade="all, delete-orphan")

class IncidentEvidence(Base):
    __tablename__ = "incident_evidence"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    evidence_type = Column(String(50), nullable=False)  # metric_spike, deployment, log_error, health_check
    description = Column(String(255), nullable=False)
    timestamp = Column(String(50), nullable=False)  # formatted time string or ISO
    severity = Column(String(50), default="medium")
    metric_name = Column(String(100), nullable=True)
    value_before = Column(String(50), nullable=True)
    value_after = Column(String(50), nullable=True)
    correlation_note = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="evidence_items")

class SecurityFinding(Base):
    __tablename__ = "security_findings"

    id = Column(Integer, primary_key=True, index=True)
    finding_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., SEC-301
    title = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)  # critical, high, medium, low
    category = Column(String(50), nullable=False)  # iam, security_group, s3, infrastructure
    resource_id = Column(String(100), nullable=False)
    resource_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    status = Column(String(50), default="open")  # open, remediated, suppressed
    created_at = Column(DateTime, default=datetime.utcnow)

class CostRecord(Base):
    __tablename__ = "cost_records"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(100), nullable=False)  # EC2, RDS, S3, Lambda, Data Transfer
    environment = Column(String(50), default="production")
    monthly_estimated = Column(Float, nullable=False)
    current_month = Column(Float, nullable=False)
    previous_month = Column(Float, nullable=False)
    potential_savings = Column(Float, default=0.0)
    recommendation = Column(Text, nullable=True)
    resource_id = Column(String(100), nullable=True)
    utilization_rate = Column(Float, default=50.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class CloudEvent(Base):
    __tablename__ = "cloud_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False)  # deployment, metric_anomaly, security_alert, config_change, remediation, incident
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    resource_id = Column(String(100), nullable=True)
    resource_name = Column(String(150), nullable=True)
    severity = Column(String(50), default="info")  # info, warning, critical, success
    actor = Column(String(100), default="system")  # user/system/ci-cd
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    metadata_json = Column(JSON, nullable=True)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), nullable=False)  # critical, high, medium, low
    category = Column(String(50), default="performance")  # performance, security, cost, availability
    resource_id = Column(String(100), nullable=True)
    resource_name = Column(String(150), nullable=True)
    is_read = Column(Boolean, default=False)
    is_resolved = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Remediation(Base):
    __tablename__ = "remediations"

    id = Column(Integer, primary_key=True, index=True)
    action_type = Column(String(100), nullable=False)  # restart_service, scale_out, rollback_deployment, restrict_security_group, enable_encryption
    target_resource_id = Column(String(100), nullable=False)
    target_resource_name = Column(String(150), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    risk_level = Column(String(50), default="low")  # low, medium, high
    status = Column(String(50), default="recommended")  # recommended, pending_approval, approved, completed, failed, rejected
    requested_by = Column(String(100), default="CloudPulse Engine")
    approved_by = Column(String(100), nullable=True)
    execution_time = Column(DateTime, nullable=True)
    simulation_mode = Column(Boolean, default=True)
    result_log = Column(Text, nullable=True)
    rollback_plan = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False)
    actor = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False)  # Approved, Executed, Rejected, Failed
    details = Column(Text, nullable=False)
    simulation_mode = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ScenarioState(Base):
    __tablename__ = "scenario_state"

    id = Column(Integer, primary_key=True, index=True)
    active_scenario = Column(String(100), default="performance_degradation")  # healthy, performance_degradation, security_misconfig, cost_anomaly, deployment_failure
    updated_at = Column(DateTime, default=datetime.utcnow)
