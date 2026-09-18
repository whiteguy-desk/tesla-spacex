import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const ADMIN_EMAIL = 'elonmusk2580800@gmail.com';
const ALLOWED_REQUEST_TYPES = [
  'deposit',
  'withdrawal',
  'plan_upgrade',
  'membership_upgrade',
  'vehicle_purchase',
  'investment',
  'cash_out',
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to validate UUID format strictly
function isValidUUID(uuidStr: unknown): boolean {
  if (typeof uuidStr !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuidStr);
}

function formatCurrency(amount: number): string {
  return Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export interface TransactionDetails {
  requestType: string;
  requestTypeLabel: string;
  narration: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentOption: 'full' | 'part' | 'n/a';
  productName: string;
  productId: string;
  projectName: string;
  projectId: string;
  planName: string;
  planId: string;
  quantity: number;
  fullPrice: number;
  initialPayment: number;
  remainingBalance: number;
  notes: string;
  referenceId: string;
  recordId: string;
  customerName: string;
  customerEmail: string;
  customerUserId: string;
  status: string;
  createdAt: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseAnonKey;

    const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid user session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const {
      request_type,
      payment_option = 'part', // 'full' or 'part'
      amount = 0,
      currency = 'USD',
      payment_method,
      reference_id,
      project_id,
      project_name,
      vehicle_id,
      vehicle_name,
      plan_id,
      plan_name,
      notes,
      asset_name,
      order_id,
      quantity = 1,
      full_price = 0,
      part_payment_amount = 0,
    } = body;

    if (!request_type || !ALLOWED_REQUEST_TYPES.includes(request_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid request type. Allowed: ${ALLOWED_REQUEST_TYPES.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile for full name
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .maybeSingle();

    const userFullName = profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : user.email?.split('@')[0] || 'User';
    const userEmail = user.email || '';

    const ref = reference_id || `REQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    let recordId = ref;
    let transactionType = request_type;
    let details: TransactionDetails;

    // Step 1: Database persistence comes first
    switch (request_type) {
      case 'deposit': {
        const depositAmount = Number(amount) || 0;
        const method = payment_method || 'Bank Wire';

        const { data: deposit, error: depErr } = await supabaseAdmin
          .from('deposits')
          .insert({
            user_id: user.id,
            amount: depositAmount,
            currency,
            payment_method: method,
            notes,
            status: 'pending',
            reference_id: ref,
          })
          .select()
          .single();

        if (depErr) throw depErr;
        recordId = deposit.id;
        transactionType = 'deposit';

        const narration = `Deposit request — $${formatCurrency(depositAmount)} ${currency} via ${method}`;

        details = {
          requestType: 'deposit',
          requestTypeLabel: 'Deposit',
          narration,
          amount: depositAmount,
          currency,
          paymentMethod: method,
          paymentOption: 'n/a',
          productName: '',
          productId: '',
          projectName: '',
          projectId: '',
          planName: '',
          planId: '',
          quantity: 1,
          fullPrice: depositAmount,
          initialPayment: depositAmount,
          remainingBalance: 0,
          notes: notes || '',
          referenceId: ref,
          recordId,
          customerName: userFullName,
          customerEmail: userEmail,
          customerUserId: user.id,
          status: 'pending',
          createdAt: nowIso,
        };

        const { error: txErr } = await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: transactionType,
          amount: depositAmount,
          currency,
          status: 'pending',
          reference: ref,
          description: narration,
        });
        if (txErr) {
          console.error('[Transaction Ledger Insert Error]', txErr);
          throw txErr;
        }
        break;
      }

      case 'withdrawal':
      case 'cash_out': {
        const wthAmount = Number(amount) || 0;
        const sourceAsset = asset_name || vehicle_name || 'Account Balance';
        const isCashOut = request_type === 'cash_out';

        const { data: wth, error: wthErr } = await supabaseAdmin
          .from('withdrawals')
          .insert({
            user_id: user.id,
            amount: wthAmount,
            currency,
            asset_name: sourceAsset,
            notes,
            status: 'pending',
            reference_id: ref,
          })
          .select()
          .single();

        if (wthErr) throw wthErr;
        recordId = wth.id;
        transactionType = 'withdrawal';

        const narration = isCashOut
          ? `Vehicle cash-out request — ${sourceAsset} — $${formatCurrency(wthAmount)} ${currency}`
          : `Withdrawal request — $${formatCurrency(wthAmount)} ${currency} from ${sourceAsset}`;

        details = {
          requestType,
          requestTypeLabel: isCashOut ? 'Vehicle Cash-Out' : 'Withdrawal',
          narration,
          amount: wthAmount,
          currency,
          paymentMethod: 'Account Transfer',
          paymentOption: 'n/a',
          productName: isCashOut ? sourceAsset : '',
          productId: order_id || '',
          projectName: '',
          projectId: '',
          planName: '',
          planId: '',
          quantity: 1,
          fullPrice: wthAmount,
          initialPayment: wthAmount,
          remainingBalance: 0,
          notes: notes || '',
          referenceId: ref,
          recordId,
          customerName: userFullName,
          customerEmail: userEmail,
          customerUserId: user.id,
          status: 'pending',
          createdAt: nowIso,
        };

        const { error: txErr } = await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: transactionType,
          amount: wthAmount,
          currency,
          status: 'pending',
          reference: ref,
          description: narration,
        });
        if (txErr) {
          console.error('[Transaction Ledger Insert Error]', txErr);
          throw txErr;
        }
        break;
      }

      case 'vehicle_purchase': {
        let resolvedVehicleId: string | null = null;
        if (isValidUUID(vehicle_id)) {
          resolvedVehicleId = vehicle_id;
        } else if (vehicle_id) {
          const { data: vSlug } = await supabaseAdmin
            .from('vehicles')
            .select('id')
            .eq('slug', vehicle_id)
            .maybeSingle();

          if (vSlug) {
            resolvedVehicleId = vSlug.id;
          } else {
            const { data: vName } = await supabaseAdmin
              .from('vehicles')
              .select('id')
              .ilike('name', vehicle_id)
              .maybeSingle();
            if (vName) resolvedVehicleId = vName.id;
          }
        }

        const isFullPayment = payment_option === 'full' || (amount > 0 && Number(amount) === Number(full_price));
        const effectiveFullPrice = Number(full_price) || Number(amount) || 0;
        const effectivePartPayment = isFullPayment ? 0 : (Number(part_payment_amount) || 5000);
        const remainingBalance = isFullPayment ? 0 : Math.max(0, effectiveFullPrice - effectivePartPayment);
        const transactionAmount = isFullPayment ? effectiveFullPrice : (effectivePartPayment || 5000);
        const vName = vehicle_name || 'Tesla Vehicle';
        const qty = Number(quantity) || 1;

        const orderPayload: Record<string, any> = {
          user_id: user.id,
          vehicle_name: vName,
          quantity: qty,
          full_price: effectiveFullPrice,
          part_payment_amount: effectivePartPayment,
          status: 'pending',
          contact_status: 'awaiting_contact',
          customer_name: userFullName,
          customer_email: userEmail,
          notes,
        };
        if (resolvedVehicleId) {
          orderPayload.vehicle_id = resolvedVehicleId;
        }

        const { data: order, error: ordErr } = await supabaseAdmin
          .from('orders')
          .insert(orderPayload)
          .select()
          .single();

        if (ordErr) throw ordErr;
        recordId = order.id;
        transactionType = 'order';

        const narration = isFullPayment
          ? `Vehicle purchase — ${vName} — Pay In Full — $${formatCurrency(effectiveFullPrice)} ${currency} — Quantity: ${qty}`
          : `Vehicle purchase — ${vName} — Part Payment — Initial: $${formatCurrency(effectivePartPayment)} ${currency} — Full Price: $${formatCurrency(effectiveFullPrice)} ${currency} — Remaining: $${formatCurrency(remainingBalance)} ${currency} — Quantity: ${qty}`;

        details = {
          requestType: 'vehicle_purchase',
          requestTypeLabel: 'Vehicle Purchase',
          narration,
          amount: transactionAmount,
          currency,
          paymentMethod: isFullPayment ? 'Pay In Full' : 'Part Payment Reserve',
          paymentOption: isFullPayment ? 'full' : 'part',
          productName: vName,
          productId: resolvedVehicleId || vehicle_id || '',
          projectName: '',
          projectId: '',
          planName: '',
          planId: '',
          quantity: qty,
          fullPrice: effectiveFullPrice,
          initialPayment: isFullPayment ? effectiveFullPrice : effectivePartPayment,
          remainingBalance,
          notes: notes || '',
          referenceId: ref,
          recordId,
          customerName: userFullName,
          customerEmail: userEmail,
          customerUserId: user.id,
          status: 'pending',
          createdAt: nowIso,
        };

        const { error: txErr } = await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: transactionType,
          amount: transactionAmount,
          currency,
          status: 'pending',
          reference: recordId,
          description: narration,
        });
        if (txErr) {
          console.error('[Transaction Ledger Insert Error]', txErr);
          throw txErr;
        }
        break;
      }

      case 'investment': {
        let resolvedProjectId: string | null = null;
        if (isValidUUID(project_id)) {
          resolvedProjectId = project_id;
        } else if (project_id) {
          const { data: pSlug } = await supabaseAdmin
            .from('projects')
            .select('id')
            .eq('slug', project_id)
            .maybeSingle();
          if (pSlug) {
            resolvedProjectId = pSlug.id;
          }
        }

        const invAmount = Number(amount) || 0;
        const pName = project_name || 'Investment Project';

        const invPayload: Record<string, any> = {
          user_id: user.id,
          project_name: pName,
          amount: invAmount,
          currency,
          notes,
          status: 'pending',
        };
        if (resolvedProjectId) {
          invPayload.project_id = resolvedProjectId;
        }

        const { data: inv, error: invErr } = await supabaseAdmin
          .from('investments')
          .insert(invPayload)
          .select()
          .single();

        if (invErr) throw invErr;
        recordId = inv.id;
        transactionType = 'investment';

        const narration = `Investment request — ${pName} — $${formatCurrency(invAmount)} ${currency}`;

        details = {
          requestType: 'investment',
          requestTypeLabel: 'Investment Request',
          narration,
          amount: invAmount,
          currency,
          paymentMethod: 'Capital Allocation',
          paymentOption: 'n/a',
          productName: '',
          productId: '',
          projectName: pName,
          projectId: resolvedProjectId || project_id || '',
          planName: '',
          planId: '',
          quantity: 1,
          fullPrice: invAmount,
          initialPayment: invAmount,
          remainingBalance: 0,
          notes: notes || '',
          referenceId: ref,
          recordId,
          customerName: userFullName,
          customerEmail: userEmail,
          customerUserId: user.id,
          status: 'pending',
          createdAt: nowIso,
        };

        const { error: txErr } = await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: transactionType,
          amount: invAmount,
          currency,
          status: 'pending',
          reference: recordId,
          description: narration,
        });
        if (txErr) {
          console.error('[Transaction Ledger Insert Error]', txErr);
          throw txErr;
        }
        break;
      }

      case 'plan_upgrade':
      case 'membership_upgrade': {
        let resolvedPlanId: string | null = null;
        let resolvedTierName: string = plan_name || 'Membership Tier';
        const upgradeAmount = Number(amount) || 0;

        if (isValidUUID(plan_id)) {
          resolvedPlanId = plan_id;
        }

        if (!resolvedPlanId && (plan_id || plan_name)) {
          const searchVal = plan_name || plan_id;
          const { data: tierByName } = await supabaseAdmin
            .from('membership_tiers')
            .select('id, name')
            .ilike('name', `%${searchVal}%`)
            .maybeSingle();

          if (tierByName) {
            resolvedPlanId = tierByName.id;
            resolvedTierName = tierByName.name;
          } else {
            const { data: tiers } = await supabaseAdmin
              .from('membership_tiers')
              .select('id, name');
            if (tiers && tiers.length > 0) {
              const match = tiers.find(
                (t) =>
                  (plan_id && t.id === plan_id) ||
                  (plan_id && t.name.toLowerCase() === plan_id.toLowerCase()) ||
                  (plan_name && t.name.toLowerCase() === plan_name.toLowerCase())
              );
              if (match) {
                resolvedPlanId = match.id;
                resolvedTierName = match.name;
              }
            }
          }
        }

        const isMembership = request_type === 'membership_upgrade';

        const subPayload: Record<string, any> = {
          user_id: user.id,
          status: 'pending',
          notes: notes || `Request to upgrade to ${resolvedTierName}`,
        };
        if (resolvedPlanId) {
          subPayload.plan_id = resolvedPlanId;
        }

        const { data: sub, error: subErr } = await supabaseAdmin
          .from('user_subscriptions')
          .insert(subPayload)
          .select()
          .single();

        if (subErr) throw subErr;
        recordId = sub.id;
        transactionType = 'plan';

        const narration = isMembership
          ? `Membership upgrade request — ${resolvedTierName} — $${formatCurrency(upgradeAmount)} ${currency}`
          : `Plan upgrade request — ${resolvedTierName} — $${formatCurrency(upgradeAmount)} ${currency}`;

        details = {
          requestType,
          requestTypeLabel: isMembership ? 'Membership Upgrade' : 'Plan Upgrade',
          narration,
          amount: upgradeAmount,
          currency,
          paymentMethod: 'Account Upgrade',
          paymentOption: 'n/a',
          productName: '',
          productId: '',
          projectName: '',
          projectId: '',
          planName: resolvedTierName,
          planId: resolvedPlanId || plan_id || '',
          quantity: 1,
          fullPrice: upgradeAmount,
          initialPayment: upgradeAmount,
          remainingBalance: 0,
          notes: notes || '',
          referenceId: ref,
          recordId,
          customerName: userFullName,
          customerEmail: userEmail,
          customerUserId: user.id,
          status: 'pending',
          createdAt: nowIso,
        };

        const { error: txErr } = await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: transactionType,
          amount: upgradeAmount,
          currency,
          status: 'pending',
          reference: recordId,
          description: narration,
        });
        if (txErr) {
          console.error('[Transaction Ledger Insert Error]', txErr);
          throw txErr;
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported request type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Step 2: Transactional email delivery via Brevo Transactional Email API
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const brevoSenderEmail = Deno.env.get('BREVO_SENDER_EMAIL');
    const brevoSenderName = Deno.env.get('BREVO_SENDER_NAME') || 'Tesla & Spacex';

    let emailSent = false;
    let emailErrorMessage: string | null = null;

    if (!brevoApiKey) {
      console.error('[Brevo Configuration Error] Missing BREVO_API_KEY environment secret.');
      emailErrorMessage = 'BREVO_API_KEY environment secret is not configured.';
    } else if (!brevoSenderEmail) {
      console.error('[Brevo Configuration Error] Missing BREVO_SENDER_EMAIL environment secret.');
      emailErrorMessage = 'BREVO_SENDER_EMAIL environment secret is not configured.';
    } else {
      console.log(`[Brevo Email Dispatch] Sending ${details.requestTypeLabel} request notification via Brevo to admin (${ADMIN_EMAIL}) and user (${userEmail}) using sender ${brevoSenderName} <${brevoSenderEmail}>`);

      // 1. Construct Admin Email Content from normalized details
      const adminEmailContent = `
        <div style="font-family: Arial, sans-serif; color: #111; max-width: 650px; margin: 0 auto; line-height: 1.5;">
          <h2 style="color: #e82127; border-bottom: 2px solid #e82127; padding-bottom: 6px; margin-bottom: 12px;">
            New ${details.requestTypeLabel} Request — Tesla & Spacex
          </h2>
          <p style="font-size: 14px; color: #333; margin-top: 0;">
            A new payment/service request has been submitted by an authenticated user and recorded in the database under <strong>PENDING REVIEW</strong> status.
          </p>

          <div style="background-color: #f4f4f6; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #e82127; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #111;">
              Transaction Narration:
            </p>
            <p style="margin: 4px 0 0 0; font-size: 15px; color: #e82127; font-weight: bold;">
              ${details.narration}
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 40%;"><strong>Request Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.requestTypeLabel}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Record ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${details.recordId}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Reference ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${details.referenceId}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Customer Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.customerName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Customer Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.customerEmail}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Customer User ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${details.customerUserId}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Status:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; color: #d97706; font-weight: bold;">${details.status}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Timestamp:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.createdAt}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Transaction Amount:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">$${formatCurrency(details.amount)} ${details.currency}</td></tr>
            ${details.paymentOption !== 'n/a' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Payment Option:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #e82127;">${details.paymentOption === 'full' ? 'Pay In Full' : 'Part Payment'}</td></tr>` : ''}
            ${details.productName ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Product / Vehicle:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.productName}</td></tr>` : ''}
            ${details.projectName ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Project Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.projectName}</td></tr>` : ''}
            ${details.planName ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Plan / Tier Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.planName}</td></tr>` : ''}
            ${details.quantity > 1 || details.requestType === 'vehicle_purchase' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.quantity}</td></tr>` : ''}
            ${details.requestType === 'vehicle_purchase' ? `
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Full Vehicle Price:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">$${formatCurrency(details.fullPrice)} ${details.currency}</td></tr>
              ${details.paymentOption === 'part' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Initial Part Payment:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">$${formatCurrency(details.initialPayment)} ${details.currency}</td></tr>` : ''}
              ${details.paymentOption === 'part' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Remaining Balance:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">$${formatCurrency(details.remainingBalance)} ${details.currency}</td></tr>` : ''}
            ` : ''}
            ${details.paymentMethod && details.paymentMethod !== 'n/a' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Payment Method:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.paymentMethod}</td></tr>` : ''}
            ${details.notes ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Customer Notes:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${details.notes}</td></tr>` : ''}
          </table>
        </div>
      `;

      // 2. Construct Customer Confirmation Email Content from normalized details
      const userEmailContent = `
        <div style="font-family: Arial, sans-serif; color: #111; max-width: 650px; margin: 0 auto; line-height: 1.6;">
          <h2 style="color: #111; border-bottom: 2px solid #e82127; padding-bottom: 8px; margin-bottom: 16px;">
            Tesla & Spacex — Request Confirmation
          </h2>
          <p>Dear ${details.customerName},</p>
          <p>Your request for <strong>${details.requestTypeLabel}</strong> has been received and registered under status <strong>PENDING REVIEW</strong>.</p>

          <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #e82127; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Transaction Details</p>
            <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold; color: #111;">${details.narration}</p>
            <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Reference ID:</strong> ${details.referenceId}</p>
            <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Request ID:</strong> ${details.recordId}</p>
            <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Requested Amount:</strong> $${formatCurrency(details.amount)} ${details.currency}</p>
            ${details.requestType === 'vehicle_purchase' && details.paymentOption === 'part' ? `
              <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Full Vehicle Price:</strong> $${formatCurrency(details.fullPrice)} ${details.currency}</p>
              <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Initial Part Payment:</strong> $${formatCurrency(details.initialPayment)} ${details.currency}</p>
              <p style="margin: 0; font-size: 14px;"><strong>Remaining Balance:</strong> $${formatCurrency(details.remainingBalance)} ${details.currency}</p>
            ` : ''}
          </div>

          <p><strong>Status & Next Steps:</strong></p>
          <p style="margin-top: 4px;">Our review team will evaluate your request and contact you directly via your registered email address (<strong>${details.customerEmail}</strong>) with instructions.</p>

          <div style="background-color: #fff8f8; border: 1px solid #fecaca; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #7f1d1d; margin-top: 20px;">
            <strong>Important Notice:</strong> Submitting a request registers your interest in our system for review and verification. It does <em>NOT</em> mean that payment has been completed or approved, nor does it perform an automatic charge.
          </div>

          <p style="margin-top: 28px;">Sincerely,<br/><strong>Tesla & Spacex Platform Team</strong></p>
        </div>
      `;

      let adminSuccess = false;
      let userSuccess = false;
      const deliveryErrors: string[] = [];

      // Send Admin Email
      try {
        const adminRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: brevoSenderName, email: brevoSenderEmail },
            to: [{ email: ADMIN_EMAIL, name: 'Tesla & Spacex Admin' }],
            subject: `New ${details.requestTypeLabel} Request — ${details.narration}`,
            htmlContent: adminEmailContent,
          }),
        });

        if (adminRes.ok) {
          adminSuccess = true;
          const adminJson = await adminRes.json().catch(() => ({}));
          console.log('[Brevo Admin Email Success]', adminJson);
        } else {
          const errBody = await adminRes.text();
          console.error(`[Brevo Admin Email HTTP Error] Status ${adminRes.status}: ${errBody}`);
          deliveryErrors.push(`Admin email rejected (HTTP ${adminRes.status}): ${errBody}`);
        }
      } catch (err: any) {
        console.error('[Brevo Admin Email Network Exception]', err);
        deliveryErrors.push(`Admin email exception: ${err?.message || String(err)}`);
      }

      // Send User Confirmation Email
      if (userEmail) {
        try {
          const userRes = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'api-key': brevoApiKey,
              'Content-Type': 'application/json',
              'accept': 'application/json',
            },
            body: JSON.stringify({
              sender: { name: brevoSenderName, email: brevoSenderEmail },
              to: [{ email: userEmail, name: userFullName }],
              subject: `Tesla & Spacex Request Received: ${details.requestTypeLabel} (#${ref.slice(0, 10)})`,
              htmlContent: userEmailContent,
            }),
          });

          if (userRes.ok) {
            userSuccess = true;
            const userJson = await userRes.json().catch(() => ({}));
            console.log('[Brevo User Email Success]', userJson);
          } else {
            const errBody = await userRes.text();
            console.error(`[Brevo User Email HTTP Error] Status ${userRes.status}: ${errBody}`);
            deliveryErrors.push(`User email rejected (HTTP ${userRes.status}): ${errBody}`);
          }
        } catch (err: any) {
          console.error('[Brevo User Email Network Exception]', err);
          deliveryErrors.push(`User email exception: ${err?.message || String(err)}`);
        }
      }

      emailSent = adminSuccess;
      if (deliveryErrors.length > 0) {
        emailErrorMessage = deliveryErrors.join(' | ');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        requestId: recordId,
        referenceId: ref,
        status: 'pending',
        narration: details.narration,
        emailSent,
        emailErrorMessage,
        message: emailSent
          ? 'Your request has been saved and is pending review. We will contact you through your registered email address.'
          : 'Your request was received and is pending review. We could not send the notification email right now, but your request has been saved.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[Edge Function Unhandled Error]', err);
    return new Response(
      JSON.stringify({
        error: 'Unable to submit your request right now. Please try again later.',
        details: err?.message || String(err),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
