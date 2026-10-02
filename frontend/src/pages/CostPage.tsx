import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CostSummary } from '../types';
import { useScenario } from '../store/scenarioContext';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  DollarSign,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const CostPage: React.FC = () => {
  const [data, setData] = useState<CostSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useScenario();
  const navigate = useNavigate();

  const fetchCost = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.getCostSummary();
      setData(resp);
    } catch (e: any) {
      setError(e.message || 'Failed to load cost intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCost();
  }, [refreshTrigger]);

  if (loading) return <LoadingState message="Analyzing FinOps resource utilization and computing rightsizing models..." />;
  if (error || !data) return <ErrorState title="Cost Intelligence Error" message={error || 'Failed to load FinOps data'} onRetry={fetchCost} />;

  const serviceChartData = Object.entries(data.by_service).map(([name, cost]) => ({
    service: name,
    cost: cost,
  }));

  const tooltipStyle = {
    backgroundColor: '#FFFDFC',
    borderColor: '#EDE3DE',
    borderRadius: '16px',
    boxShadow: '0 8px 24px -4px rgba(39, 35, 33, 0.08)',
    fontSize: '12px',
    padding: '10px 14px',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-charcoal-800 tracking-tight font-sans">
              Cloud Cost & FinOps Intelligence
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-900 border border-peach-200">
              AWS Cost Explorer Engine
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Automated waste detection, instance rightsizing, idle NAT gateway reduction, and multi-service expenditure modeling.
          </p>
        </div>

        <button
          onClick={() => navigate('/copilot')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-charcoal-800 bg-peach-100 hover:bg-peach-200 border border-peach-300 rounded-xl transition-colors shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 text-peach-600 fill-peach-400" />
          <span>Ask Copilot for FinOps Savings</span>
        </button>
      </div>

      {/* Top 4 Cost Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Monthly Projected Spend</p>
          <p className="text-3xl font-extrabold font-mono text-charcoal-800 mt-1">{formatCurrency(data.monthly_estimated)}</p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Budget limit: $3,000.00</p>
        </div>

        <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-subtle bg-emerald-50/20">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Actionable FinOps Savings</p>
          <p className="text-3xl font-extrabold font-mono text-emerald-700 mt-1">{formatCurrency(data.potential_savings)}/mo</p>
          <p className="text-[11px] text-emerald-700 mt-0.5">Through rightsizing & cleanup</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Current Month To Date</p>
          <p className="text-3xl font-extrabold font-mono text-charcoal-800 mt-1">{formatCurrency(data.current_month)}</p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Prev month: {formatCurrency(data.previous_month)}</p>
        </div>

        <div className="bg-white border border-[#EDE3DE] rounded-2xl p-5 shadow-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">FinOps Efficiency Score</p>
          <p className="text-3xl font-extrabold font-mono text-peach-700 mt-1">{data.cost_efficiency_score}%</p>
          <p className="text-[11px] text-charcoal-500 mt-0.5">Resource utilization index</p>
        </div>
      </div>

      {/* 2 Interactive Cost Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend & Budget Line */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              6-Month Spend Trend vs Budget ($)
            </h4>
            <span className="text-[11px] font-mono text-charcoal-500">Historical & Projected</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.cost_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" vertical={false} />
                <XAxis dataKey="month" stroke="#9E938D" fontSize={11} tickLine={false} />
                <YAxis stroke="#9E938D" fontSize={11} unit="$" tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="cost" stroke="#F4A582" strokeWidth={3} name="Actual Spend ($)" />
                <Line type="stepAfter" dataKey="budget" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" name="Target Budget ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost by AWS Service Breakdown */}
        <div className="bg-white border border-[#EDE3DE] rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Expenditure by AWS Service ($/mo)
            </h4>
            <span className="text-[11px] font-mono text-peach-700 font-semibold">EC2 & RDS Primary</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFEB" horizontal={false} />
                <XAxis type="number" stroke="#9E938D" fontSize={11} unit="$" tickLine={false} />
                <YAxis dataKey="service" type="category" stroke="#9E938D" fontSize={11} width={130} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="cost" fill="#F4A582" radius={[0, 8, 8, 0]} name="Monthly Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FinOps Rightsizing Optimization Engine */}
      <div className="bg-white border border-peach-200 rounded-3xl p-6 shadow-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-[#EDE3DE] mb-6">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-charcoal-800 uppercase tracking-wider font-mono">
              Actionable Rightsizing Recommendations
            </h3>
          </div>
          <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Total Savings: {formatCurrency(data.potential_savings)}/month
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.optimizations.map((opt, i) => (
            <div key={i} className="p-5 rounded-2xl bg-peach-50/40 border border-peach-200 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-peach-100 text-peach-800 border border-peach-200">
                      {opt.service_name}
                    </span>
                    <h4 className="text-xs font-bold text-charcoal-800 mt-1.5">{opt.resource_name}</h4>
                  </div>
                  <span className="text-xs font-extrabold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    Save {formatCurrency(opt.monthly_savings)}/mo
                  </span>
                </div>

                <div className="py-2 space-y-1.5 text-xs text-charcoal-600">
                  <p className="text-[11px] text-charcoal-500 leading-relaxed">
                    <strong>Observation:</strong> {opt.observation}
                  </p>
                  <p className="text-[11px] text-charcoal-700 font-medium bg-white p-2.5 rounded-xl border border-[#EDE3DE]">
                    <strong>Recommended Action:</strong> {opt.recommended_action}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-peach-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-charcoal-500">
                  Current: <strong className="font-mono text-charcoal-700">{formatCurrency(opt.current_cost)}/mo</strong> ➔{' '}
                  Target: <strong className="font-mono text-emerald-700">{formatCurrency(opt.recommended_cost)}/mo</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
