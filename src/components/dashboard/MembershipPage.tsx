import React, { useEffect, useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchMembershipTiers, type MembershipTier } from '../../lib/plans';
import { fetchUserDashboardData } from '../../lib/dashboard';
import { submitMembershipUpgradeRequest } from '../../lib/paymentRequests';

export const MembershipPage: React.FC = () => {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchMembershipTiers(),
      user?.id ? fetchUserDashboardData(user.id) : Promise.resolve(null),
    ]).then(([tiersData, dashData]) => {
      if (mounted) {
        setTiers(tiersData);
        if (dashData) {
          setActivePlanId(dashData.activePlanId);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleSelectPlan = async (tier: MembershipTier) => {
    if (!user) return;
    setUpgradingId(tier.id);
    setStatusMessage(null);

    const result = await submitMembershipUpgradeRequest({
      tierId: tier.id,
      tierName: tier.name,
      price: tier.price,
    });

    setUpgradingId(null);

    if (!result.success) {
      setStatusMessage(`Error submitting upgrade request: ${result.message}`);
    } else {
      setStatusMessage(`Upgrade request for ${tier.name} Tier submitted successfully! Reference: ${(result.referenceId || result.requestId || '').slice(0, 8)}. Settlement details will be sent to your email (${user.email}).`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <p className="text-xs uppercase font-mono tracking-widest text-white/50">Loading Membership Cards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-red-500" />
          Membership <span className="text-white/40">Cards</span>
        </h1>
        <p className="text-xs text-white/50 font-light mt-1">
          Explore and manage your active membership card status, privileges, and tier upgrade requests.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Visual Digital Membership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrent = tier.id === activePlanId;
          const isGold = tier.id.includes('gold');
          const isPlatinum = tier.id.includes('platinum');

          let cardGradient = 'from-zinc-800 to-zinc-950 border-white/10';
          let textColor = 'text-slate-300';

          if (isGold) {
            cardGradient = 'from-amber-900/60 via-amber-950 to-black border-amber-500/30';
            textColor = 'text-amber-400';
          } else if (isPlatinum) {
            cardGradient = 'from-cyan-900/60 via-zinc-900 to-black border-cyan-500/30';
            textColor = 'text-cyan-400';
          }

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-7 bg-gradient-to-br ${cardGradient} border flex flex-col justify-between space-y-6 shadow-xl overflow-hidden`}
            >
              {/* Background Holographic Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${textColor}`}>
                      Space Capital Card
                    </span>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5">
                      {tier.name}
                    </h2>
                  </div>
                  <ShieldCheck className={`w-8 h-8 ${textColor}`} />
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 mb-6">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Tier Price</span>
                  <p className="text-lg font-black text-white font-mono">${tier.price.toLocaleString()}</p>
                </div>

                <p className="text-xs text-white/60 font-light leading-relaxed mb-6">{tier.description}</p>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 block">Included Privileges</span>
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${textColor} shrink-0`} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  type="button"
                  onClick={() => handleSelectPlan(tier)}
                  disabled={isCurrent || upgradingId === tier.id}
                  className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg disabled:opacity-50'
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Active Membership
                    </>
                  ) : upgradingId === tier.id ? (
                    'Submitting...'
                  ) : (
                    <>
                      Request {tier.name} Upgrade
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <a
                  href="/dashboard/deposit"
                  className="block text-center text-[10px] font-mono text-white/40 hover:text-white/70 uppercase tracking-wider"
                >
                  Deposit funds to maintain tier eligibility →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
