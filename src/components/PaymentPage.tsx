import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send,
  Building2,
  Copy,
  Check,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  type PaymentRequestContext,
  getPaymentRequestContext,
  savePaymentRequestContext,
  clearPaymentRequestContext
} from '../lib/paymentContext';
import {
  submitDepositRequest,
  submitWithdrawalRequest,
  submitPlanUpgradeRequest,
  submitMembershipUpgradeRequest,
  submitVehiclePurchaseRequest,
  submitInvestmentRequest,
  submitVehicleCashOutRequest,
  type PaymentRequestResult
} from '../lib/paymentRequests';
import { navigate } from '../lib/navigation';
import { PageTransition, Reveal, MotionCard } from './MotionSystem';

export const PaymentPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [context, setContext] = useState<PaymentRequestContext | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const loadedContext = getPaymentRequestContext();
    if (loadedContext) {
      setContext(loadedContext);
    }
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmSubmit = async () => {
    if (!context || !user || context.is_submitted || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    let result: PaymentRequestResult;

    try {
      switch (context.request_type) {
        case 'deposit':
          result = await submitDepositRequest({
            amount: context.amount,
            currency: context.currency || 'USD',
            paymentMethod: context.payment_method || 'Bank Wire / Crypto Transfer',
            notes: context.notes,
          });
          break;

        case 'withdrawal':
          result = await submitWithdrawalRequest({
            amount: context.amount,
            currency: context.currency || 'USD',
            assetName: context.asset_name || context.item_name || 'Account Available Balance',
            notes: context.notes,
          });
          break;

        case 'plan_upgrade':
          result = await submitPlanUpgradeRequest({
            planId: context.plan_id || 'starter-ai',
            planName: context.plan_name || context.item_name || 'AI Trading Plan',
            price: context.amount,
            notes: context.notes,
          });
          break;

        case 'membership_upgrade':
          result = await submitMembershipUpgradeRequest({
            tierId: context.tier_id || '',
            tierName: context.tier_name || context.item_name || 'Membership Tier',
            price: context.amount,
            notes: context.notes,
          });
          break;

        case 'vehicle_purchase':
          result = await submitVehiclePurchaseRequest({
            vehicleId: context.vehicle_id || '',
            vehicleName: context.vehicle_name || context.item_name || 'Tesla Vehicle',
            paymentOption: context.payment_option || 'part',
            fullPrice: context.full_price || context.amount,
            partPaymentAmount: context.part_payment_amount || 5000,
            quantity: context.quantity || 1,
            notes: context.notes,
          });
          break;

        case 'investment':
          result = await submitInvestmentRequest({
            projectId: context.project_id || '',
            projectName: context.project_name || context.item_name || 'Investment Project',
            amount: context.amount,
            currency: context.currency || 'USD',
            notes: context.notes,
          });
          break;

        case 'cash_out':
          result = await submitVehicleCashOutRequest({
            orderId: context.order_id,
            vehicleName: context.vehicle_name || context.item_name || 'Vehicle Reservation',
            amount: context.amount,
            currency: context.currency || 'USD',
            reason: context.reason || context.notes,
          });
          break;

        default:
          result = {
            success: false,
            requestId: null,
            referenceId: null,
            status: 'pending',
            message: 'Unsupported request type',
          };
      }

      setIsSubmitting(false);

      if (result.success) {
        const updatedContext: PaymentRequestContext = {
          ...context,
          reference_id: result.referenceId || result.requestId || context.reference_id,
          request_id: result.requestId,
          status: 'pending',
          is_submitted: true,
        };
        setContext(updatedContext);
        savePaymentRequestContext(updatedContext);
      } else {
        setErrorMessage(result.message || 'Unable to submit request. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'An unexpected error occurred while processing request.');
    }
  };

  if (!context) {
    return (
      <PageTransition className="min-h-screen bg-[#030304] text-white py-20 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 text-white/40" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            No Active Payment Request
          </h1>
          <p className="text-xs text-white/50 leading-relaxed font-light">
            No active payment context or request details were found. Please navigate to the Dashboard or Shop to initiate a request.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </PageTransition>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Deposit Request';
      case 'withdrawal': return 'Withdrawal Request';
      case 'plan_upgrade': return 'AI Plan Subscription';
      case 'membership_upgrade': return 'Membership Tier Upgrade';
      case 'vehicle_purchase': return 'Vehicle Order Request';
      case 'investment': return 'Project Investment Request';
      case 'cash_out': return 'Vehicle / Asset Cash-Out';
      default: return 'Payment Request';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownCircle className="w-5 h-5 text-emerald-400" />;
      case 'withdrawal': return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      case 'plan_upgrade': return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'membership_upgrade': return <CreditCard className="w-5 h-5 text-amber-400" />;
      case 'vehicle_purchase': return <ShoppingBag className="w-5 h-5 text-red-500" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-cyan-400" />;
      case 'cash_out': return <RotateCcw className="w-5 h-5 text-orange-400" />;
      default: return <CreditCard className="w-5 h-5 text-red-500" />;
    }
  };

  const customerName = context.customer_name || (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Valued Investor');
  const customerEmail = context.customer_email || user?.email || 'N/A';

  return (
    <PageTransition className="min-h-screen bg-[#030304] text-white py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-mono text-white/50 hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Reference ID:</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs font-bold text-red-400">
              {context.reference_id}
            </span>
          </div>
        </div>

        <Reveal>
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(context.request_type)}
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
                {getTypeLabel(context.request_type)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Payment &amp; Settlement <span className="text-white/40">Portal</span>
            </h1>
            <p className="text-xs text-white/60 font-light mt-1 max-w-2xl">
              Complete request details and settlement instructions for your allocation.
            </p>
          </div>
        </Reveal>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Request Summary & Customer Info */}
          <div className="lg:col-span-7 space-y-6">
            <MotionCard className="p-6 rounded-2xl bg-[#08080a] border border-white/10 space-y-6">
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Item / Allocation</span>
                  <h3 className="text-xl font-bold text-white uppercase mt-0.5">
                    {context.item_name || context.vehicle_name || context.project_name || context.tier_name || context.plan_name || getTypeLabel(context.request_type)}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Requested Amount</span>
                  <p className="text-2xl font-black text-white font-mono mt-0.5">
                    ${context.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {context.currency || 'USD'}
                  </p>
                </div>
              </div>

              {/* Request Type Specific Breakdown */}
              {context.request_type === 'vehicle_purchase' && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/40">Vehicle Full Price:</span>
                    <span className="text-white font-bold">${(context.full_price || context.amount).toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-400">Payment Selected:</span>
                    <span className="text-emerald-400 font-bold uppercase">{context.payment_option === 'full' ? 'Pay In Full' : 'Part Payment'}</span>
                  </div>
                  {context.payment_option === 'part' && (
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                      <span className="text-white/40">Remaining Balance:</span>
                      <span className="text-white/80">${Math.max(0, (context.full_price || 0) - context.amount).toLocaleString()} USD</span>
                    </div>
                  )}
                  {context.quantity && context.quantity > 1 && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Quantity:</span>
                      <span className="text-white font-bold">{context.quantity}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Details */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono block">
                  Customer &amp; Account Details
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-xl border border-white/5 font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px]">Full Name</span>
                    <span className="text-white font-bold">{customerName}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">Registered Email</span>
                    <span className="text-white font-bold truncate block">{customerEmail}</span>
                  </div>
                  {context.notes && (
                    <div className="col-span-2 pt-2 border-t border-white/10">
                      <span className="text-white/40 block text-[10px]">Customer Notes</span>
                      <span className="text-white/80 font-sans italic">{context.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Current Request Status</span>
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider mt-0.5 block ${context.is_submitted ? 'text-amber-400' : 'text-zinc-400'}`}>
                    {context.is_submitted ? 'Submitted — Pending Review' : 'Awaiting Final Confirmation'}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  context.is_submitted
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-white/5 text-white/60 border-white/10'
                }`}>
                  {context.is_submitted ? 'Pending Review' : 'Draft'}
                </span>
              </div>
            </MotionCard>
          </div>

          {/* Right Column: Payment Instructions & Final Action */}
          <div className="lg:col-span-5 space-y-6">
            <MotionCard className="p-6 rounded-2xl bg-[#08080a] border border-white/10 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-red-500 tracking-widest font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Payment Settlement Area
                </span>
                <h3 className="text-lg font-black uppercase text-white">
                  Payment Instructions
                </h3>
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  Settlement details for reference <strong>{context.reference_id}</strong>.
                </p>
              </div>

              {/* Centralized Instructions Box */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/40 text-[10px] uppercase">Account Title:</span>
                  <span className="text-white font-bold">Tesla &amp; SpaceX Capital Settlement</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/40 text-[10px] uppercase">Settlement Method:</span>
                  <span className="text-emerald-400 font-bold">{context.payment_method || 'Bank Wire / USDT Transfer'}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/40 text-[10px] uppercase">Settlement Memo / Ref:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-400 font-bold">{context.reference_id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(context.reference_id, 'memo')}
                      className="text-white/40 hover:text-white transition-colors cursor-pointer"
                      title="Copy Reference Code"
                    >
                      {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] text-white/50 leading-relaxed font-sans">
                  <strong>Instruction Notice:</strong> Payment details above represent configured settlement protocols for reference <strong>{context.reference_id}</strong>. Upon administrative confirmation, wire verification details will be reviewed directly for your registered email address.
                </div>
              </div>

              {/* Final Action Button */}
              {context.is_submitted ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 space-y-2">
                    <div className="flex items-center gap-2 font-bold uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      Request Recorded &amp; Submitted
                    </div>
                    <p className="text-emerald-300/80 font-light leading-relaxed">
                      Your request has been logged under reference <strong>{context.reference_id}</strong>. Administrative review is in progress.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Return to Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        clearPaymentRequestContext();
                        navigate('/dashboard');
                      }}
                      className="w-full py-3 rounded-full bg-transparent hover:bg-white/5 text-white/50 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Clear Active Session &amp; Start New Request
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    Click below to confirm and submit your request. Your request will be recorded under <strong>PENDING REVIEW</strong> status in your database account ledger.
                  </p>

                  <button
                    type="button"
                    onClick={handleConfirmSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(232,33,39,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirm &amp; Submit Request
                      </>
                    )}
                  </button>
                </div>
              )}
            </MotionCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PaymentPage;
