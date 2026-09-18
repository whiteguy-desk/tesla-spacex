import { supabase } from './supabase';

export type RequestType =
  | 'deposit'
  | 'withdrawal'
  | 'plan_upgrade'
  | 'membership_upgrade'
  | 'vehicle_purchase'
  | 'investment'
  | 'cash_out';

export type RequestStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled';

export interface PaymentRequestResult {
  success: boolean;
  requestId: string | null;
  referenceId: string | null;
  status: RequestStatus;
  message: string;
  error?: Error | null;
}

export interface DepositParams {
  amount: number;
  currency?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface WithdrawalParams {
  amount: number;
  currency?: string;
  assetName?: string;
  notes?: string;
}

export interface PlanUpgradeParams {
  planId: string;
  planName: string;
  price: number;
  notes?: string;
}

export interface MembershipUpgradeParams {
  tierId: string;
  tierName: string;
  price: number;
  notes?: string;
}

export interface VehiclePurchaseParams {
  vehicleId: string;
  vehicleName: string;
  paymentOption?: 'full' | 'part';
  fullPrice: number;
  partPaymentAmount: number;
  quantity?: number;
  notes?: string;
}

export interface InvestmentParams {
  projectId: string;
  projectName: string;
  amount: number;
  currency?: string;
  notes?: string;
}

export interface VehicleCashOutParams {
  orderId?: string;
  vehicleName: string;
  amount: number;
  currency?: string;
  reason?: string;
}

/**
 * Submits request exclusively via Supabase Edge Function 'submit-payment-request'.
 * The Edge Function is the single authoritative server-side write path that performs
 * authenticated user validation, DB persistence, and Brevo transactional email notifications.
 */
async function sendPaymentRequest(
  requestType: RequestType,
  payload: Record<string, any>
): Promise<PaymentRequestResult> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
    console.warn('[PaymentRequest] User session not found.');
    return {
      success: false,
      requestId: null,
      referenceId: null,
      status: 'pending',
      message: 'You must be signed in to submit a request.',
      error: new Error('User session not found'),
    };
  }

  const referenceId = `REQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const { data: edgeData, error: edgeErr } = await supabase.functions.invoke('submit-payment-request', {
      body: {
        request_type: requestType,
        reference_id: referenceId,
        ...payload,
      },
      headers,
    });

    if (edgeErr) {
      console.error('[Edge Function Invocation Error Details]:', {
        name: edgeErr.name,
        message: edgeErr.message,
        status: (edgeErr as any)?.status,
        context: (edgeErr as any)?.context,
      });

      let userMessage = 'Unable to submit your request right now. Please try again later.';
      if (edgeErr.message?.includes('401') || edgeErr.message?.includes('Unauthorized')) {
        userMessage = 'Your session has expired. Please sign in again.';
      } else if (edgeErr.message?.includes('503') || edgeErr.message?.includes('500') || edgeErr.message?.includes('Failed to fetch')) {
        userMessage = 'Payment request service is temporarily unavailable. Please try again in a few moments.';
      }

      return {
        success: false,
        requestId: null,
        referenceId: null,
        status: 'pending',
        message: userMessage,
        error: new Error(edgeErr.message),
      };
    }

    if (edgeData) {
      return {
        success: Boolean(edgeData.success),
        requestId: edgeData.requestId || referenceId,
        referenceId: edgeData.referenceId || referenceId,
        status: edgeData.status || 'pending',
        message: edgeData.message || (edgeData.success ? 'Your request has been submitted successfully and is pending review.' : 'Unable to process request right now.'),
        error: undefined,
      };
    }

    return {
      success: false,
      requestId: null,
      referenceId: null,
      status: 'pending',
      message: 'No response received from request service. Please try again.',
      error: new Error('Empty response from request service'),
    };
  } catch (err: any) {
    console.error('Error in sendPaymentRequest:', err);
    return {
      success: false,
      requestId: null,
      referenceId: null,
      status: 'pending',
      message: err?.message || 'Unable to submit your request right now. Please try again later.',
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

export async function submitDepositRequest(params: DepositParams): Promise<PaymentRequestResult> {
  return sendPaymentRequest('deposit', {
    amount: params.amount,
    currency: params.currency || 'USD',
    payment_method: params.paymentMethod,
    notes: params.notes,
  });
}

export async function submitWithdrawalRequest(params: WithdrawalParams): Promise<PaymentRequestResult> {
  return sendPaymentRequest('withdrawal', {
    amount: params.amount,
    currency: params.currency || 'USD',
    asset_name: params.assetName,
    notes: params.notes,
  });
}

export async function submitPlanUpgradeRequest(params: PlanUpgradeParams): Promise<PaymentRequestResult> {
  return sendPaymentRequest('plan_upgrade', {
    plan_id: params.planId,
    plan_name: params.planName,
    amount: params.price,
    notes: params.notes,
  });
}

export async function submitMembershipUpgradeRequest(params: MembershipUpgradeParams): Promise<PaymentRequestResult> {
  return sendPaymentRequest('membership_upgrade', {
    plan_id: params.tierId,
    plan_name: params.tierName,
    amount: params.price,
    notes: params.notes,
  });
}

export async function submitVehiclePurchaseRequest(params: VehiclePurchaseParams): Promise<PaymentRequestResult> {
  const isFull = params.paymentOption === 'full';
  const amount = isFull ? params.fullPrice : params.partPaymentAmount;

  return sendPaymentRequest('vehicle_purchase', {
    vehicle_id: params.vehicleId,
    vehicle_name: params.vehicleName,
    payment_option: params.paymentOption || 'part',
    full_price: params.fullPrice,
    part_payment_amount: params.partPaymentAmount,
    quantity: params.quantity || 1,
    amount,
    notes: params.notes,
  });
}

export async function submitInvestmentRequest(params: InvestmentParams): Promise<PaymentRequestResult> {
  return sendPaymentRequest('investment', {
    project_id: params.projectId,
    project_name: params.projectName,
    amount: params.amount,
    currency: params.currency || 'USD',
    notes: params.notes,
  });
}

export async function submitVehicleCashOutRequest(params: VehicleCashOutParams): Promise<PaymentRequestResult> {
  return sendPaymentRequest('cash_out', {
    order_id: params.orderId,
    vehicle_name: params.vehicleName,
    amount: params.amount,
    currency: params.currency || 'USD',
    reason: params.reason,
  });
}
