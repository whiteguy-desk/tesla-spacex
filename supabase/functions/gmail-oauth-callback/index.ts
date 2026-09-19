const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function verifySignedState(state: string, secret: string): Promise<boolean> {
  if (!state || typeof state !== 'string') return false;
  const parts = state.split('.');
  if (parts.length !== 3) return false;

  const [timestampStr, nonce, signatureHex] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Max age: 30 minutes
  const maxAgeMs = 30 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) {
    console.warn('[gmail-oauth-callback] CSRF state expired');
    return false;
  }

  const message = `${timestampStr}.${nonce}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const expectedHex = Array.from(new Uint8Array(signatureBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return expectedHex === signatureHex;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://pbzakxkxprwknapmygqx.supabase.co';
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const stateSecret = Deno.env.get('GMAIL_OAUTH_STATE_SECRET') || clientSecret || 'default-gmail-state-secret-2026';

    const callbackUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/gmail-oauth-callback`;

    const reqUrl = new URL(req.url);
    const code = reqUrl.searchParams.get('code');
    const state = reqUrl.searchParams.get('state');
    const oauthError = reqUrl.searchParams.get('error');

    if (oauthError) {
      console.warn(`[gmail-oauth-callback] OAuth error from Google: ${oauthError}`);
      const htmlError = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Gmail OAuth Failed</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #030304; color: #f4f4f6; padding: 40px; }
              .card { max-width: 600px; margin: 0 auto; background: #08080a; border: 1px solid #e82127; border-radius: 12px; padding: 32px; }
              h1 { color: #e82127; margin-top: 0; }
              code { background: #18181b; padding: 4px 8px; border-radius: 4px; color: #f4f4f6; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Authorization Denied or Failed</h1>
              <p>Google returned an authorization error:</p>
              <p><code>${oauthError}</code></p>
              <p>Please try initiating the authorization flow again from <a href="${supabaseUrl}/functions/v1/gmail-oauth-start" style="color:#e82127">gmail-oauth-start</a>.</p>
            </div>
          </body>
        </html>
      `;
      return new Response(htmlError, {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (!code || !state) {
      console.warn('[gmail-oauth-callback] Missing code or state parameter');
      const htmlError = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Gmail OAuth - Missing Request Code</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #030304; color: #f4f4f6; padding: 40px; }
              .card { max-width: 600px; margin: 0 auto; background: #08080a; border: 1px solid #27272a; border-radius: 12px; padding: 32px; }
              h1 { color: #e82127; margin-top: 0; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Invalid OAuth Callback</h1>
              <p>This endpoint receives authorization callbacks from Google OAuth.</p>
              <p>To begin authorization, navigate to <a href="${supabaseUrl}/functions/v1/gmail-oauth-start" style="color:#e82127">/functions/v1/gmail-oauth-start</a>.</p>
            </div>
          </body>
        </html>
      `;
      return new Response(htmlError, {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const isStateValid = await verifySignedState(state, stateSecret);
    if (!isStateValid) {
      console.warn('[gmail-oauth-callback] State verification failed (possible CSRF)');
      const htmlError = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Gmail OAuth - CSRF State Mismatch</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #030304; color: #f4f4f6; padding: 40px; }
              .card { max-width: 600px; margin: 0 auto; background: #08080a; border: 1px solid #e82127; border-radius: 12px; padding: 32px; }
              h1 { color: #e82127; margin-top: 0; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Security Verification Failed</h1>
              <p>The state parameter provided does not match or has expired (CSRF protection).</p>
              <p>Please restart the authorization process at <a href="${supabaseUrl}/functions/v1/gmail-oauth-start" style="color:#e82127">gmail-oauth-start</a>.</p>
            </div>
          </body>
        </html>
      `;
      return new Response(htmlError, {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (!clientId || !clientSecret) {
      console.error('[gmail-oauth-callback] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
      const htmlError = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Gmail OAuth Setup - Missing Server Secrets</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #030304; color: #f4f4f6; padding: 40px; }
              .card { max-width: 600px; margin: 0 auto; background: #08080a; border: 1px solid #e82127; border-radius: 12px; padding: 32px; }
              h1 { color: #e82127; margin-top: 0; }
              code { background: #18181b; padding: 4px 8px; border-radius: 4px; color: #f4f4f6; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Missing OAuth Credentials</h1>
              <p>The server credentials <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> must be set in Supabase Edge Function secrets to exchange the code for tokens.</p>
            </div>
          </body>
        </html>
      `;
      return new Response(htmlError, {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    console.log('[gmail-oauth-callback] Exchanging code for tokens with Google...');
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error(`[gmail-oauth-callback token error] HTTP ${tokenRes.status}: ${errText}`);
      const htmlError = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Gmail OAuth - Token Exchange Failed</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #030304; color: #f4f4f6; padding: 40px; }
              .card { max-width: 600px; margin: 0 auto; background: #08080a; border: 1px solid #e82127; border-radius: 12px; padding: 32px; }
              h1 { color: #e82127; margin-top: 0; }
              code { background: #18181b; padding: 4px 8px; border-radius: 4px; color: #f4f4f6; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Token Exchange Failed</h1>
              <p>Google token endpoint returned an error (HTTP ${tokenRes.status}).</p>
              <p>Details: <code>${errText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></p>
              <p>Please check client secrets and ensure redirect URI matches exactly: <code>${callbackUrl}</code></p>
            </div>
          </body>
        </html>
      `;
      return new Response(htmlError, {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const tokenData = await tokenRes.json();
    const refreshToken = tokenData.refresh_token || null;
    const scopeGranted = tokenData.scope || '';

    console.log(`[gmail-oauth-callback success] refreshToken present: ${Boolean(refreshToken)} | Scope: ${scopeGranted}`);

    const htmlSuccess = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Gmail One-Time Setup - Authorized</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #030304; color: #f4f4f6; padding: 40px; line-height: 1.6; }
            .card { max-width: 680px; margin: 0 auto; background: #08080a; border: 1px solid #27272a; border-radius: 12px; padding: 32px; }
            h1 { color: #10b981; margin-top: 0; font-size: 24px; }
            .badge { display: inline-block; background: #064e3b; color: #34d399; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
            .token-box { background: #18181b; border: 1px solid #3f3f46; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; word-break: break-all; margin: 16px 0; color: #fbbf24; }
            .steps { background: #111115; border-left: 4px solid #e82127; padding: 16px; border-radius: 4px; margin-top: 24px; }
            .steps ol { margin: 8px 0 0 20px; padding: 0; }
            .steps li { margin-bottom: 8px; }
            code { background: #18181b; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #f4f4f6; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">Authorization Successful</span>
            <h1>Gmail OAuth Setup Complete</h1>
            <p>One-time OAuth authorization for sender account <strong>yoonfang120@gmail.com</strong> was granted with narrow scope <code>https://www.googleapis.com/auth/gmail.send</code>.</p>

            ${
              refreshToken
                ? `
                <p><strong>Your Gmail OAuth Refresh Token:</strong></p>
                <div class="token-box">${refreshToken}</div>
                <div class="steps">
                  <p style="margin-top:0; font-weight:bold; color:#e82127;">Next Mandatory Step:</p>
                  <p>Store this refresh token as a Supabase Edge Function secret using the CLI command:</p>
                  <code>supabase secrets set GMAIL_REFRESH_TOKEN="${refreshToken}" --project-ref pbzakxkxprwknapmygqx</code>
                </div>
              `
                : `
                <p style="color:#fbbf24;"><strong>Notice:</strong> Google did not return a new refresh token for this request. This happens if yoonfang120@gmail.com was previously authorized without prompt=consent.</p>
                <p>To force Google to issue a new refresh token, visit <a href="${supabaseUrl}/functions/v1/gmail-oauth-start" style="color:#e82127">gmail-oauth-start</a> again.</p>
              `
            }

            <p style="margin-top:24px; font-size:13px; color:#a1a1aa;">
              Security Note: Do not share or publish this refresh token in source code or client-side storage.
            </p>
          </div>
        </body>
      </html>
    `;

    return new Response(htmlSuccess, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[gmail-oauth-callback unhandled error]', err);
    return new Response(
      JSON.stringify({
        error: err?.message || 'Failed to complete OAuth callback',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
