import React, { useState } from 'react';
import { useAuth } from '../store/authContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Key, ArrowRight, User, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('engineer@cloudpulse.io');
  const [password, setPassword] = useState('Engineer@123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectPersona = (pEmail: string, pPass: string) => {
    setEmail(pEmail);
    setPassword(pPass);
    login(pEmail, pPass).then(() => navigate('/dashboard'));
  };

  return (
    <div className="min-h-screen bg-[#FFFDFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-peach-600 via-peach-500 to-peach-400 p-0.5 shadow-peach-glow flex items-center justify-center text-white mx-auto mb-4">
          <Activity className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-charcoal-800 font-sans">
          CloudPulse <span className="text-peach-600">X</span>
        </h2>
        <p className="mt-1 text-xs text-charcoal-500 font-medium">
          Autonomous Cloud Reliability, Security & Intelligence Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-card rounded-3xl border border-[#EDE3DE] space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-charcoal-50/60 border border-[#EDE3DE] rounded-xl focus:border-peach-500 focus:outline-none text-charcoal-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-charcoal-50/60 border border-[#EDE3DE] rounded-xl focus:border-peach-500 focus:outline-none text-charcoal-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-peach-500 hover:bg-peach-600 shadow-peach-glow transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Operations Console'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Persona Shortcuts */}
          <div className="pt-4 border-t border-[#EDE3DE]">
            <p className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider mb-3 text-center">
              Quick 1-Click Demo Personas
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => selectPersona('admin@cloudpulse.io', 'Admin@123')}
                className="w-full p-2.5 rounded-xl border border-[#EDE3DE] hover:border-peach-400 bg-peach-50/30 hover:bg-peach-50 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-charcoal-800">Alex Mercer (Admin)</span>
                  <p className="text-[10px] text-charcoal-500">Full Access + Remediation Approval</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-peach-100 text-peach-800 border border-peach-200">
                  ADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectPersona('engineer@cloudpulse.io', 'Engineer@123')}
                className="w-full p-2.5 rounded-xl border border-[#EDE3DE] hover:border-peach-400 bg-peach-50/30 hover:bg-peach-50 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-charcoal-800">Sarah Chen (DevOps)</span>
                  <p className="text-[10px] text-charcoal-500">Telemetry, RCA, Security & Alerts</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ENGINEER
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectPersona('viewer@cloudpulse.io', 'Viewer@123')}
                className="w-full p-2.5 rounded-xl border border-[#EDE3DE] hover:border-peach-400 bg-peach-50/30 hover:bg-peach-50 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <span className="font-bold text-charcoal-800">Taylor Jordan (Auditor)</span>
                  <p className="text-[10px] text-charcoal-500">Read-Only Compliance Auditing</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  VIEWER
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
