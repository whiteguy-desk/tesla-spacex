import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvestPage } from '../components/InvestPage';
import { AuthProvider } from '../context/AuthContext';
import { DEFAULT_PROJECTS } from '../lib/projects';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: DEFAULT_PROJECTS, error: null }),
      }),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

describe('Public /invest Experience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders publicly with open opportunities and portal header', async () => {
    render(
      <AuthProvider>
        <InvestPage />
      </AuthProvider>
    );

    // Verify header & hero text
    expect(screen.getByText(/Capital & Venture Direct Portal/i)).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: /Explore The Future/i })).toBeTruthy();

    // Verify opportunities render
    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
      expect(screen.getByText('Megapack Utility Storage Grid Initiative')).toBeTruthy();
    });
  });

  it('renders invest page project cards and action buttons', async () => {
    render(
      <AuthProvider>
        <InvestPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
      expect(screen.getAllByRole('button', { name: /Request Order Allocation/i }).length).toBeGreaterThan(0);
    });
  });
});
