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
import { PaymentPage } from '../components/PaymentPage';
import {
  savePaymentRequestContext,
  getPaymentRequestContext,
  clearPaymentRequestContext
} from '../lib/paymentContext';
import { supabase } from '../lib/supabase';

const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockSelect = vi.fn().mockReturnValue({
  order: vi.fn().mockResolvedValue({ data: [], error: null }),
  eq: vi.fn().mockReturnValue({
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
});
const mockEq = vi.fn().mockReturnValue({
  order: vi.fn().mockResolvedValue({ data: [], error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
});
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
    clearPaymentRequestContext();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
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

  it('renders DepositPage form and saves context to route to General Payment Page', async () => {
    render(<DepositPage />);

    await waitFor(() => {
      expect(screen.getByText('$50,000.00')).toBeTruthy();
    });

    const submitBtn = screen.getByRole('button', { name: /Proceed to Payment/i });
    expect(submitBtn).toBeTruthy();

    const form = submitBtn.closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    const ctx = getPaymentRequestContext();
    expect(ctx).toBeTruthy();
    expect(ctx?.request_type).toBe('deposit');
    expect(ctx?.amount).toBe(2000);
    expect(ctx?.reference_id).toMatch(/^DEP-/);
  });

  it('renders WithdrawalPage form and saves context to route to General Payment Page', async () => {
    render(<WithdrawalPage />);

    await waitFor(() => {
      expect(screen.getByText('$50,000.00')).toBeTruthy();
    });

    const submitBtn = screen.getByRole('button', { name: /Proceed to Payment/i });
    expect(submitBtn).toBeTruthy();

    const form = submitBtn.closest('form')!;
    await act(async () => {
      fireEvent.submit(form);
    });

    const ctx = getPaymentRequestContext();
    expect(ctx).toBeTruthy();
    expect(ctx?.request_type).toBe('withdrawal');
    expect(ctx?.amount).toBe(500);
    expect(ctx?.reference_id).toMatch(/^WTH-/);
  });

  it('renders MembershipPage and saves tier upgrade request context for General Payment Page', async () => {
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

    const ctx = getPaymentRequestContext();
    expect(ctx).toBeTruthy();
    expect(ctx?.request_type).toBe('membership_upgrade');
    expect(ctx?.tier_id).toBe('39210b44-7892-4c62-b15a-d5f429e83bbf');
    expect(ctx?.amount).toBe(2000);
  });

  it('renders General Payment Page with summary, payment instructions, and email action for Cryptocurrency', async () => {
    savePaymentRequestContext({
      request_type: 'vehicle_purchase',
      reference_id: 'ORD-TEST123',
      vehicle_id: 'cybertruck',
      vehicle_name: 'Cybertruck',
      item_name: 'Cybertruck',
      payment_option: 'part',
      full_price: 80000,
      part_payment_amount: 5000,
      quantity: 1,
      amount: 5000,
      currency: 'USD',
      customer_name: 'Elon Musk',
      customer_email: 'registered@tesla.com',
      is_submitted: false,
    });

    render(<PaymentPage />);

    expect(screen.getByText(/Vehicle Order Request/i)).toBeTruthy();
    expect(screen.getAllByText('Cybertruck').length).toBeGreaterThan(0);
    expect(screen.getByText(/Elon Musk/i)).toBeTruthy();
    expect(screen.getByText(/registered@tesla.com/i)).toBeTruthy();
    expect(screen.getByText(/Tesla & SpaceX Capital Settlement/i)).toBeTruthy();

    const emailLink = screen.getByRole('link', { name: /Open Email Client/i });
    expect(emailLink.getAttribute('href')).toContain('mailto:elonmusk258080@gmail.com');
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });

  it('renders Cryptocurrency mailto link cleanly on Payment Page even if is_submitted is true', async () => {
    savePaymentRequestContext({
      request_type: 'deposit',
      reference_id: 'DEP-REF999',
      amount: 5000,
      currency: 'USD',
      item_name: 'Account Deposit',
      customer_name: 'Elon Musk',
      customer_email: 'registered@tesla.com',
      is_submitted: true,
      status: 'pending',
    });

    render(<PaymentPage />);

    expect(screen.getAllByText('DEP-REF999').length).toBeGreaterThan(0);
    const emailLink = screen.getByRole('link', { name: /Open Email Client/i });
    expect(emailLink.getAttribute('href')).toContain('mailto:elonmusk258080@gmail.com');
    expect(supabase.functions.invoke).not.toHaveBeenCalled();
  });
});
