import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from '../components/LoginPage';
import { SignupPage } from '../components/SignupPage';
import { formatAuthError, fetchProfile, updateProfile, signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => {
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
      from: vi.fn(),
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
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'user-123', email: 'test@example.com', first_name: 'John' },
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ maybeSingle: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

    const profile = await fetchProfile('user-123');
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(profile?.first_name).toBe('John');
  });

  it('updates profile in public.profiles table', async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'user-123', first_name: 'Updated' },
      error: null,
    });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    vi.mocked(supabase.from).mockReturnValue({ update: mockUpdate } as any);

    const res = await updateProfile('user-123', { first_name: 'Updated' });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(res.data?.first_name).toBe('Updated');
  });

  it('calls supabase.auth.signOut on signOut()', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);
    const res = await signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(res.error).toBeNull();
  });
});

describe('LoginPage Component Supabase Auth Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits login form and calls supabase.auth.signInWithPassword', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: '123' } as any, session: {} as any },
      error: null,
    });

    render(<LoginPage />);

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
    });
  });

  it('displays clean error message when authentication fails', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' } as any,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid email or password/i)
      ).toBeTruthy();
    });
  });
});

describe('SignupPage Component Supabase Auth & Profile Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits signup form, calls signUp, and updates public.profiles record', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: 'new-user-123', email: 'new@example.com' } as any, session: null },
      error: null,
    });

    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: 'new-user-123', first_name: 'Jane' },
      error: null,
    });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    vi.mocked(supabase.from).mockReturnValue({ update: mockUpdate } as any);

    render(<SignupPage />);

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
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(screen.getByRole('heading', { level: 2, name: 'Account Created' })).toBeTruthy();
    });
  });
});
