import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchUserDashboardData } from '../../lib/dashboard';
import { savePaymentRequestContext, generateReferenceId } from '../../lib/paymentContext';
import { navigate } from '../../lib/navigation';

export const DepositPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState<string>('2000');
  const [paymentMethod, setPaymentMethod] = useState<string>('Crypto');
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
    if (isNaN(numAmount) || numAmount < 1000) {
      setErrorMessage('Minimum deposit amount is $1,000.');
      return;
    }

    const ref = generateReferenceId('deposit');
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;

    savePaymentRequestContext({
      request_type: 'deposit',
      reference_id: ref,
      amount: numAmount,
      currency: 'USD',
      payment_method: paymentMethod,
      item_name: 'Account Deposit',
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
          <ArrowDownCircle className="w-7 h-7 text-red-500" />
          Deposit <span className="text-white/40">Funds</span>
        </h1>
        <p className="text-xs text-white/50 font-light mt-1">
          Initiate a deposit request. You will review settlement instructions on the Payment Page.
        </p>
      </div>

      {/* Account Balance Context Card */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Current Available Balance</span>
          <p className="text-2xl font-black text-white mt-1">
            {loadingBalance ? '...' : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Instant Settlement Request
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 leading-relaxed font-light">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-6">
        <div>
          <label htmlFor="depositAmount" className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
            Deposit Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white/40">$</span>
            <input
              id="depositAmount"
              type="number"
              min="1000"
              step="100"
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-lg font-bold text-white outline-none focus:border-red-500 transition-colors"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-[10px] text-white/40 mt-2">Minimum deposit amount: $1,000</p>
        </div>

        {/* Quick Select Buttons */}
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Quick Select</span>
          <div className="grid grid-cols-4 gap-2">
            {['1000', '2500', '5000', '10000'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  amount === val
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                ${parseInt(val).toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
            Preferred Settlement Method
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-red-500 transition-colors cursor-pointer"
          >
            <option value="Crypto">Cryptocurrency Settlement</option>
            <option value="Gift Card">Gift Card Submission</option>
            <option value="Telegram">Telegram Direct Support</option>
            <option value="Email">Email Communication</option>
          </select>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/60 font-light leading-relaxed">
          Note: Proceeding to the General Payment Page will present complete request details and settlement instructions for <strong>{user?.email || 'your account'}</strong>.
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(232,33,39,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
