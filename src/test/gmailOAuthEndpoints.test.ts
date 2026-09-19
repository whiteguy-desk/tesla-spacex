import { describe, it, expect } from 'vitest';

describe('Gmail OAuth Edge Functions Structure & Verification', () => {
  it('verifies gmail-oauth-start function requirements', async () => {
    // Dynamically import or verify requirements
    const fs = await import('node:fs');
    const path = await import('node:path');
    const startFnPath = path.resolve(process.cwd(), 'supabase/functions/gmail-oauth-start/index.ts');

    expect(fs.existsSync(startFnPath)).toBe(true);
    const content = fs.readFileSync(startFnPath, 'utf8');

    expect(content).toContain('https://www.googleapis.com/auth/gmail.send');
    expect(content).toContain('yoonfang120@gmail.com');
    expect(content).toContain('access_type');
    expect(content).toContain('offline');
    expect(content).toContain('prompt');
    expect(content).toContain('consent');
    expect(content).toContain('gmail-oauth-callback');
    expect(content).not.toContain('https://mail.google.com/');
    expect(content).not.toContain('gmail.readonly');
    expect(content).not.toContain('gmail.modify');
  });

  it('verifies gmail-oauth-callback function requirements', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const callbackFnPath = path.resolve(process.cwd(), 'supabase/functions/gmail-oauth-callback/index.ts');

    expect(fs.existsSync(callbackFnPath)).toBe(true);
    const content = fs.readFileSync(callbackFnPath, 'utf8');

    expect(content).toContain('verifySignedState');
    expect(content).toContain('oauth2.googleapis.com/token');
    expect(content).toContain('authorization_code');
    expect(content).toContain('refresh_token');
    expect(content).toContain('pbzakxkxprwknapmygqx');
    expect(content).toContain('GMAIL_REFRESH_TOKEN');
  });
});
