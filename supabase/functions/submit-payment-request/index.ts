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

    const ref = reference_id || `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    let recordId = ref;
    let detailSummary = '';

    // Insert into appropriate table based on request_type
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
        detailSummary = `Amount: $${amount.toLocaleString()} ${currency}`;

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
        detailSummary = `Amount: $${amount.toLocaleString()} ${currency} (${asset_name || vehicle_name || 'Account Balance'})`;

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
        detailSummary = `Vehicle: ${vehicle_name || 'Tesla Vehicle'} (Part Payment: $${part_payment_amount.toLocaleString()})`;

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
        detailSummary = `Project: ${project_name || 'Investment Project'} - Amount: $${amount.toLocaleString()}`;

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
        detailSummary = `Selected Tier/Plan: ${plan_name || plan_id || 'Membership'} ($${amount.toLocaleString()})`;

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

    // EMAIL NOTIFICATION DELIVERY VIA RESEND
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let emailSent = false;
    let emailErrorMessage = null;

    if (resendApiKey) {
      try {
        const requestTypeLabel = request_type.replace('_', ' ').toUpperCase();
        const requestDate = new Date().toISOString();

        // 1. Admin Email
        const adminEmailContent = `
          <h2>New ${requestTypeLabel} Request — Tesla & Spacex</h2>
          <p>A new request has been submitted by an authenticated user.</p>
          <ul>
            <li><strong>Request Type:</strong> ${request_type}</li>
            <li><strong>Request ID / Reference:</strong> ${recordId}</li>
            <li><strong>User Full Name:</strong> ${userFullName}</li>
            <li><strong>User Email:</strong> ${userEmail}</li>
            <li><strong>User ID:</strong> ${user.id}</li>
            <li><strong>Amount / Currency:</strong> $${amount.toLocaleString()} ${currency}</li>
            <li><strong>Details:</strong> ${detailSummary}</li>
            ${payment_method ? `<li><strong>Payment Method:</strong> ${payment_method}</li>` : ''}
            ${notes ? `<li><strong>Notes / Reason:</strong> ${notes}</li>` : ''}
            <li><strong>Request Date:</strong> ${requestDate}</li>
            <li><strong>Current Status:</strong> pending</li>
          </ul>
        `;

        const adminRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Tesla & Spacex <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `New ${requestTypeLabel} Request — Tesla & Spacex (${recordId})`,
            html: adminEmailContent,
          }),
        });

        // 2. User Confirmation Email
        const userEmailContent = `
          <h2>Your Tesla & Spacex Request Has Been Received</h2>
          <p>Hello ${userFullName},</p>
          <p>Your <strong>${requestTypeLabel}</strong> request has been received and is currently pending review.</p>
          <p><strong>Reference ID:</strong> ${recordId}</p>
          <p><strong>Request Summary:</strong> ${detailSummary}</p>
          <p>Our team will review your request and contact you directly through your registered email address (<strong>${userEmail}</strong>) with settlement details and next steps.</p>
          <br/>
          <p>Thank you for choosing Tesla & Spacex.</p>
        `;

        const userRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Tesla & Spacex <onboarding@resend.dev>',
            to: [userEmail],
            subject: `Your Tesla & Spacex Request Has Been Received (#${recordId.slice(0, 8)})`,
            html: userEmailContent,
          }),
        });

        if (adminRes.ok && userRes.ok) {
          emailSent = true;
        } else {
          emailErrorMessage = 'Email provider returned an error response.';
        }
      } catch (err: any) {
        console.error('Error sending email notification:', err);
        emailErrorMessage = err?.message || 'Email sending failed';
      }
    } else {
      console.warn('RESEND_API_KEY environment variable is not configured.');
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
          : 'Your request was saved successfully, but we could not send the notification email right now. Please try again shortly.',
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
