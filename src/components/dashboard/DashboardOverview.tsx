import React, { useEffect, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  PieChart,
  ShieldCheck,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Loader2,
  BarChart3,
  ExternalLink,
  ShoppingBag,
  Car,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchUserDashboardData, type UserDashboardData } from '../../lib/dashboard';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      fetchUserDashboardData(user.id).then((res) => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <p className="text-xs uppercase font-mono tracking-widest text-white/50">Loading Portfolio Telemetry...</p>
      </div>
    );
  }

  const activePlanName = data?.activePlanId
    ? data.activePlanId.toUpperCase()
    : 'No Active Plan';

  const orders = data?.orders || [];

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Account <span className="text-white/40">Overview</span>
        </h1>
        <p className="text-xs text-white/50 font-light mt-1">
          Real-time account balance, vehicle reservations, and portfolio orders.
        </p>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Total Balance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">
              ${data?.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-white/30 mt-1">Available for allocation / withdrawal</p>
          </div>
        </div>

        {/* Total Profit */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Total Profit</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-400 tracking-tight">
              +${data?.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-white/30 mt-1">Cumulative yield distributed</p>
          </div>
        </div>

        {/* Total Invested */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Total Invested</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-white tracking-tight">
              ${data?.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-white/30 mt-1">Active project allocations</p>
          </div>
        </div>

        {/* Active Plan */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Active Plan</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-amber-300 tracking-tight uppercase">
              {activePlanName}
            </p>
            <a href="/dashboard/my-plan" className="text-[10px] text-amber-400/80 hover:underline mt-1 inline-block">
              View plan benefits →
            </a>
          </div>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] items-center justify-between">
        <div className="text-xs font-medium text-white/70">
          Ready to fund your account or order a vehicle?
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/deposit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
          >
            <ArrowDownCircle className="w-4 h-4" />
            Deposit Funds
          </a>
          <a
            href="/dashboard/withdrawal"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
          >
            <ArrowUpCircle className="w-4 h-4" />
            Request Withdrawal
          </a>
        </div>
      </div>

      {/* ACTIVE VEHICLE ORDERS SECTION */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">Vehicle Orders</h2>
          </div>
          <a
            href="/dashboard/orders"
            className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider flex items-center gap-1"
          >
            View Orders <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/70">
              <thead className="text-[10px] uppercase font-mono text-white/40 bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Vehicle / Product</th>
                  <th className="py-3 px-4">Full Price</th>
                  <th className="py-3 px-4">Part Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-white/90">
                      #{ord.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      {ord.vehicle_name}
                    </td>
                    <td className="py-3 px-4 text-white/80">
                      ${ord.full_price.toLocaleString()} USD
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      ${ord.part_payment_amount.toLocaleString()} USD
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans">
                        {ord.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/40 text-[10px]">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-white/40 bg-white/[0.01] rounded-xl border border-white/5 space-y-2">
            <p>No active vehicle orders recorded for your profile.</p>
            <a
              href="/shop"
              className="inline-block px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider transition-colors border border-white/10"
            >
              Browse Shop &amp; Reserve Vehicle
            </a>
          </div>
        )}
      </div>

      {/* Market Exposure Area */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-white tracking-tight">Portfolio Sector Exposure</h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 bg-white/5 px-2.5 py-1 rounded-md">
            Telemetry Allocation
          </span>
        </div>
        <p className="text-xs text-white/50 font-light leading-relaxed">
          Systematic portfolio allocation tracking across innovation sector equities, private infrastructure projects, and automated AI trading strategies.
        </p>

        {/* Visual Bar telemetry */}
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1 font-mono">
              <span>Aerospace & Orbital Infrastructure (SpaceX)</span>
              <span>38% Allocation</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[38%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1 font-mono">
              <span>Artificial Intelligence & Compute (xAI)</span>
              <span>32% Allocation</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[32%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1 font-mono">
              <span>Clean Energy & EV Manufacturing (Tesla)</span>
              <span>20% Allocation</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full w-[20%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1 font-mono">
              <span>Underground Transit & Neurotech (Boring/Neuralink)</span>
              <span>10% Allocation</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[10%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity / Transactions Table */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
          </div>
          <a
            href="/dashboard/transactions"
            className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider flex items-center gap-1"
          >
            All Activity <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {data?.transactions && data.transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/70">
              <thead className="text-[10px] uppercase font-mono text-white/40 bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold uppercase tracking-wider text-white">
                      {tx.type}
                    </td>
                    <td className="py-3 px-4 text-white/60">{tx.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${tx.amount.toLocaleString()} {tx.currency || 'USD'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/40 font-mono text-[10px]">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-white/40">
            No recent activity recorded yet. Create a deposit or browse investment projects to begin.
          </div>
        )}
      </div>
    </div>
  );
};
