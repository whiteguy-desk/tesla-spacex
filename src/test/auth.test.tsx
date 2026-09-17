import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoginPage } from '../components/LoginPage';
import { SignupPage } from '../components/SignupPage';
import { AuthProvider } from '../context/AuthContext';
import { formatAuthError, fetchProfile, updateProfile, signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';
import App from '../App';

vi.mock('../lib/supabase', () => {
  const createMockChain = () => {
    const chain: any = {};
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockResolvedValue({ data: { id: 'user-123', first_name: 'John' }, error: null });
    chain.maybeSingle = vi.fn().mockResolvedValue({ data: { id: 'user-123', first_name: 'John' }, error: null });
    chain.update = vi.fn().mockReturnValue(chain);
    chain.then = (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve);
    return chain;
  };

  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
      },
      from: vi.fn().mockImplementation(() => createMockChain()),
    },
  };
});

describe('Authentication Functions & Helpers', () => {
  it('formats invalid login credentials error correctly', () => {
    const errorMsg = formatAuthError({ message: 'Invalid login credentials' });
    expect(errorMsg).toContain('Invalid email or password');
  });

  it('formats user already registered error correctly', () => {
    const errorMsg = formatAuthError({ message: 'User already registered' });
    expect(errorMsg).toContain('An account with this email address already exists');
  });

  it('formats weak password error correctly', () => {
    const errorMsg = formatAuthError({ message: 'Password should be at least 6 characters' });
    expect(errorMsg).toContain('Password is too weak');
  });

  it('fetches profile successfully from public.profiles table', async () => {
    const profile = await fetchProfile('user-123');
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(profile?.first_name).toBe('John');
  });

  it('updates profile in public.profiles table', async () => {
    const res = await updateProfile('user-123', { first_name: 'Updated' });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(res.data?.first_name).toBe('John');
  });

  it('calls supabase.auth.signOut on signOut()', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);
    const res = await signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(res.error).toBeNull();
  });
});

describe('LoginPage Component Supabase Auth Integration', () => {
  let originalPath: string;

  beforeEach(() => {
    vi.clearAllMocks();
    originalPath = window.location.pathname;
  });

  afterEach(() => {
    window.history.pushState({}, '', originalPath);
  });

  it('submits login form and navigates to /dashboard', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: '123' } as any, session: {} as any },
      error: null,
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'SecretPassword123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'SecretPassword123!',
      });
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  it('displays clean error message when authentication fails', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' } as any,
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeTruthy();
    });
  });
});

describe('SignupPage Component Supabase Auth & Session Flow', () => {
  let originalPath: string;

  beforeEach(() => {
    vi.clearAllMocks();
    originalPath = window.location.pathname;
  });

  afterEach(() => {
    window.history.pushState({}, '', originalPath);
  });

  it('submits signup form with session and redirects to /dashboard (NOT /invest)', async () => {
    const mockSession = { access_token: 'fake-token', user: { id: 'new-user-123' } };
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: 'new-user-123', email: 'jane@example.com' } as any, session: mockSession as any },
      error: null,
    });

    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Gender/i), {
      target: { value: 'female' },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: '1995-05-15' },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: 'United States' },
    });
    fireEvent.change(screen.getByLabelText(/Currency/i), {
      target: { value: 'USD' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '+15551234567' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'SecurePass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'SecurePass123!',
      });
      expect(window.location.pathname).toBe('/dashboard');
      expect(window.location.pathname).not.toBe('/invest');
    });
  });

  it('handles signup without immediate session (email confirmation required) gracefully', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: 'unconfirmed-user-123' } as any, session: null },
      error: null,
    });

    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'unconfirmed@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Alex' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText(/Gender/i), {
      target: { value: 'other' },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: '2000-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: 'Canada' },
    });
    fireEvent.change(screen.getByLabelText(/Currency/i), {
      target: { value: 'CAD' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '+15559876543' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'SecurePass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText(/confirm your account before logging in/i)).toBeTruthy();
      expect(screen.getByText(/Confirm email/i)).toBeTruthy();
    });
  });
});

describe('Dashboard Route Protection & Authentication in App', () => {
  let originalPath: string;

  beforeEach(() => {
    vi.clearAllMocks();
    originalPath = window.location.pathname;
  });

  afterEach(() => {
    window.history.pushState({}, '', originalPath);
  });

  it('protects /dashboard from unauthenticated users', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/invest/login');
    });
  });

  it('recognizes authenticated user on /dashboard', async () => {
    const mockUser = { id: 'auth-user-999', email: 'authenticated@example.com' };
    const mockSession = { user: mockUser, access_token: 'valid-token' };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession as any },
      error: null,
    });

    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText(/Account/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Overview/i).length).toBeGreaterThan(0);
    });
  });
});
