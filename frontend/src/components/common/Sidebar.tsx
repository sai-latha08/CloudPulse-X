import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  Network,
  LineChart,
  AlertOctagon,
  Search,
  ShieldCheck,
  DollarSign,
  Sparkles,
  Wrench,
  Clock,
  Bell,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { cn } from '../../utils/formatters';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: 'peach' | 'rose' | 'amber' | 'emerald';
}

export const Sidebar: React.FC = () => {
  const primaryNav: NavItem[] = [
    { name: 'Executive Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Cloud Infrastructure', path: '/infrastructure', icon: Server, badge: '13' },
    { name: 'Digital Twin Map', path: '/digital-twin', icon: Network, badge: 'Twin' },
    { name: 'Observability', path: '/observability', icon: LineChart },
  ];

  const intelligenceNav: NavItem[] = [
    { name: 'Incident Center', path: '/incidents', icon: AlertOctagon, badge: '1 Active', badgeColor: 'rose' },
    { name: 'Root Cause (RCA)', path: '/rca', icon: Search, badge: 'AIOps', badgeColor: 'peach' },
    { name: 'Security Intelligence', path: '/security', icon: ShieldCheck, badge: '2 Crit', badgeColor: 'rose' },
    { name: 'Cost & FinOps', path: '/cost', icon: DollarSign, badge: '$428 Save', badgeColor: 'emerald' },
    { name: 'AI Cloud Copilot', path: '/copilot', icon: Sparkles, badge: 'AI', badgeColor: 'peach' },
  ];

  const operationsNav: NavItem[] = [
    { name: 'Remediation Center', path: '/remediation', icon: Wrench, badge: 'Workflow' },
    { name: 'Event Timeline', path: '/events', icon: Clock },
    { name: 'Alert Center', path: '/alerts', icon: Bell },
    { name: 'Interview Pitch Guide', path: '/interview-guide', icon: HelpCircle, badge: 'Prep' },
  ];

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <h3 className="px-3 text-[10px] font-bold text-charcoal-400 uppercase tracking-wider mb-2 font-mono">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-peach-500 text-white shadow-subtle'
                    : 'text-charcoal-700 hover:bg-peach-100/60 hover:text-charcoal-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-white' : 'text-charcoal-500 group-hover:text-peach-600'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors',
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor === 'rose'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.badgeColor === 'amber'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-peach-100 text-peach-800 border border-peach-200'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="w-64 bg-[#FFFDFC] border-r border-[#EDE3DE] flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div>
        {renderSection('CORE PLATFORM', primaryNav)}
        {renderSection('INTELLIGENCE & REASONING', intelligenceNav)}
        {renderSection('OPERATIONS & WORKFLOWS', operationsNav)}
      </div>

      {/* Cloud Architecture Info Footer */}
      <div className="p-3.5 rounded-2xl bg-peach-50/70 border border-peach-200/80">
        <div className="flex items-center gap-2 text-peach-800 font-bold text-xs">
          <Cpu className="w-3.5 h-3.5 text-peach-600" />
          <span>CloudPulse Engine v1.0</span>
        </div>
        <p className="text-[11px] text-charcoal-500 mt-1 leading-relaxed">
          Active AWS abstraction with autonomous correlation & local deterministic reasoning.
        </p>
      </div>
    </aside>
  );
};
