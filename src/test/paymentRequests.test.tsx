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
import { MembershipPage } from '../components/dashboard/MembershipPage';
import { supabase } from '../lib/supabase';

// Mock Supabase client
const mockInsert = vi.fn().mockReturnThis();
const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockOrder = vi.fn().mockResolvedValue({
  data: [
    {
      id: '39210b44-7892-4c62-b15a-d5f429e83bbf',
      name: 'Silver',
      price: 2000,
      currency: 'USD',
      description: 'Entry tier membership.',
      benefits: ['Priority Support'],
      features: ['$2,000 Entry Level'],
      display_order: 1,
      active: true,
    },
    {
      id: '0b26ab31-f64d-4e6b-8b1f-01e98f30f9f3',
      name: 'Gold',
      price: 5000,
      currency: 'USD',
      description: 'Elevated membership tier.',
      benefits: ['24/7 Priority Support'],
      features: ['$5,000 Entry Level'],
      display_order: 2,
      active: true,
    },
    {
      id: '4049f74b-bdbf-437e-9d42-bd7460bfac36',
      name: 'Platinum',
      price: 10000,
      currency: 'USD',
      description: 'Institutional-grade tier.',
      benefits: ['1-on-1 Strategy Sessions'],
      features: ['$10,000 Entry Level'],
      display_order: 3,
      active: true,
    },
  ],
  error: null,
});
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
      eq: mockEq,
      order: mockOrder,
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
    activePlanId: null,
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

  it('submits membership upgrade request via paymentRequests service with UUID', async () => {
    const platinumUuid = '4049f74b-bdbf-437e-9d42-bd7460bfac36';
    const result = await submitMembershipUpgradeRequest({
      tierId: platinumUuid,
      tierName: 'Platinum',
      price: 10000,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'submit-payment-request',
      expect.objectContaining({
        body: expect.objectContaining({
          request_type: 'membership_upgrade',
          plan_id: platinumUuid,
          plan_name: 'Platinum',
          amount: 10000,
        }),
      })
    );
  });

  it('submits vehicle purchase part-payment request with correct amount calculation', async () => {
    const result = await submitVehiclePurchaseRequest({
      vehicleId: 'cybertruck',
      vehicleName: 'Cybertruck',
      paymentOption: 'part',
      fullPrice: 80000,
      partPaymentAmount: 5000,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'submit-payment-request',
      expect.objectContaining({
        body: expect.objectContaining({
          request_type: 'vehicle_purchase',
          payment_option: 'part',
          full_price: 80000,
          part_payment_amount: 5000,
          amount: 5000,
        }),
      })
    );
  });

  it('submits vehicle purchase full-payment request with correct amount calculation', async () => {
    const result = await submitVehiclePurchaseRequest({
      vehicleId: 'cybertruck',
      vehicleName: 'Cybertruck',
      paymentOption: 'full',
      fullPrice: 80000,
      partPaymentAmount: 5000,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('pending');
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'submit-payment-request',
      expect.objectContaining({
        body: expect.objectContaining({
          request_type: 'vehicle_purchase',
          payment_option: 'full',
          full_price: 80000,
          part_payment_amount: 5000,
          amount: 80000,
        }),
      })
    );
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

  it('does NOT trigger direct database fallback when edge function fails', async () => {
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: null,
      error: { name: 'FunctionsFetchError', message: 'Network connection failed' },
    });

    const result = await submitDepositRequest({
      amount: 100,
      currency: 'USD',
    });

    expect(result.success).toBe(false);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('parses server-provided JSON error body when Edge Function returns non-2xx status code', async () => {
    const mockContext = {
      json: vi.fn().mockResolvedValue({
        error: 'Failed to save membership subscription record',
        details: 'insert or update on table "user_subscriptions" violates foreign key constraint',
        failedOperation: 'user_subscriptions_insert',
      }),
    };

    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: null,
      error: {
        name: 'FunctionsHttpError',
        message: 'Edge Function returned a non-2xx status code',
        context: mockContext,
      } as any,
    });

    const result = await submitMembershipUpgradeRequest({
      tierId: '39210b44-7892-4c62-b15a-d5f429e83bbf',
      tierName: 'Silver',
      price: 2000,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Failed to save membership subscription record');
    expect(mockContext.json).toHaveBeenCalled();
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

  it('renders MembershipPage and submits tier upgrade request with UUID', async () => {
    render(<MembershipPage />);

    await waitFor(() => {
      expect(screen.getByText(/Request Silver Upgrade/i)).toBeTruthy();
      expect(screen.getByText(/Request Gold Upgrade/i)).toBeTruthy();
      expect(screen.getByText(/Request Platinum Upgrade/i)).toBeTruthy();
    });

    const upgradeBtn = screen.getByRole('button', { name: /Request Silver Upgrade/i });
    await act(async () => {
      fireEvent.click(upgradeBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Upgrade request for Silver Tier submitted successfully/i)).toBeTruthy();
    });

    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'submit-payment-request',
      expect.objectContaining({
        body: expect.objectContaining({
          request_type: 'membership_upgrade',
          plan_id: '39210b44-7892-4c62-b15a-d5f429e83bbf',
          plan_name: 'Silver',
          amount: 2000,
        }),
      })
    );
  });
});
