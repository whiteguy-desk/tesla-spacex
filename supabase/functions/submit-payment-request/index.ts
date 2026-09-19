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
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const hasAuthHeader = Boolean(authHeader);
    console.log(`[Edge Function Auth Header Present]: ${hasAuthHeader}`);

    if (!authHeader) {
      console.warn('[Edge Function Auth] Missing Authorization header');
      return new Response(
        JSON.stringify({
          error: 'Unauthorized: Missing authorization header',
          failedOperation: 'authentication',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || supabaseAnonKey;

    const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    console.log('[Edge Function Auth User] Attempting user session retrieval via JWT...');
    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();

    if (userError || !user) {
      console.warn('[Edge Function Auth] User authentication failed:', userError?.message || 'No user session found');
      return new Response(
        JSON.stringify({
          error: 'Unauthorized: Invalid user session',
          details: userError?.message || 'Session token could not be verified',
          failedOperation: 'authentication',
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Edge Function Auth User Success] ID: ${user.id} | Email: ${user.email}`);

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
      quantity = 1,
      full_price = 0,
      part_payment_amount = 0,
      order_id,
    } = body;

    console.log(`[Edge Function Payload] request_type: ${request_type} | amount: ${amount} ${currency}`);

    if (!request_type || !ALLOWED_REQUEST_TYPES.includes(request_type)) {
      console.warn(`[Edge Function Bad Request] Invalid request type: ${request_type}`);
      return new Response(
        JSON.stringify({
          error: `Invalid request type. Allowed: ${ALLOWED_REQUEST_TYPES.join(', ')}`,
          failedOperation: 'validation',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step: Fetch user profile for full name
    console.log(`[Edge Function Profile Lookup] Fetching profile for user ID: ${user.id}`);
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .maybeSingle();

    if (profileErr) {
      console.warn(`[Edge Function Profile Lookup Warning] ${profileErr.message}`);
    } else {
      console.log(`[Edge Function Profile Lookup Success] Name: ${profile?.first_name || ''} ${profile?.last_name || ''}`);
    }

    const userFullName = profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : user.email?.split('@')[0] || 'User';
    const userEmail = user.email || '';

    const ref = reference_id || `REQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    let recordId = ref;
    let transactionType = request_type;
    let details: TransactionDetails;

    // Step 1: Database persistence comes first with strict error responses
    switch (request_type) {
      case 'deposit': {
        const depositAmount = Number(amount) || 0;
        const method = payment_method || 'Bank Wire';

        console.log(`[Edge Function DB Insert - deposits] Amount: $${depositAmount} | Ref: ${ref}`);
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

        if (depErr) {
          console.error('[DB Insert Error - deposits]', depErr);
          return new Response(
            JSON.stringify({
              error: 'Failed to save deposit record',
              details: depErr.message,
              failedOperation: 'deposits_insert',
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        recordId = deposit.id;
        console.log(`[DB Insert Success - deposits] ID: ${recordId}`);

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

        console.log(`[Edge Function DB Insert - transactions] Type: deposit | Amount: $${depositAmount}`);
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
          console.error('[DB Insert Error - transactions]', txErr);
          return new Response(
            JSON.stringify({
              error: 'Deposit created but transaction logging failed',
              details: txErr.message,
              failedOperation: 'transactions_insert',
              requestId: recordId,
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`[DB Insert Success - transactions] Ref: ${ref}`);
        break;
      }

      case 'withdrawal':
      case 'cash_out': {
        const wthAmount = Number(amount) || 0;
        const sourceAsset = asset_name || vehicle_name || 'Account Balance';
        const isCashOut = request_type === 'cash_out';

        console.log(`[Edge Function DB Insert - withdrawals] Amount: $${wthAmount} | Asset: ${sourceAsset}`);
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

        if (wthErr) {
          console.error('[DB Insert Error - withdrawals]', wthErr);
          return new Response(
            JSON.stringify({
              error: 'Failed to save withdrawal record',
              details: wthErr.message,
              failedOperation: 'withdrawals_insert',
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        recordId = wth.id;
        console.log(`[DB Insert Success - withdrawals] ID: ${recordId}`);

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

        console.log(`[Edge Function DB Insert - transactions] Type: withdrawal | Amount: $${wthAmount}`);
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
          console.error('[DB Insert Error - transactions]', txErr);
          return new Response(
            JSON.stringify({
              error: 'Withdrawal created but transaction logging failed',
              details: txErr.message,
              failedOperation: 'transactions_insert',
              requestId: recordId,
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`[DB Insert Success - transactions] Ref: ${ref}`);
        break;
      }

      case 'vehicle_purchase': {
        console.log(`[Edge Function Vehicle Resolution] vehicle_id: "${vehicle_id}"`);
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

        console.log(`[Edge Function DB Insert - orders] Vehicle: ${vName} | Option: ${payment_option}`);
        const { data: order, error: ordErr } = await supabaseAdmin
          .from('orders')
          .insert(orderPayload)
          .select()
          .single();

        if (ordErr) {
          console.error('[DB Insert Error - orders]', ordErr);
          return new Response(
            JSON.stringify({
              error: 'Failed to save vehicle order',
              details: ordErr.message,
              failedOperation: 'orders_insert',
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        recordId = order.id;
        console.log(`[DB Insert Success - orders] ID: ${recordId}`);

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

        console.log(`[Edge Function DB Insert - transactions] Type: order | Record: ${recordId}`);
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
          console.error('[DB Insert Error - transactions]', txErr);
          return new Response(
            JSON.stringify({
              error: 'Order created but transaction logging failed',
              details: txErr.message,
              failedOperation: 'transactions_insert',
              requestId: recordId,
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`[DB Insert Success - transactions] Record: ${recordId}`);
        break;
      }

      case 'investment': {
        console.log(`[Edge Function Project Resolution] project_id: "${project_id}"`);
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

        console.log(`[Edge Function DB Insert - investments] Project: ${pName} | Amount: $${invAmount}`);
        const { data: inv, error: invErr } = await supabaseAdmin
          .from('investments')
          .insert(invPayload)
          .select()
          .single();

        if (invErr) {
          console.error('[DB Insert Error - investments]', invErr);
          return new Response(
            JSON.stringify({
              error: 'Failed to save investment record',
              details: invErr.message,
              failedOperation: 'investments_insert',
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        recordId = inv.id;
        console.log(`[DB Insert Success - investments] ID: ${recordId}`);

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

        console.log(`[Edge Function DB Insert - transactions] Type: investment | Record: ${recordId}`);
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
          console.error('[DB Insert Error - transactions]', txErr);
          return new Response(
            JSON.stringify({
              error: 'Investment created but transaction logging failed',
              details: txErr.message,
              failedOperation: 'transactions_insert',
              requestId: recordId,
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`[DB Insert Success - transactions] Record: ${recordId}`);
        break;
      }

      case 'plan_upgrade':
      case 'membership_upgrade': {
        console.log(`[Edge Function Tier Resolution] Resolving membership tier for plan_id: "${plan_id}", plan_name: "${plan_name}"`);
        let tierRecord: { id: string; name: string; price: number; currency: string; active: boolean } | null = null;

        if (isValidUUID(plan_id)) {
          console.log(`[Edge Function Tier Resolution] Querying membership_tiers by UUID: ${plan_id}`);
          const { data: tier, error: tErr } = await supabaseAdmin
            .from('membership_tiers')
            .select('id, name, price, currency, active')
            .eq('id', plan_id)
            .maybeSingle();

          if (tErr) {
            console.error('[DB Query Error - membership_tiers by UUID]', tErr);
            return new Response(
              JSON.stringify({
                error: 'Failed to verify membership tier from database',
                details: tErr.message,
                failedOperation: 'membership_tier_resolution',
              }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          tierRecord = tier;
        }

        if (!tierRecord && (plan_id || plan_name)) {
          const searchVal = plan_name || plan_id;
          console.log(`[Edge Function Tier Resolution] Querying membership_tiers by Name: "${searchVal}"`);
          const { data: tier, error: tErr } = await supabaseAdmin
            .from('membership_tiers')
            .select('id, name, price, currency, active')
            .ilike('name', searchVal)
            .maybeSingle();

          if (tErr) {
            console.error('[DB Query Error - membership_tiers by Name]', tErr);
          }
          tierRecord = tier;
        }

        if (!tierRecord) {
          console.warn(`[Membership Upgrade Error] Tier not found: ID="${plan_id}", Name="${plan_name}"`);
          return new Response(
            JSON.stringify({
              error: 'Selected membership tier was not found. Please select a valid membership tier.',
              details: `No tier found matching ID "${plan_id}" or Name "${plan_name}"`,
              failedOperation: 'membership_tier_resolution',
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (tierRecord.active === false) {
          console.warn(`[Membership Upgrade Error] Tier is inactive: "${tierRecord.name}"`);
          return new Response(
            JSON.stringify({
              error: 'Selected membership tier is currently inactive and cannot be requested.',
              details: `Membership tier "${tierRecord.name}" is marked inactive in database`,
              failedOperation: 'membership_tier_resolution',
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Database-authoritative values
        const resolvedPlanId = tierRecord.id;
        const resolvedTierName = tierRecord.name;
        const tierPrice = Number(tierRecord.price) || Number(amount) || 0;
        const tierCurrency = tierRecord.currency || currency || 'USD';
        const isMembership = request_type === 'membership_upgrade';

        console.log(`[Edge Function Tier Resolution Success] Tier ID: ${resolvedPlanId} | Name: ${resolvedTierName} | Price: $${tierPrice} ${tierCurrency}`);

        const subPayload: Record<string, any> = {
          user_id: user.id,
          plan_id: resolvedPlanId,
          status: 'pending',
          notes: notes || `Request to upgrade to ${resolvedTierName} Tier`,
        };

        console.log(`[Edge Function DB Insert - user_subscriptions] Inserting subscription for user_id: ${user.id}, plan_id: ${resolvedPlanId}`);
        const { data: sub, error: subErr } = await supabaseAdmin
          .from('user_subscriptions')
          .insert(subPayload)
          .select()
          .single();

        if (subErr) {
          console.error('[DB Insert Error - user_subscriptions]', subErr);
          return new Response(
            JSON.stringify({
              error: 'Failed to save membership subscription record',
              details: subErr.message,
              failedOperation: 'user_subscriptions_insert',
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        recordId = sub.id;
        console.log(`[DB Insert Success - user_subscriptions] Subscription ID: ${recordId}`);

        transactionType = 'plan';
        const narration = isMembership
          ? `Membership upgrade request — ${resolvedTierName} Tier — $${formatCurrency(tierPrice)} ${tierCurrency}`
          : `Plan upgrade request — ${resolvedTierName} — $${formatCurrency(tierPrice)} ${tierCurrency}`;

        details = {
          requestType,
          requestTypeLabel: isMembership ? 'Membership Upgrade' : 'Plan Upgrade',
          narration,
          amount: tierPrice,
          currency: tierCurrency,
          paymentMethod: 'Account Upgrade',
          paymentOption: 'n/a',
          productName: '',
          productId: '',
          projectName: '',
          projectId: '',
          planName: resolvedTierName,
          planId: resolvedPlanId,
          quantity: 1,
          fullPrice: tierPrice,
          initialPayment: tierPrice,
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

        console.log(`[Edge Function DB Insert - transactions] Type: plan | Record: ${recordId}`);
        const { error: txErr } = await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: transactionType,
          amount: tierPrice,
          currency: tierCurrency,
          status: 'pending',
          reference: recordId,
          description: narration,
        });

        if (txErr) {
          console.error('[DB Insert Error - transactions]', txErr);
          return new Response(
            JSON.stringify({
              error: 'Subscription record was created, but transaction logging failed',
              details: txErr.message,
              failedOperation: 'transactions_insert',
              requestId: recordId,
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`[DB Insert Success - transactions] Transaction Record: ${recordId}`);
        break;
      }

      default:
        return new Response(
          JSON.stringify({
            error: 'Unsupported request type',
            failedOperation: 'validation',
          }),
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
      console.warn('[Brevo Configuration Warning] BREVO_API_KEY environment secret is not set.');
      emailErrorMessage = 'BREVO_API_KEY environment secret is not configured.';
    } else if (!brevoSenderEmail) {
      console.warn('[Brevo Configuration Warning] BREVO_SENDER_EMAIL environment secret is not set.');
      emailErrorMessage = 'BREVO_SENDER_EMAIL environment secret is not configured.';
    } else {
      console.log(`[Brevo Email Dispatch] Sending ${details.requestTypeLabel} notification to admin (${ADMIN_EMAIL}) using sender ${brevoSenderName} <${brevoSenderEmail}>`);

      // Construct Admin Email Content from normalized details
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
            ${details.planId ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Plan / Tier UUID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace;">${details.planId}</td></tr>` : ''}
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

      // Send Admin Email strictly
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
          emailSent = true;
          console.log('[Brevo Admin Email Dispatch Success]');
        } else {
          const errBody = await adminRes.text();
          console.error(`[Brevo Admin Email Error] HTTP ${adminRes.status}: ${errBody}`);
          emailErrorMessage = `Admin email rejected (HTTP ${adminRes.status}): ${errBody}`;
        }
      } catch (err: any) {
        console.error('[Brevo Admin Email Exception]', err);
        emailErrorMessage = `Admin email exception: ${err?.message || String(err)}`;
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
        error: err?.message || 'Unable to submit your request right now. Please try again later.',
        details: String(err),
        failedOperation: 'unhandled_server_exception',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
