import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createDepositRequest, fetchUserDashboardData } from '../../lib/dashboard';
import { buildDepositTelegramUrl } from '../../lib/telegram';

export const DepositPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState<string>('2000');
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1000) {
      alert('Minimum deposit amount is $1,000.');
      return;
    }

    setIsSubmitting(true);

    const { deposit, error } = await createDepositRequest(user.id, numAmount, 'USD');

    setIsSubmitting(false);

    if (error) {
      alert(`Error submitting deposit: ${error.message}`);
      return;
    }

    const refId = deposit?.reference_id || `DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRef(refId);

    const customerEmail = user.email || '';
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '';

    const telegramUrl = buildDepositTelegramUrl({
      referenceId: refId,
      amount: numAmount,
      currency: 'USD',
      customerName,
      customerEmail,
    });

    setTimeout(() => {
      window.location.href = telegramUrl;
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <ArrowDownCircle className="w-7 h-7 text-red-500" />
          Deposit <span className="text-white/40">Funds</span>
        </h1>
        <p className="text-xs text-white/50 font-light mt-1">
          Initiate a deposit request. Payment details and settlement instructions will be provided via Telegram.
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

      {submittedRef ? (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Deposit Request Created</h2>
          <p className="text-xs text-white/70 max-w-md mx-auto">
            Reference ID: <strong className="font-mono text-emerald-300">{submittedRef}</strong>
          </p>
          <p className="text-xs text-white/50">
            Redirecting to Telegram settlement support...
          </p>
        </div>
      ) : (
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

          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-white/60 font-light leading-relaxed">
            Note: Submitting this form creates a pending deposit request and redirects to our Telegram settlement representative. Your balance will update upon receipt confirmation.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(232,33,39,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Request...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Deposit &amp; Open Telegram
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
