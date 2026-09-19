import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchUserDashboardData } from '../../lib/dashboard';
import { savePaymentRequestContext, generateReferenceId } from '../../lib/paymentContext';
import { navigate } from '../../lib/navigation';

export const WithdrawalPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState<string>('500');
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      fetchUserDashboardData(user.id).then((res) => {
        if (mounted) {
          setBalance(res.totalBalance);
          setLoadingBalance(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount.');
      return;
    }

    if (numAmount > balance) {
      setErrorMessage(`Withdrawal amount ($${numAmount.toLocaleString()}) exceeds your available balance ($${balance.toLocaleString()}).`);
      return;
    }

    const ref = generateReferenceId('withdrawal');
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;

    savePaymentRequestContext({
      request_type: 'withdrawal',
      reference_id: ref,
      amount: numAmount,
      currency: 'USD',
      asset_name: 'Account Available Balance',
      item_name: 'Available Balance Withdrawal',
      customer_name: customerName,
      customer_email: user?.email,
      is_submitted: false,
    });

    navigate(`/payment?ref=${ref}`);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <ArrowUpCircle className="w-7 h-7 text-red-500" />
          Request <span className="text-white/40">Withdrawal</span>
        </h1>
        <p className="text-xs text-white/50 font-light mt-1">
          Enter the amount you wish to withdraw from your available balance and proceed to the Payment Page.
        </p>
      </div>

      {/* Available Balance Display */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Total Available Balance</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {loadingBalance ? '...' : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-wider">
          USD
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 leading-relaxed font-light">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-6">
        <div>
          <label htmlFor="withdrawalAmount" className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
            Withdrawal Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white/40">$</span>
            <input
              id="withdrawalAmount"
              type="number"
              min="1"
              max={balance > 0 ? balance : undefined}
              step="10"
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-lg font-bold text-white outline-none focus:border-red-500 transition-colors"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/60 font-light leading-relaxed">
          Standard withdrawal workflow: Your request will be reviewed and recorded in your account ledger on the Payment Page.
        </div>

        <button
          type="submit"
          disabled={balance <= 0}
          className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(232,33,39,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
