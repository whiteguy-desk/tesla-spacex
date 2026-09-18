import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  submitDepositRequest,
  submitWithdrawalRequest,
  submitPlanUpgradeRequest,
  submitMembershipUpgradeRequest,
  submitVehiclePurchaseRequest,
  submitInvestmentRequest,
  submitVehicleCashOutRequest,
} from '../lib/paymentRequests';
import { DepositPage } from '../components/dashboard/DepositPage';
import { WithdrawalPage } from '../components/dashboard/WithdrawalPage';

// Mock Supabase client
const mockInsert = vi.fn().mockReturnThis();
const mockSelect = vi.fn().mockReturnThis();
const mockSingle = vi.fn().mockResolvedValue({
  data: { id: 'test-req-id-123' },
  error: null,
});

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-user-id', email: 'registered@tesla.com' },
          },
        },
      }),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: {
          success: true,
          requestId: 'test-req-id-123',
          referenceId: 'REQ-123456',
          status: 'pending',
          message: 'Your request has been submitted successfully.',
        },
        error: null,
      }),
    },
    from: vi.fn().mockImplementation(() => ({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    })),
  },
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'registered@tesla.com' },
    profile: { first_name: 'Elon', last_name: 'Musk' },
    loading: false,
  }),
}));

vi.mock('../lib/dashboard', () => ({
  fetchUserDashboardData: vi.fn().mockResolvedValue({
    totalBalance: 50000,
    orders: [],
    deposits: [],
    withdrawals: [],
    transactions: [],
  }),
}));

describe('Centralized Payment Request System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits deposit request via paymentRequests service', async () => {
    const result = await submitDepositRequest({
      amount: 2500,
      currency: 'USD',
      paymentMethod: 'Bank Wire',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
    expect(result.referenceId).toBeTruthy();
  });

  it('submits withdrawal request via paymentRequests service', async () => {
    const result = await submitWithdrawalRequest({
      amount: 1000,
      currency: 'USD',
      assetName: 'Account Available Balance',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
  });

  it('submits plan upgrade request via paymentRequests service', async () => {
    const result = await submitPlanUpgradeRequest({
      planId: 'growth-ai',
      planName: 'Growth AI',
      price: 10000,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
  });

  it('submits membership upgrade request via paymentRequests service', async () => {
    const result = await submitMembershipUpgradeRequest({
      tierId: 'platinum',
      tierName: 'Platinum',
      price: 10000,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
  });

  it('submits vehicle purchase request via paymentRequests service', async () => {
    const result = await submitVehiclePurchaseRequest({
      vehicleId: 'cybertruck',
      vehicleName: 'Cybertruck',
      fullPrice: 49999,
      partPaymentAmount: 5000,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
  });

  it('submits investment request via paymentRequests service', async () => {
    const result = await submitInvestmentRequest({
      projectId: 'spacex-space-city-fund',
      projectName: 'SpaceX Space City Fund',
      amount: 5000,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
  });

  it('submits vehicle cash-out request via paymentRequests service', async () => {
    const result = await submitVehicleCashOutRequest({
      vehicleName: 'Model S Plaid',
      amount: 50000,
      reason: 'Selling back reserved slot',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
  });

  it('renders DepositPage form and shows in-app success state on submission without Telegram redirect', async () => {
    render(<DepositPage />);

    // Wait for initial balance to load
    await waitFor(() => {
      expect(screen.getByText('$50,000.00')).toBeTruthy();
    });

    const submitBtn = screen.getByRole('button', { name: /Submit Deposit Request/i });
    expect(submitBtn).toBeTruthy();

    const form = submitBtn.closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Request Received/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/registered@tesla.com/i).length).toBeGreaterThan(0);
      expect(screen.queryByText(/telegram/i)).toBeNull();
    });
  });

  it('renders WithdrawalPage form and shows in-app success state on submission', async () => {
    render(<WithdrawalPage />);

    // Wait for balance to load
    await waitFor(() => {
      expect(screen.getByText('$50,000.00')).toBeTruthy();
    });

    const submitBtn = screen.getByRole('button', { name: /Submit Withdrawal Request/i });
    expect(submitBtn).toBeTruthy();

    const form = submitBtn.closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Withdrawal Request Received/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/registered@tesla.com/i).length).toBeGreaterThan(0);
      expect(screen.queryByText(/telegram/i)).toBeNull();
    });
  });
});
