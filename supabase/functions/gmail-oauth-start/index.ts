const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

async function generateSignedState(secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomUUID();
  const message = `${timestamp}.${nonce}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const signatureHex = Array.from(new Uint8Array(signatureBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${message}.${signatureHex}`;
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

    if (!clientId) {
      const htmlError = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Gmail OAuth Setup - Missing Credentials</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #030304; color: #f4f4f6; padding: 40px; }
              .card { max-width: 600px; margin: 0 auto; background: #08080a; border: 1px solid #27272a; border-radius: 12px; padding: 32px; }
              h1 { color: #e82127; margin-top: 0; }
              code { background: #18181b; padding: 4px 8px; border-radius: 4px; color: #f4f4f6; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>Configuration Required</h1>
              <p>The <code>GOOGLE_CLIENT_ID</code> secret is not set on this Supabase Edge Function.</p>
              <p>Please set the required secrets in Supabase Secrets management before running the OAuth flow:</p>
              <ul>
                <li><code>GOOGLE_CLIENT_ID</code></li>
                <li><code>GOOGLE_CLIENT_SECRET</code></li>
              </ul>
              <p>Redirect URI configured in Google Cloud Console must be:</p>
              <p><code>${callbackUrl}</code></p>
            </div>
          </body>
        </html>
      `;
      return new Response(htmlError, {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const state = await generateSignedState(stateSecret);

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', callbackUrl);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.send');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');
    googleAuthUrl.searchParams.set('login_hint', 'yoonfang120@gmail.com');
    googleAuthUrl.searchParams.set('state', state);

    const reqUrl = new URL(req.url);
    const mode = reqUrl.searchParams.get('mode') || 'redirect';

    if (mode === 'json') {
      return new Response(
        JSON.stringify({
          authorizationUrl: googleAuthUrl.toString(),
          redirectUri: callbackUrl,
          scope: 'https://www.googleapis.com/auth/gmail.send',
          senderEmail: 'yoonfang120@gmail.com',
          adminRecipient: 'elonmusk2580800@gmail.com',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return Response.redirect(googleAuthUrl.toString(), 302);
  } catch (err: any) {
    console.error('[gmail-oauth-start error]', err);
    return new Response(
      JSON.stringify({
        error: err?.message || 'Failed to initiate Gmail OAuth authorization',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
