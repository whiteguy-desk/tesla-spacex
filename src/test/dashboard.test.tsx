import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { DashboardOverview } from '../components/dashboard/DashboardOverview';

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn(),
  },
}));

// Mock auth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@tesla.com' },
    profile: { first_name: 'Elon', last_name: 'Musk', membership_tier: 'Gold' },
    loading: false,
    signOut: vi.fn(),
  }),
}));

// Mock dashboard data module
vi.mock('../lib/dashboard', () => ({
  fetchUserDashboardData: vi.fn().mockResolvedValue({
    profile: { first_name: 'Elon', last_name: 'Musk', membership_tier: 'Gold' },
    totalBalance: 250000,
    totalProfit: 450000,
    totalInvested: 150000,
    activePlanId: 'Gold Tier',
    investments: [
      { id: '1', user_id: 'test-user-id', project_id: 'p1', project_name: 'Starlink Orbital Constellation', amount: 100000, currency: 'USD', status: 'Active', created_at: '2025-02-01' },
    ],
    deposits: [],
    withdrawals: [],
    orders: [
      { id: 'v1', user_id: 'test-user-id', vehicle_id: 'v1', vehicle_name: 'Tesla Cybertruck Cyberbeast', quantity: 1, full_price: 99990, part_payment_amount: 5000, status: 'Confirmed', contact_status: 'contacted', created_at: '2025-02-01' },
    ],
    transactions: [
      { id: 't1', user_id: 'test-user-id', type: 'deposit', amount: 50000, currency: 'USD', status: 'completed', reference: 'DEP-123', description: 'Wire Transfer Settlement', created_at: '2025-02-01' },
    ],
  }),
  createDepositRequest: vi.fn(),
  createWithdrawalRequest: vi.fn(),
  createVehicleOrder: vi.fn(),
  subscribeToPlan: vi.fn(),
}));

describe('Dashboard Layout & Components', () => {
  it('renders DashboardLayout with Tesla & Spacex branding and navigation links', () => {
    render(
      <DashboardLayout currentTab="overview">
        <div>Test Page Content</div>
      </DashboardLayout>
    );

    expect(screen.getAllByText('Elon Musk').length).toBeGreaterThan(0);
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Deposit')).toBeTruthy();
    expect(screen.getByText('Withdrawal')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('renders mobile navigation toggle and drawer', () => {
    render(
      <DashboardLayout currentTab="overview">
        <div>Test Page Content</div>
      </DashboardLayout>
    );

    const toggleBtns = screen.getAllByRole('button');
    expect(toggleBtns.length).toBeGreaterThan(0);
    fireEvent.click(toggleBtns[0]);
  });

  it('renders DashboardOverview metric cards with synced data', async () => {
    render(<DashboardOverview />);

    await waitFor(() => {
      expect(screen.getByText('$250,000.00')).toBeTruthy();
      expect(screen.getByText('+$450,000.00')).toBeTruthy();
      expect(screen.getByText('$150,000.00')).toBeTruthy();
      expect(screen.getByText('GOLD TIER')).toBeTruthy();
    });
  });

  it('renders Vehicle Orders & Sector Exposure section', async () => {
    render(<DashboardOverview />);

    await waitFor(() => {
      expect(screen.getByText('Vehicle Orders')).toBeTruthy();
      expect(screen.getByText('Tesla Cybertruck Cyberbeast')).toBeTruthy();
      expect(screen.getByText('Deposit Funds')).toBeTruthy();
      expect(screen.getByText('Request Withdrawal')).toBeTruthy();
    });
  });

  it('renders Recent Activity table with mocked transaction data', async () => {
    render(<DashboardOverview />);

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeTruthy();
      expect(screen.getByText('Wire Transfer Settlement')).toBeTruthy();
      expect(screen.getByText('deposit')).toBeTruthy();
    });
  });
});
