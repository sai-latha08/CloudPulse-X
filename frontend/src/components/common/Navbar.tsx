import React, { useState } from 'react';
import { useAuth } from '../../store/authContext';
import { useScenario } from '../../store/scenarioContext';
import { UserRole } from '../../types';
import {
  Activity,
  Shield,
  Bell,
  Sparkles,
  User,
  ChevronDown,
  Cloud,
  Check,
  LogOut,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { activeScenario } = useScenario();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const rolesList: { id: UserRole; name: string; badge: string; desc: string }[] = [
    { id: 'ADMIN', name: 'Admin (Alex Mercer)', badge: 'Full Control', desc: 'Can approve and execute remediations' },
    { id: 'ENGINEER', name: 'DevOps Engineer (Sarah Chen)', badge: 'Operations', desc: 'Full monitoring, RCA, security, and alerts' },
    { id: 'VIEWER', name: 'Auditor / Viewer (Taylor Jordan)', badge: 'Read Only', desc: 'Read-only visibility for compliance' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFC]/95 backdrop-blur-md border-b border-[#EDE3DE]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-peach-600 via-peach-500 to-peach-400 p-0.5 shadow-peach-glow flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold tracking-tight text-charcoal-800 font-sans">
                    CloudPulse <span className="text-peach-600 font-black">X</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-peach-100 text-peach-800 border border-peach-200">
                    AIOps
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-500 hidden md:block">
                  Observe. Understand. Secure. Optimize.
                </p>
              </div>
            </Link>

            {/* Provider Mode Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#EDE3DE] shadow-subtle">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-charcoal-700">AWS Mode:</span>
              <span className="text-xs font-bold text-peach-700 bg-peach-50 px-1.5 py-0.2 rounded border border-peach-200">
                Demo Provider
              </span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Copilot Quick Launch Button */}
            <button
              onClick={() => navigate('/copilot')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-charcoal-800 bg-peach-100/80 hover:bg-peach-200 border border-peach-300 rounded-xl transition-all shadow-subtle hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-peach-700 fill-peach-400" />
              <span className="hidden sm:inline">Ask Copilot</span>
            </button>

            {/* Interview Guide Link */}
            <Link
              to="/interview-guide"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal-700 bg-white hover:bg-peach-50 border border-[#EDE3DE] hover:border-peach-400 rounded-xl transition-colors shadow-subtle"
            >
              <HelpCircle className="w-3.5 h-3.5 text-peach-600" />
              <span className="hidden md:inline">Interview Pitch</span>
            </Link>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EDE3DE] bg-white hover:bg-peach-50 text-xs font-medium text-charcoal-700 transition-colors shadow-subtle"
              >
                <Shield className="w-3.5 h-3.5 text-peach-600" />
                <span>Role: <strong className="text-charcoal-800">{role}</strong></span>
                <ChevronDown className="w-3 h-3 text-charcoal-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#EDE3DE] shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#EDE3DE] mb-1">
                    <p className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">Role-Based Access Control</p>
                    <p className="text-[11px] text-charcoal-500">Switch persona for live interview walkthroughs</p>
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-start justify-between transition-colors ${
                        role === r.id ? 'bg-peach-50 border border-peach-200' : 'hover:bg-charcoal-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-charcoal-800">{r.name}</span>
                          {role === r.id && <Check className="w-3.5 h-3.5 text-peach-600" />}
                        </div>
                        <p className="text-[11px] text-charcoal-500 mt-0.5">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-9 h-9 rounded-xl bg-peach-100 border border-peach-300 flex items-center justify-center text-peach-800 font-bold text-xs shadow-subtle hover:bg-peach-200 transition-colors"
              >
                {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'CP'}
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-[#EDE3DE] shadow-elevated p-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="p-3 border-b border-[#EDE3DE] mb-1">
                    <p className="text-xs font-bold text-charcoal-800">{user?.full_name}</p>
                    <p className="text-[11px] text-charcoal-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/login"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out / Switch User</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
