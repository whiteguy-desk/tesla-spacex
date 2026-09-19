import React, { useEffect, useState } from 'react';
import { ShieldCheck, Award, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchMembershipTiers, fetchAiPlans, type MembershipTier, type AiPlan } from '../../lib/plans';
import { fetchUserDashboardData } from '../../lib/dashboard';
import { savePaymentRequestContext, generateReferenceId } from '../../lib/paymentContext';
import { navigate } from '../../lib/navigation';

interface MyPlanPageProps {
  isSubscribeTab?: boolean;
}

export const MyPlanPage: React.FC<MyPlanPageProps> = ({ isSubscribeTab = false }) => {
  const { user, profile } = useAuth();
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [aiPlans, setAiPlans] = useState<AiPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetchMembershipTiers(),
      fetchAiPlans(),
      user?.id ? fetchUserDashboardData(user.id) : Promise.resolve(null),
    ]).then(([tiersData, plansData, dashData]) => {
      if (mounted) {
        setTiers(tiersData);
        setAiPlans(plansData);
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

  const handleSubscribeTier = (tier: MembershipTier) => {
    if (!user) return;

    const ref = generateReferenceId('membership_upgrade');
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;

    savePaymentRequestContext({
      request_type: 'membership_upgrade',
      reference_id: ref,
      tier_id: tier.id,
      tier_name: tier.name,
      item_name: `${tier.name} Membership Tier`,
      amount: tier.price,
      currency: 'USD',
      customer_name: customerName,
      customer_email: user.email,
      is_submitted: false,
    });

    navigate(`/payment?ref=${ref}`);
  };

  const handleSubscribeAiPlan = (plan: AiPlan) => {
    if (!user) return;

    const ref = generateReferenceId('plan_upgrade');
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;

    savePaymentRequestContext({
      request_type: 'plan_upgrade',
      reference_id: ref,
      plan_id: plan.id,
      plan_name: plan.name,
      item_name: `${plan.name} Strategy`,
      amount: plan.min_amount,
      currency: 'USD',
      customer_name: customerName,
      customer_email: user.email,
      is_submitted: false,
    });

    navigate(`/payment?ref=${ref}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <p className="text-xs uppercase font-mono tracking-widest text-white/50">Loading Plan Telemetry...</p>
      </div>
    );
  }

  const currentTier = tiers.find((t) => t.id === activePlanId) || null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-red-500" />
          {isSubscribeTab ? 'Subscribe to' : 'My'} <span className="text-white/40">Plan &amp; Membership</span>
        </h1>
        <p className="text-xs text-white/50 font-light mt-1">
          {isSubscribeTab
            ? 'Select and request a membership tier to unlock priority allocation and VIP support.'
            : 'Your active membership status, benefit features, and tier upgrade requests.'}
        </p>
      </div>

      {/* Current Active Plan Status Banner */}
      {!isSubscribeTab && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-black border border-red-500/20 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400">Current Membership Status</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-0.5">
                {currentTier ? `${currentTier.name} Member` : 'Standard Account (Pending Upgrade Request)'}
              </h2>
            </div>
            {currentTier && (
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                Active Tier
              </span>
            )}
          </div>

          {currentTier ? (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-white/70 font-light leading-relaxed">{currentTier.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {currentTier.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/50 font-light">
              Select a tier below to request an upgrade on the Payment Page.
            </p>
          )}
        </div>
      )}

      {/* Available Membership Tiers Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Membership Tiers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrent = tier.id === activePlanId;
            return (
              <div
                key={tier.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-red-950/40 to-black border-red-500/50 shadow-[0_0_20px_rgba(232,33,39,0.2)]'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/40">
                      {tier.name} Tier
                    </span>
                    <span className="text-sm font-bold text-white">
                      ${tier.price.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{tier.name}</h3>
                  <p className="text-xs text-white/50 font-light leading-relaxed mb-6">{tier.description}</p>

                  <div className="space-y-2 mb-6">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/30">Benefits</span>
                    {tier.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSubscribeTier(tier)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                  }`}
                >
                  {isCurrent ? (
                    'Current Plan'
                  ) : (
                    <>
                      <span>Request Upgrade — ${tier.price.toLocaleString()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available AI Plans Grid */}
      <div className="space-y-4 pt-4 border-t border-white/[0.08]">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          AI Trading Programs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiPlans.map((plan) => (
            <div key={plan.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-400">{plan.name}</span>
                  <span className="text-xs font-bold text-emerald-400">{plan.expected_return_range} Yield</span>
                </div>
                <p className="text-xs text-white/50 font-light mb-4">{plan.description}</p>

                <div className="text-[10px] font-mono text-white/40 space-y-1 mb-4">
                  <p>Min Capital: ${plan.min_amount.toLocaleString()}</p>
                  <p>Cycle Duration: {plan.cycle_duration}</p>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSubscribeAiPlan(plan)}
                className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request Strategy Activation</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
