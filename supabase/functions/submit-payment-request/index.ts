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
    let recordId = ref;
    let detailSummary = '';

    // Step 1: Database persistence comes first
    switch (request_type) {
      case 'deposit': {
        const { data: deposit, error: depErr } = await supabaseAdmin
          .from('deposits')
          .insert({
            user_id: user.id,
            amount,
            currency,
            payment_method: payment_method || 'Standard Deposit',
            notes,
            status: 'pending',
            reference_id: ref,
          })
          .select()
          .single();

        if (depErr) throw depErr;
        recordId = deposit.id;
        detailSummary = `Amount: $${Number(amount).toLocaleString()} ${currency}`;

        await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: 'deposit',
          amount,
          currency,
          status: 'pending',
          reference: ref,
          description: `Deposit request initiated (${ref})`,
        });
        break;
      }

      case 'withdrawal':
      case 'cash_out': {
        const { data: wth, error: wthErr } = await supabaseAdmin
          .from('withdrawals')
          .insert({
            user_id: user.id,
            amount,
            currency,
            asset_name: asset_name || vehicle_name || 'Account Balance',
            notes,
            status: 'pending',
            reference_id: ref,
          })
          .select()
          .single();

        if (wthErr) throw wthErr;
        recordId = wth.id;
        detailSummary = `Amount: $${Number(amount).toLocaleString()} ${currency} (${asset_name || vehicle_name || 'Account Balance'})`;

        await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: 'withdrawal',
          amount,
          currency,
          status: 'pending',
          reference: ref,
          description: `${request_type === 'cash_out' ? 'Vehicle cash-out' : 'Withdrawal'} request (${ref})`,
        });
        break;
      }

      case 'vehicle_purchase': {
        const { data: order, error: ordErr } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: user.id,
            vehicle_id,
            vehicle_name: vehicle_name || 'Tesla Vehicle',
            quantity,
            full_price: full_price || amount,
            part_payment_amount: part_payment_amount || 5000,
            status: 'pending',
            contact_status: 'awaiting_contact',
            customer_name: userFullName,
            customer_email: userEmail,
            notes,
          })
          .select()
          .single();

        if (ordErr) throw ordErr;
        recordId = order.id;
        detailSummary = `Vehicle: ${vehicle_name || 'Tesla Vehicle'} (Part Payment: $${Number(part_payment_amount || 5000).toLocaleString()})`;

        await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: 'order',
          amount: part_payment_amount || 5000,
          currency,
          status: 'pending',
          reference: recordId,
          description: `Vehicle order for ${quantity}x ${vehicle_name || 'Tesla Vehicle'}`,
        });
        break;
      }

      case 'investment': {
        const { data: inv, error: invErr } = await supabaseAdmin
          .from('investments')
          .insert({
            user_id: user.id,
            project_id,
            project_name: project_name || 'Investment Opportunity',
            amount,
            currency,
            notes,
            status: 'pending',
          })
          .select()
          .single();

        if (invErr) throw invErr;
        recordId = inv.id;
        detailSummary = `Project: ${project_name || 'Investment Project'} - Amount: $${Number(amount).toLocaleString()}`;

        await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: 'investment',
          amount,
          currency,
          status: 'pending',
          reference: recordId,
          description: `Investment request for ${project_name || 'Project'}`,
        });
        break;
      }

      case 'plan_upgrade':
      case 'membership_upgrade': {
        const { data: sub, error: subErr } = await supabaseAdmin
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: plan_id || 'tier-request',
            status: 'pending',
            notes: notes || `Request to upgrade to ${plan_name || 'Membership Tier'}`,
          })
          .select()
          .single();

        if (subErr) throw subErr;
        recordId = sub.id;
        detailSummary = `Selected Tier/Plan: ${plan_name || plan_id || 'Membership'} ($${Number(amount).toLocaleString()})`;

        await supabaseAdmin.from('transactions').insert({
          user_id: user.id,
          type: 'plan',
          amount,
          currency,
          status: 'pending',
          reference: recordId,
          description: `Subscription upgrade request for ${plan_name || 'Tier'}`,
        });
        break;
      }
    }

    // Step 2: Transactional email delivery via Brevo Transactional Email API
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const brevoSenderEmail = Deno.env.get('BREVO_SENDER_EMAIL') || ADMIN_EMAIL;
    const brevoSenderName = Deno.env.get('BREVO_SENDER_NAME') || 'Tesla & Spacex';

    let emailSent = false;
    let emailErrorMessage = null;

    if (brevoApiKey) {
      try {
        const requestTypeLabel = request_type.replace(/_/g, ' ').toUpperCase();
        const requestDate = new Date().toISOString();

        // 1. Admin Email Content
        const adminEmailContent = `
          <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e82127;">New ${requestTypeLabel} Request — Tesla & Spacex</h2>
            <p>A new payment/service request has been submitted by an authenticated user and stored in database.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Request Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${request_type}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Record ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${recordId}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Reference ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${ref}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>User Full Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${userFullName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>User Registered Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${userEmail}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>User ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${user.id}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Amount / Currency:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">$${Number(amount).toLocaleString()} ${currency}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Details:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${detailSummary}</td></tr>
              ${payment_method ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Payment Method:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${payment_method}</td></tr>` : ''}
              ${notes ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Notes / Reason:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${notes}</td></tr>` : ''}
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Request Timestamp:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${requestDate}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Status:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee; color: #d97706; font-weight: bold;">pending</td></tr>
            </table>
          </div>
        `;

        // 2. User Confirmation Email Content
        const userEmailContent = `
          <div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <h2 style="color: #111; border-bottom: 2px solid #e82127; padding-bottom: 8px;">Tesla & Spacex — Request Confirmation</h2>
            <p>Dear ${userFullName},</p>
            <p>Your request for <strong>${requestTypeLabel}</strong> has been received and registered under status <strong>PENDING REVIEW</strong>.</p>

            <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #e82127; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Reference ID:</strong> ${ref}</p>
              <p style="margin: 0 0 8px 0;"><strong>Request ID:</strong> ${recordId}</p>
              <p style="margin: 0;"><strong>Summary:</strong> ${detailSummary}</p>
            </div>

            <p><strong>Next Steps:</strong> Our team will review your request and reach out directly to your registered email address (<strong>${userEmail}</strong>) with instructions and details.</p>
            <p style="font-size: 13px; color: #666;">Note: Submitting a request registers your interest in our system for review. No automated charge or completion is implied at this step.</p>

            <p style="margin-top: 24px;">Sincerely,<br/><strong>Tesla & Spacex Platform Team</strong></p>
          </div>
        `;

        // Send Admin Notification via Brevo API
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
            subject: `New ${requestTypeLabel} Request — Tesla & Spacex (${ref})`,
            htmlContent: adminEmailContent,
          }),
        });

        // Send User Confirmation via Brevo API
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
            subject: `Your Tesla & Spacex Request Has Been Received (#${ref.slice(0, 10)})`,
            htmlContent: userEmailContent,
          }),
        });

        if (adminRes.ok && userRes.ok) {
          emailSent = true;
        } else {
          const adminErrText = adminRes.ok ? '' : await adminRes.text();
          const userErrText = userRes.ok ? '' : await userRes.text();
          emailErrorMessage = `Brevo API response warning: ${adminErrText || userErrText}`;
          console.warn('Brevo email delivery warning:', emailErrorMessage);
        }
      } catch (err: any) {
        console.error('Error delivering email via Brevo:', err);
        emailErrorMessage = err?.message || 'Brevo email sending failed';
      }
    } else {
      console.warn('BREVO_API_KEY environment secret is not configured.');
      emailErrorMessage = 'BREVO_API_KEY secret missing';
    }

    return new Response(
      JSON.stringify({
        success: true,
        requestId: recordId,
        referenceId: ref,
        status: 'pending',
        emailSent,
        emailErrorMessage,
        message: emailSent
          ? 'Your request has been submitted successfully. Our team will contact you via your registered email address.'
          : 'Your request was received and is pending review. We could not send the notification email right now, but your request has been saved.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Unhandled request error:', err);
    return new Response(
      JSON.stringify({
        error: 'Unable to submit your request right now. Please try again later.',
        details: err?.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
