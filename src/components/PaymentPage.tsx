import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send,
  Copy,
  Check,
  LayoutDashboard,
  ShieldCheck,
  MessageCircle,
  Mail,
  Gift,
  Coins,
  Upload,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  type PaymentRequestContext,
  getPaymentRequestContext,
  savePaymentRequestContext
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
import { supabase } from '../lib/supabase';
import { navigate } from '../lib/navigation';
import { PageTransition, Reveal, MotionCard } from './MotionSystem';

export type SelectedPaymentMethod = 'telegram' | 'crypto' | 'giftcard' | 'email';

export const PaymentPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [context, setContext] = useState<PaymentRequestContext | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<SelectedPaymentMethod>('crypto');

  // Gift Card State
  const [giftCardBrand, setGiftCardBrand] = useState<string>('');
  const [giftCardValue, setGiftCardValue] = useState<string>('');
  const [giftCardCurrency, setGiftCardCurrency] = useState<string>('USD');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Common Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [giftCardSuccess, setGiftCardSuccess] = useState<boolean>(false);

  useEffect(() => {
    const loadedContext = getPaymentRequestContext();
    if (loadedContext) {
      setContext(loadedContext);
      if (loadedContext.payment_method) {
        const pm = loadedContext.payment_method.toLowerCase();
        if (pm.includes('telegram')) {
          setSelectedMethod('telegram');
        } else if (pm.includes('gift')) {
          setSelectedMethod('giftcard');
        } else if (pm.includes('email')) {
          setSelectedMethod('email');
        } else {
          setSelectedMethod('crypto');
        }
      }
    }
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
      setFileError('Invalid file format. Please select a JPEG, PNG, WebP, HEIC, or HEIF image.');
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSizeBytes) {
      setFileError('File size exceeds the 10 MB limit. Please select a smaller file.');
      setSelectedFile(null);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleGiftCardSubmit = async () => {
    if (!context || !user || isSubmitting) return;

    if (!selectedFile) {
      setFileError('Gift card image is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setFileError(null);

    const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${user.id}/${context.reference_id}/${Date.now()}_${safeFileName}`;

    let uploadSuccess = false;

    try {
      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('gift-card-submissions')
        .upload(storagePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false,
        });

      if (uploadErr || !uploadData) {
        console.error('Storage upload error:', uploadErr);
        setErrorMessage(uploadErr?.message || 'Failed to upload gift card image. Please try again.');
        setIsSubmitting(false);
        return;
      }

      uploadSuccess = true;

      // 2. Insert record into gift_card_submissions table
      const { error: dbErr } = await supabase
        .from('gift_card_submissions')
        .insert({
          user_id: user.id,
          reference_id: context.reference_id,
          card_brand: giftCardBrand.trim() || null,
          card_value: giftCardValue ? parseFloat(giftCardValue) : context.amount,
          currency: giftCardCurrency || context.currency || 'USD',
          storage_path: uploadData.path || storagePath,
          original_filename: selectedFile.name,
          mime_type: selectedFile.type,
          file_size: selectedFile.size,
          status: 'pending',
        });

      if (dbErr) {
        console.error('DB insert error:', dbErr);
        // Attempt cleanup of uploaded storage object
        try {
          await supabase.storage.from('gift-card-submissions').remove([uploadData.path || storagePath]);
        } catch (cleanupErr) {
          console.warn('Storage cleanup failed:', cleanupErr);
        }

        setErrorMessage(dbErr.message || 'Failed to record gift card submission. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Record request in payment context
      const updatedContext: PaymentRequestContext = {
        ...context,
        payment_method: 'Gift Card',
        is_submitted: true,
        status: 'pending',
      };
      setContext(updatedContext);
      savePaymentRequestContext(updatedContext);
      setGiftCardSuccess(true);
    } catch (err: any) {
      console.error('Gift card processing error:', err);
      if (uploadSuccess) {
        try {
          await supabase.storage.from('gift-card-submissions').remove([storagePath]);
        } catch (_cErr) {}
      }
      setErrorMessage(err?.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
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
            paymentMethod: 'Cryptocurrency',
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
            vehicleName: context.vehicle_name || context.item_name || 'Vehicle Cash Out',
            amount: context.amount,
            currency: context.currency || 'USD',
            reason: context.reason,
          });
          break;

        default:
          result = await submitDepositRequest({
            amount: context.amount,
            currency: context.currency || 'USD',
            paymentMethod: 'Cryptocurrency',
            notes: context.notes,
          });
      }

      if (result.success) {
        const updatedContext: PaymentRequestContext = {
          ...context,
          request_id: result.requestId || context.request_id,
          reference_id: result.referenceId || context.reference_id,
          status: result.status,
          is_submitted: true,
          payment_method: 'Cryptocurrency',
        };
        setContext(updatedContext);
        savePaymentRequestContext(updatedContext);
      } else {
        setErrorMessage(result.message || 'Failed to submit payment request.');
      }
    } catch (err: any) {
      console.error('Error submitting payment request:', err);
      setErrorMessage(err?.message || 'An unexpected error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmailMailtoUrl = () => {
    if (!context) return '#';

    const recipient = 'elonmusk2580800@gmail.com';
    const subject = encodeURIComponent(`[Payment Request] ${context.request_type.toUpperCase()} - Ref: ${context.reference_id}`);

    const bodyText = `
Hello Support Team,

I would like to process my payment request with the following details:

- Reference ID: ${context.reference_id}
- Request Type: ${context.request_type}
- Amount: ${context.amount} ${context.currency || 'USD'}
- Item / Service: ${context.item_name || context.vehicle_name || context.plan_name || context.project_name || 'N/A'}
${context.quantity ? `- Quantity: ${context.quantity}\n` : ''}
${context.payment_option ? `- Payment Option: ${context.payment_option}\n` : ''}
- Customer Name: ${context.customer_name || (profile?.first_name ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() : user?.email || 'N/A')}
- Customer Email: ${user?.email || 'N/A'}
${context.notes ? `- Customer Notes: ${context.notes}\n` : ''}

Please assist me in completing this transaction.

Thank you!
    `.trim();

    return `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const getRequestTypeTitle = (type: string) => {
    switch (type) {
      case 'vehicle_purchase': return 'Vehicle Order Request';
      case 'plan_upgrade': return 'Plan Upgrade Request';
      case 'membership_upgrade': return 'Membership Upgrade Request';
      case 'deposit': return 'Deposit Request';
      case 'withdrawal': return 'Withdrawal Request';
      case 'investment': return 'Investment Request';
      case 'cash_out': return 'Vehicle Cash Out Request';
      default: return type.replace('_', ' ');
    }
  };

  if (!context) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
          <Reveal>
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4 max-w-md">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">No Active Request Found</h2>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                There is no active payment session found in your current session context. Please initiate a request from your dashboard.
              </p>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </Reveal>
        </div>
      </PageTransition>
    );
  }

  const customerName = context.customer_name || (profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Registered Member');
  const customerEmail = context.customer_email || user?.email || 'N/A';

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white mb-2 transition-colors cursor-pointer font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-red-500" />
              Payment <span className="text-white/40">Gateway</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono">
            <span className="text-white/40 uppercase">Ref ID:</span>
            <span className="text-red-400 font-bold">{context.reference_id}</span>
            <button
              type="button"
              onClick={() => handleCopy(context.reference_id, 'ref_top')}
              className="text-white/40 hover:text-white transition-colors ml-1 cursor-pointer"
              title="Copy Reference ID"
            >
              {copiedField === 'ref_top' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold uppercase">Submission Notice</strong>
              <p className="font-sans font-light leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Request Summary */}
          <div className="lg:col-span-7 space-y-6">
            <MotionCard className="p-6 rounded-2xl bg-[#08080a] border border-white/10 space-y-6">
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-red-500 tracking-widest font-bold block">
                    Transaction Summary
                  </span>
                  <h2 className="text-xl font-bold uppercase text-white mt-1">
                    {getRequestTypeTitle(context.request_type)}
                  </h2>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-white/40 uppercase block">Total Amount</span>
                  <span className="text-2xl font-black text-white">
                    ${context.amount.toLocaleString()} <span className="text-xs text-white/50">{context.currency || 'USD'}</span>
                  </span>
                </div>
              </div>

              {/* Specific Item / Vehicle / Plan Details */}
              {(context.item_name || context.vehicle_name || context.plan_name || context.project_name) && (
                <div className="space-y-2 text-xs bg-white/5 p-4 rounded-xl border border-white/5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/40">Item / Target:</span>
                    <span className="text-white font-bold">{context.item_name || context.vehicle_name || context.plan_name || context.project_name}</span>
                  </div>
                  {context.vehicle_name && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Full Price:</span>
                      <span className="text-white font-bold">${(context.full_price || context.amount).toLocaleString()} USD</span>
                    </div>
                  )}
                  {context.payment_option && (
                    <div className="flex justify-between">
                      <span className="text-emerald-400">Payment Option:</span>
                      <span className="text-emerald-400 font-bold uppercase">{context.payment_option === 'full' ? 'Pay In Full' : 'Part Payment'}</span>
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

              {/* Select Payment Method Tabs */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono block">
                  Select Payment Method
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('telegram')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedMethod === 'telegram'
                        ? 'bg-blue-500/15 border-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <MessageCircle className={`w-5 h-5 ${selectedMethod === 'telegram' ? 'text-blue-400' : 'text-white/40'}`} />
                    <div>
                      <span className="block text-xs font-bold uppercase font-mono">Telegram</span>
                      <span className="text-[10px] text-white/40 block font-light">Direct Contact</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('crypto')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedMethod === 'crypto'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Coins className={`w-5 h-5 ${selectedMethod === 'crypto' ? 'text-emerald-400' : 'text-white/40'}`} />
                    <div>
                      <span className="block text-xs font-bold uppercase font-mono">Crypto</span>
                      <span className="text-[10px] text-white/40 block font-light">USDT / BTC / ETH</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('giftcard')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedMethod === 'giftcard'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Gift className={`w-5 h-5 ${selectedMethod === 'giftcard' ? 'text-amber-400' : 'text-white/40'}`} />
                    <div>
                      <span className="block text-xs font-bold uppercase font-mono">Gift Card</span>
                      <span className="text-[10px] text-white/40 block font-light">Image Upload</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('email')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      selectedMethod === 'email'
                        ? 'bg-purple-500/15 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Mail className={`w-5 h-5 ${selectedMethod === 'email' ? 'text-purple-400' : 'text-white/40'}`} />
                    <div>
                      <span className="block text-xs font-bold uppercase font-mono">Email</span>
                      <span className="text-[10px] text-white/40 block font-light">Prefilled Mailto</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Status Section */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Current Request Status</span>
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider mt-0.5 block ${context.is_submitted ? 'text-amber-400' : 'text-zinc-400'}`}>
                    {context.is_submitted ? 'Submitted — Pending Review' : 'Awaiting Final Action'}
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

          {/* Right Column: Instructions & Actions based on Selected Method */}
          <div className="lg:col-span-5 space-y-6">
            <MotionCard className="p-6 rounded-2xl bg-[#08080a] border border-white/10 space-y-6">
              {/* TELEGRAM FLOW */}
              {selectedMethod === 'telegram' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-blue-400 tracking-widest font-bold flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Telegram Direct Contact
                    </span>
                    <h3 className="text-lg font-black uppercase text-white">
                      Connect via Telegram
                    </h3>
                    <p className="text-xs text-white/50 font-light leading-relaxed">
                      Complete your transaction or request personalized assistance directly on Telegram.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/40 text-[10px] uppercase">Telegram Handle:</span>
                      <span className="text-blue-400 font-bold">@elonmusk2580900</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/40 text-[10px] uppercase">Reference ID:</span>
                      <span className="text-white font-bold">{context.reference_id}</span>
                    </div>
                    <p className="text-[10px] font-sans text-white/60 leading-relaxed pt-1">
                      Clicking below will navigate directly to Telegram. Please provide your reference ID (<strong>{context.reference_id}</strong>) to support staff.
                    </p>
                  </div>

                  <a
                    href="https://t.me/elonmusk2580900"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 cursor-pointer no-underline text-center block"
                  >
                    <MessageCircle className="w-4 h-4 inline" />
                    <span>Open Telegram Chat</span>
                    <ExternalLink className="w-3.5 h-3.5 inline ml-1 opacity-70" />
                  </a>
                </div>
              )}

              {/* CRYPTOCURRENCY FLOW */}
              {selectedMethod === 'crypto' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-widest font-bold flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5" />
                      Cryptocurrency Settlement
                    </span>
                    <h3 className="text-lg font-black uppercase text-white">
                      Tesla &amp; SpaceX Settlement
                    </h3>
                    <p className="text-xs text-white/50 font-light leading-relaxed">
                      Settlement details for reference <strong>{context.reference_id}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/40 text-[10px] uppercase">Account Title:</span>
                      <span className="text-white font-bold">Tesla &amp; SpaceX Capital Settlement</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/40 text-[10px] uppercase">Supported Assets:</span>
                      <span className="text-emerald-400 font-bold">USDT (TRC20/ERC20), BTC, ETH</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/40 text-[10px] uppercase">Settlement Memo / Ref:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-red-400 font-bold">{context.reference_id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(context.reference_id, 'memo_crypto')}
                          className="text-white/40 hover:text-white transition-colors cursor-pointer"
                          title="Copy Reference Code"
                        >
                          {copiedField === 'memo_crypto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] text-white/50 leading-relaxed font-sans">
                      <strong>Instruction Notice:</strong> Payment details above represent configured settlement protocols for reference <strong>{context.reference_id}</strong>. Confirm your request below to record your order in your database account ledger.
                    </div>
                  </div>

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

                      <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Return to Dashboard
                      </button>
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
                </div>
              )}

              {/* GIFT CARD FLOW */}
              {selectedMethod === 'giftcard' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest font-bold flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      Gift Card Submission
                    </span>
                    <h3 className="text-lg font-black uppercase text-white">
                      Upload Gift Card Image
                    </h3>
                    <p className="text-xs text-white/50 font-light leading-relaxed">
                      Upload your gift card image for verification and review.
                    </p>
                  </div>

                  {fileError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
                      {fileError}
                    </div>
                  )}

                  {giftCardSuccess || context.is_submitted ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 space-y-2">
                        <div className="flex items-center gap-2 font-bold uppercase">
                          <CheckCircle2 className="w-4 h-4" />
                          Gift Card Submitted Successfully
                        </div>
                        <p className="text-emerald-300/80 font-light leading-relaxed">
                          Your gift card submission for reference <strong>{context.reference_id}</strong> has been uploaded and stored securely for administrative review.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Return to Dashboard
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 font-mono text-xs">
                      {/* Image Picker */}
                      <div>
                        <label htmlFor="giftCardFile" className="block text-[10px] uppercase text-white/60 font-bold mb-1.5">
                          Gift Card Image <span className="text-red-400">* Required</span>
                        </label>
                        <div className="relative border-2 border-dashed border-white/15 hover:border-amber-400/50 rounded-xl p-4 text-center transition-colors bg-white/[0.02]">
                          <input
                            id="giftCardFile"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <Upload className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                          {selectedFile ? (
                            <div>
                              <p className="text-white font-bold truncate max-w-xs mx-auto">{selectedFile.name}</p>
                              <p className="text-[10px] text-white/40 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-white/80 font-bold">Click or drag image file here</p>
                              <p className="text-[10px] text-white/40 mt-1">Supported: JPG, PNG, WebP, HEIC (Max 10 MB)</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Optional Brand */}
                      <div>
                        <label htmlFor="giftCardBrand" className="block text-[10px] uppercase text-white/60 font-bold mb-1">
                          Card Brand <span className="text-white/30">(Optional)</span>
                        </label>
                        <input
                          id="giftCardBrand"
                          type="text"
                          placeholder="e.g., Apple, Steam, Amazon, Visa"
                          value={giftCardBrand}
                          onChange={(e) => setGiftCardBrand(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>

                      {/* Optional Value & Currency */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="giftCardValue" className="block text-[10px] uppercase text-white/60 font-bold mb-1">
                            Card Value <span className="text-white/30">(Optional)</span>
                          </label>
                          <input
                            id="giftCardValue"
                            type="number"
                            step="any"
                            placeholder={context.amount.toString()}
                            value={giftCardValue}
                            onChange={(e) => setGiftCardValue(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor="giftCardCurrency" className="block text-[10px] uppercase text-white/60 font-bold mb-1">
                            Currency <span className="text-white/30">(Optional)</span>
                          </label>
                          <input
                            id="giftCardCurrency"
                            type="text"
                            placeholder="USD"
                            value={giftCardCurrency}
                            onChange={(e) => setGiftCardCurrency(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-[10px] text-amber-200/70 font-sans leading-relaxed">
                        Your uploaded card image is submitted directly to secure storage for administrative review.
                      </div>

                      <button
                        type="button"
                        onClick={handleGiftCardSubmit}
                        disabled={isSubmitting || !selectedFile}
                        className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading &amp; Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Submit Gift Card for Review
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* EMAIL FLOW */}
              {selectedMethod === 'email' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-purple-400 tracking-widest font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      Direct Email Action
                    </span>
                    <h3 className="text-lg font-black uppercase text-white">
                      Send Email Request
                    </h3>
                    <p className="text-xs text-white/50 font-light leading-relaxed">
                      Open your email application with a prefilled message containing your payment details.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/40 text-[10px] uppercase">Recipient:</span>
                      <span className="text-purple-300 font-bold truncate">elonmusk2580800@gmail.com</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/40 text-[10px] uppercase">Subject:</span>
                      <span className="text-white font-bold truncate">[Payment Request] {context.request_type.toUpperCase()} - {context.reference_id}</span>
                    </div>
                    <p className="text-[10px] font-sans text-white/60 leading-relaxed pt-1">
                      Clicking below will open your default email application with a prefilled narrative. You will need to press <strong>Send</strong> in your email client.
                    </p>
                  </div>

                  <a
                    href={getEmailMailtoUrl()}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 cursor-pointer no-underline text-center block"
                  >
                    <Mail className="w-4 h-4 inline" />
                    <span>Open Email Client</span>
                  </a>
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
