import { supabase } from './supabase';

export interface Profile {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  country?: string | null;
  currency?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  country: string;
  currency: string;
  phone: string;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ data: Profile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error: error ? new Error(error.message) : null };
}

export async function signOut(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signOut();
  return { error: error ? new Error(error.message) : null };
}

export function formatAuthError(error: unknown): string {
  if (!error) return 'An unexpected error occurred.';
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? (error as { message: string }).message
    : String(error);

  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (lower.includes('user already registered') || lower.includes('email already in use') || lower.includes('already exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (lower.includes('password should be at least') || lower.includes('weak password')) {
    return 'Password is too weak. Please use at least 8 characters.';
  }
  if (lower.includes('email not confirmed') || lower.includes('confirm your email')) {
    return 'Please confirm your email address before signing in.';
  }
  if (lower.includes('failed to fetch') || lower.includes('network error')) {
    return 'Unable to connect to the authentication server. Please check your internet connection.';
  }

  return message;
}
