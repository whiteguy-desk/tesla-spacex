import React, { useEffect, useState } from 'react';
import { Receipt, Loader2, Filter } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchUserDashboardData, type Transaction } from '../../lib/dashboard';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      fetchUserDashboardData(user.id).then((data) => {
        if (mounted) {
          setTransactions(data.transactions);
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type.toLowerCase() === filterType.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <p className="text-xs uppercase font-mono tracking-widest text-white/50">Loading Transaction Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <Receipt className="w-7 h-7 text-red-500" />
            Transaction <span className="text-white/40">Ledger</span>
          </h1>
          <p className="text-xs text-white/50 font-light mt-1">
            Complete record of your deposits, withdrawals, investment allocations, and vehicle orders.
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5">
          <Filter className="w-3.5 h-3.5 text-white/40" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent text-xs text-white outline-none cursor-pointer [&>option]:bg-zinc-900 font-mono"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="investment">Investments</option>
            <option value="plan">Plans</option>
            <option value="order">Orders</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center space-y-3 max-w-lg mx-auto">
          <Receipt className="w-10 h-10 text-white/20 mx-auto" />
          <p className="text-sm font-bold text-white">No Transactions Recorded</p>
          <p className="text-xs text-white/40">There are no transaction records matching your selected filter.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/70">
              <thead className="text-[10px] uppercase font-mono text-white/40 bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold uppercase tracking-wider text-white">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px]">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                      {tx.reference || tx.id.slice(0, 8)}
                    </td>
                    <td className="py-3.5 px-4 text-white/80 font-light">{tx.description}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ${tx.amount.toLocaleString()} {tx.currency || 'USD'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white/40 font-mono text-[10px]">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
