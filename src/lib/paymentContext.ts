export type RequestType =
  | 'deposit'
  | 'withdrawal'
  | 'plan_upgrade'
  | 'membership_upgrade'
  | 'vehicle_purchase'
  | 'investment'
  | 'cash_out';

export interface PaymentRequestContext {
  request_type: RequestType;
  reference_id: string;
  request_id?: string | null;
  amount: number;
  currency?: string;
  item_name?: string;
  quantity?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  payment_method?: string;

  // Specific flow metadata
  vehicle_id?: string;
  vehicle_name?: string;
  payment_option?: 'full' | 'part';
  full_price?: number;
  part_payment_amount?: number;

  tier_id?: string;
  tier_name?: string;

  plan_id?: string;
  plan_name?: string;

  project_id?: string;
  project_name?: string;

  asset_name?: string;
  order_id?: string;
  reason?: string;

  // Submission & status state
  status?: string;
  is_submitted?: boolean;
  created_at?: string;
}

const STORAGE_KEY = 'active_payment_request';

/**
 * Saves payment request context in sessionStorage so it survives normal navigation
 * and page reloads without exposing sensitive data in URL query parameters.
 */
export function savePaymentRequestContext(context: PaymentRequestContext): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch (err) {
    console.error('Failed to save payment request context to sessionStorage:', err);
  }
}

/**
 * Retrieves the current payment request context from sessionStorage or parses reference ID from URL.
 */
export function getPaymentRequestContext(): PaymentRequestContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: PaymentRequestContext = JSON.parse(raw);

    // If URL contains a ?ref= query parameter, ensure it matches or fallback if consistent
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref') || urlParams.get('id');
    if (refParam && parsed.reference_id && parsed.reference_id !== refParam) {
      // If reference in URL is different from active request, preference is URL ref
      parsed.reference_id = refParam;
    }

    return parsed;
  } catch (err) {
    console.error('Failed to read payment request context from sessionStorage:', err);
    return null;
  }
}

/**
 * Clears the active payment request context from sessionStorage.
 */
export function clearPaymentRequestContext(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear payment request context from sessionStorage:', err);
  }
}

/**
 * Creates a unique reference ID string for new request drafts.
 */
export function generateReferenceId(type: RequestType): string {
  const prefixMap: Record<RequestType, string> = {
    deposit: 'DEP',
    withdrawal: 'WTH',
    plan_upgrade: 'PLN',
    membership_upgrade: 'MBR',
    vehicle_purchase: 'ORD',
    investment: 'INV',
    cash_out: 'CSH',
  };

  const prefix = prefixMap[type] || 'REQ';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}
