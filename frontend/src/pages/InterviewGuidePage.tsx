import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Terminal,
  Zap,
  Award
} from 'lucide-react';

export const InterviewGuidePage: React.FC = () => {
  const [pitchTab, setPitchTab] = useState<'30s' | '1m' | '3m'>('1m');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-peach-100 via-peach-50 to-white border border-peach-200 rounded-3xl p-6 sm:p-8 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-peach-500 text-white shadow-peach-glow">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
                Interview Presentation & Technical Defense Guide
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-peach-200 text-peach-900 border border-peach-300">
                AIOps & DevOps
              </span>
            </div>
            <p className="text-xs text-charcoal-600 mt-1">
              Engineered for technical interviews (Cloud Architect, DevOps, Site Reliability Engineer, Full-Stack AI).
            </p>
          </div>
        </div>
      </div>

      {/* Elevator Pitch Simulator Tabs */}
      <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE3DE] mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-peach-600" />
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Elevator Pitch Options
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-peach-50 p-1 rounded-xl border border-peach-200">
            {(['30s', '1m', '3m'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setPitchTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  pitchTab === t ? 'bg-peach-500 text-white shadow-sm' : 'text-charcoal-700 hover:text-charcoal-900'
                }`}
              >
                {t === '30s' ? '30 Seconds' : t === '1m' ? '1 Minute' : '3 Minutes Deep Dive'}
              </button>
            ))}
          </div>
        </div>

        {pitchTab === '30s' && (
          <div className="p-5 rounded-2xl bg-peach-50/50 border border-peach-200 text-xs text-charcoal-800 space-y-3 leading-relaxed">
            <p className="font-bold text-peach-900 text-sm">30-Second Elevator Pitch:</p>
            <p className="text-charcoal-700 leading-relaxed text-sm">
              &quot;<strong>CloudPulse X</strong> is an autonomous Cloud Operations and AIOps intelligence platform that bridges the gap between infrastructure metrics, security posture, and root cause analysis. Instead of engineers having to inspect 5 different dashboards during an outage, CloudPulse X correlates deployment events, time-series telemetry spikes, and topology dependencies to instantly identify probable root causes with confidence scores, AI-assisted explanations, and human-in-the-loop remediation workflows.&quot;
            </p>
          </div>
        )}

        {pitchTab === '1m' && (
          <div className="p-5 rounded-2xl bg-peach-50/50 border border-peach-200 text-xs text-charcoal-800 space-y-3 leading-relaxed">
            <p className="font-bold text-peach-900 text-sm">1-Minute Executive Pitch:</p>
            <p className="text-charcoal-700 leading-relaxed text-sm">
              &quot;In modern cloud architectures, teams are flooded with fragmented signals—CloudWatch metrics, deployment CI/CD events, IAM alerts, and cost spikes. When an incident occurs, answering <em>&apos;What happened and what caused it?&apos;</em> takes valuable MTTR minutes.
            </p>
            <p className="text-charcoal-700 leading-relaxed text-sm">
              I built <strong>CloudPulse X</strong> to provide a unified intelligence layer. It ingests telemetry across compute, databases, and network layers, runs a deterministic correlation engine that links events like <code>v2.8 container deployment</code> to CPU saturation on specific nodes, and provides an interactive <strong>Digital Twin topology map</strong>. It also includes an <strong>AI Copilot</strong> that reasons over live infrastructure data, automated security auditing for open firewalls, and controlled remediation with full audit logging.&quot;
            </p>
          </div>
        )}

        {pitchTab === '3m' && (
          <div className="p-5 rounded-2xl bg-peach-50/50 border border-peach-200 text-xs text-charcoal-800 space-y-4 leading-relaxed">
            <p className="font-bold text-peach-900 text-sm">3-Minute Technical Architecture Walkthrough:</p>
            <div className="space-y-2 text-charcoal-700">
              <p>
                <strong>1. Core Architecture:</strong> CloudPulse X utilizes a decoupled full-stack architecture. The backend is built in <strong>Python FastAPI</strong> and <strong>SQLAlchemy</strong> with a cloud provider abstraction layer (supporting both a realistic generated Demo provider and live AWS Boto3 integration).
              </p>
              <p>
                <strong>2. Correlation & Health Engine:</strong> Rather than isolated dashboards, our correlation engine cross-references time-series departure deltas, deployment timestamps, and dependency trees. If a latency spike follows a container rollout within 120 seconds while downstream RDS databases remain healthy, the system computes an 87% confidence root-cause attribution isolating application code contention.
              </p>
              <p>
                <strong>3. AI Cloud Copilot:</strong> The Copilot is powered by a grounded reasoning engine that parses actual active telemetry instead of generic hallucinations. It produces structured outputs: Summary, Evidence, Probable Cause, Impact, and Recommendations.
              </p>
              <p>
                <strong>4. Controlled Safety Remediation:</strong> Destructive operations are never blindly executed. CloudPulse X enforces a <em>Detect ➔ Analyze ➔ Recommend ➔ User Approval ➔ Execute</em> workflow with rollback strategies and immutable audit logging.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Key Interview Question Defense Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-peach-600" />
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Technology Stack Justifications
            </h3>
          </div>
          <div className="space-y-3 text-xs text-charcoal-600 leading-relaxed">
            <p>
              <strong>React + TypeScript + Tailwind:</strong> Fast rendering of real-time time-series telemetry charts and interactive node topologies with type safety.
            </p>
            <p>
              <strong>FastAPI + Pydantic v2:</strong> High-performance asynchronous execution, strict input/output validation, and automatic OpenAPI schema documentation.
            </p>
            <p>
              <strong>SQLAlchemy + PostgreSQL / SQLite:</strong> Clean ORM relationships for incidents, evidence matrices, audit logs, and resources with zero-config local run capability.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-peach-600" />
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Biggest Engineering Challenge
            </h3>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            <strong>Signal Correlation & Noise Reduction:</strong> Designing the correlation engine to evaluate multiple temporal signals simultaneously without generating alert storms. Solved by implementing modular rule evaluators with confidence scoring thresholds and cross-tier health checks (e.g. verifying database query latencies to rule out false positives).
          </p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-peach-600" />
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Unique Differentiating Feature
            </h3>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            <strong>Interactive Infrastructure Digital Twin with Live State Transitions:</strong> Combining interactive dependency topology with 5 instant interview demo scenarios (Healthy, Performance Degradation, Security Misconfig, FinOps Waste, Crash Loop) allows real-time demonstration of autonomous incident detection and remediation.
          </p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-peach-600" />
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              DevOps & Production Readiness
            </h3>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Equipped with <strong>Docker & Docker Compose</strong>, a multi-stage <strong>GitHub Actions CI/CD</strong> workflow, modular <strong>Terraform</strong> AWS infrastructure modules (VPC, EC2, RDS, S3, CloudWatch), and ready-to-deploy <strong>Kubernetes</strong> manifests.
          </p>
        </div>
      </div>
    </div>
  );
};
