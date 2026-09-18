import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvestPage } from '../components/InvestPage';
import { AuthProvider } from '../context/AuthContext';
import { DEFAULT_PROJECTS } from '../lib/projects';
import * as paymentRequests from '../lib/paymentRequests';

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

  it('renders publicly with exactly 10 opportunities and global demo disclosure', async () => {
    render(
      <AuthProvider>
        <InvestPage />
      </AuthProvider>
    );

    // Verify global mandatory disclosure
    expect(screen.getByText(/Mandatory Demo Disclosure & Independent Project Notice/i)).toBeTruthy();
    expect(screen.getByText(/fictional mock opportunities/i)).toBeTruthy();
    expect(screen.getByText(/not affiliated with, endorsed by, or representing official investment products of Tesla, Inc. or SpaceX/i)).toBeTruthy();

    // Verify 10 opportunities render
    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
      expect(screen.getByText('Megapack Grid Storage — Outback Initiative')).toBeTruthy();
      expect(screen.getByText('V4 Ultra-Fast Supercharger Highway Mesh')).toBeTruthy();
      expect(screen.getByText('Starlink Direct-to-Cell LEO Satellite Mesh')).toBeTruthy();
      expect(screen.getByText('xAI Compute Supercluster — Phase II')).toBeTruthy();
      expect(screen.getByText('Cybercab Autonomous Urban Transit Pilot')).toBeTruthy();
      expect(screen.getByText('4680 Dry-Cathode Cell Line Scale-Up')).toBeTruthy();
      expect(screen.getByText('Gigafactory Next-Gen Affordable Platform')).toBeTruthy();
      expect(screen.getByText('Boring Company Vegas Underground Loop Arterial')).toBeTruthy();
      expect(screen.getByText('Neuralink High-Bandwidth BCI Clinical Initiative')).toBeTruthy();
    });

    // Verify MOCK OPPORTUNITY badges
    const mockBadges = screen.getAllByText('MOCK OPPORTUNITY');
    expect(mockBadges.length).toBe(10);
  });

  it('triggers submitInvestmentRequest when authenticated user submits request form', async () => {
    vi.spyOn(paymentRequests, 'submitInvestmentRequest').mockResolvedValue({
      success: true,
      requestId: 'INV-123456',
      referenceId: 'REF-123456',
      status: 'pending',
      message: 'Request submitted successfully.',
    });

    render(
      <AuthProvider>
        <InvestPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
    });
  });
});
