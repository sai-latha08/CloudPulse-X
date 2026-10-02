import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Search,
  Zap,
  DollarSign,
  ArrowRight,
  Server,
  Network,
  Cpu,
  CheckCircle2,
  Sparkles,
  GitBranch,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFDFC] text-[#272321] flex flex-col selection:bg-peach-200">
      {/* Landing Navbar */}
      <header className="border-b border-[#EDE3DE] bg-[#FFFDFC]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-peach-600 via-peach-500 to-peach-400 p-0.5 shadow-peach-glow flex items-center justify-center text-white">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-charcoal-800">
                CloudPulse <span className="text-peach-600 font-black">X</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-peach-100 text-peach-800 border border-peach-200">
                Autonomous Cloud Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/interview-guide"
              className="text-xs font-bold text-charcoal-700 hover:text-peach-700 px-3 py-2 rounded-xl transition-colors hidden sm:block"
            >
              Interview Pitch
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold text-charcoal-700 hover:text-charcoal-900 px-4 py-2 rounded-xl border border-[#EDE3DE] hover:border-peach-400 bg-white transition-colors shadow-subtle"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 px-5 py-2.5 rounded-xl shadow-peach-glow transition-all hover:scale-105"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Subtle flowing background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-peach-200/40 via-peach-100/30 to-peach-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-peach-100 text-peach-900 border border-peach-300 text-xs font-bold mb-6 shadow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-peach-600 fill-peach-400" />
          <span>Unified CloudOps & AIOps Intelligence Layer</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-charcoal-800 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Understand your cloud before it becomes an{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-peach-600 via-peach-500 to-peach-700">
            incident.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Unified cloud observability, security intelligence, and AI-assisted root-cause analysis for modern AWS infrastructure.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-peach-500 hover:bg-peach-600 rounded-2xl shadow-peach-glow transition-all hover:scale-105"
          >
            <Activity className="w-4 h-4" />
            <span>Explore Live Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/digital-twin')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-charcoal-800 bg-white hover:bg-peach-50 border border-[#EDE3DE] hover:border-peach-400 rounded-2xl transition-all shadow-subtle"
          >
            <Network className="w-4 h-4 text-peach-600" />
            <span>View Digital Twin Topology</span>
          </button>
        </div>

        {/* Live Architecture Flow Visualization */}
        <div className="mt-16 p-6 rounded-3xl bg-white/80 border border-[#EDE3DE] shadow-card max-w-4xl mx-auto backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#EDE3DE] text-xs font-bold text-charcoal-500 uppercase tracking-wider font-mono">
            <span>Autonomous Signal Flow</span>
            <span className="text-peach-700 font-semibold">Correlating Live Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-peach-50/50 border border-peach-200 text-left">
              <span className="text-[10px] font-mono font-bold text-peach-800 uppercase">Step 01</span>
              <h4 className="text-xs font-bold text-charcoal-800 mt-1">Telemetry Ingestion</h4>
              <p className="text-[11px] text-charcoal-500 mt-1">Continuous CloudWatch, VPC flow logs, and deployment events.</p>
            </div>

            <div className="p-4 rounded-2xl bg-peach-50/50 border border-peach-200 text-left">
              <span className="text-[10px] font-mono font-bold text-peach-800 uppercase">Step 02</span>
              <h4 className="text-xs font-bold text-charcoal-800 mt-1">Multi-Signal RCA</h4>
              <p className="text-[11px] text-charcoal-500 mt-1">Correlates deployments to compute CPU surges and API latency.</p>
            </div>

            <div className="p-4 rounded-2xl bg-peach-50/50 border border-peach-200 text-left">
              <span className="text-[10px] font-mono font-bold text-peach-800 uppercase">Step 03</span>
              <h4 className="text-xs font-bold text-charcoal-800 mt-1">AI Copilot Analysis</h4>
              <p className="text-[11px] text-charcoal-500 mt-1">Generates structured explanations with verified evidence.</p>
            </div>

            <div className="p-4 rounded-2xl bg-peach-50/50 border border-peach-200 text-left">
              <span className="text-[10px] font-mono font-bold text-peach-800 uppercase">Step 04</span>
              <h4 className="text-xs font-bold text-charcoal-800 mt-1">Human-Approved Fix</h4>
              <p className="text-[11px] text-charcoal-500 mt-1">One-click simulated or live rollback with audit trails.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Grid */}
      <section className="py-16 bg-peach-50/40 border-y border-[#EDE3DE] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-800 tracking-tight font-sans">
              Designed for High-Reliability Cloud Engineering
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-2">
              Overcoming fragmented monitoring silos by correlating performance, security, and cloud cost signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle hover:border-peach-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-peach-100 text-peach-800 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal-800">AIOps Root Cause Engine</h3>
              <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                Connects deployment release tags directly to abnormal compute spikes, latency degradation, and target group errors with confidence scoring.
              </p>
            </div>

            <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle hover:border-peach-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-peach-100 text-peach-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal-800">Automated Security Audits</h3>
              <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                Scans IAM least-privilege violations, unrestricted security groups (0.0.0.0/0:22), unencrypted S3 buckets, and exposed endpoints.
              </p>
            </div>

            <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle hover:border-peach-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-peach-100 text-peach-800 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal-800">FinOps Rightsizing Engine</h3>
              <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                Identifies underutilized EC2 instances (&lt;8% CPU), oversized RDS databases, and idle NAT gateways with exact monthly savings calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#EDE3DE] mt-auto text-center text-xs text-charcoal-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-charcoal-800">CloudPulse X</span>
            <span>•</span>
            <span>Observe. Understand. Secure. Optimize.</span>
          </div>
          <p>© 2026 CloudPulse X Platform. Built for Enterprise DevOps & Cloud Reliability.</p>
        </div>
      </footer>
    </div>
  );
};
