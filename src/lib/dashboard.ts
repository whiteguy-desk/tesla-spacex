import { supabase } from './supabase';
import type { Profile } from './auth';
import type { Vehicle } from './vehicles';

export interface DepositRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'cancelled';
  reference_id: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'cancelled';
  reference_id: string;
  created_at: string;
}

export interface UserOrder {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  vehicle_name: string;
  quantity: number;
  full_price: number;
  part_payment_amount: number;
  status: string;
  contact_status: string;
  customer_name?: string;
  customer_email?: string;
  created_at: string;
}

export interface UserInvestment {
  id: string;
  user_id: string;
  project_id: string | null;
  project_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'plan' | 'order';
  amount: number;
  currency: string;
  status: string;
  reference: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface UserDashboardData {
  profile: Profile | null;
  totalBalance: number;
  totalProfit: number;
  totalInvested: number;
  activePlanId: string | null;
  investments: UserInvestment[];
  orders: UserOrder[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  transactions: Transaction[];
}

/**
 * Fetches all authenticated user data from Supabase DB tables.
 */
export async function fetchUserDashboardData(userId: string): Promise<UserDashboardData> {
  const [
    profileRes,
    investmentsRes,
    ordersRes,
    depositsRes,
    withdrawalsRes,
    transactionsRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('investments').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('deposits').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('withdrawals').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ]);

  const profile = profileRes.data || null;

  return {
    profile,
    totalBalance: Number(profile?.total_balance ?? 0),
    totalProfit: Number(profile?.total_profit ?? 0),
    totalInvested: Number(profile?.total_invested ?? 0),
    activePlanId: profile?.active_plan_id || null,
    investments: (investmentsRes.data as UserInvestment[]) || [],
    orders: (ordersRes.data as UserOrder[]) || [],
    deposits: (depositsRes.data as DepositRequest[]) || [],
    withdrawals: (withdrawalsRes.data as WithdrawalRequest[]) || [],
    transactions: (transactionsRes.data as Transaction[]) || [],
  };
}

/**
 * Creates a new deposit request in the database and records a transaction.
 */
export async function createDepositRequest(
  userId: string,
  amount: number,
  currency: string = 'USD'
): Promise<{ deposit: DepositRequest | null; error: Error | null }> {
  const referenceId = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;

  const { data, error } = await supabase
    .from('deposits')
    .insert({
      user_id: userId,
      amount,
      currency,
      status: 'submitted',
      reference_id: referenceId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating deposit request:', error);
    return { deposit: null, error: new Error(error.message) };
  }

  // Also log in transactions
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'deposit',
    amount,
    currency,
    status: 'pending',
    reference: referenceId,
    description: `Deposit request initiated (${referenceId})`,
  });

  return { deposit: data as DepositRequest, error: null };
}

/**
 * Creates a new withdrawal request in the database and records a transaction.
 */
export async function createWithdrawalRequest(
  userId: string,
  amount: number,
  currency: string = 'USD'
): Promise<{ withdrawal: WithdrawalRequest | null; error: Error | null }> {
  const referenceId = `WTH-${Math.floor(100000 + Math.random() * 900000)}`;

  const { data, error } = await supabase
    .from('withdrawals')
    .insert({
      user_id: userId,
      amount,
      currency,
      status: 'submitted',
      reference_id: referenceId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating withdrawal request:', error);
    return { withdrawal: null, error: new Error(error.message) };
  }

  // Log in transactions
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'withdrawal',
    amount,
    currency,
    status: 'pending',
    reference: referenceId,
    description: `Withdrawal request submitted (${referenceId})`,
  });

  return { withdrawal: data as WithdrawalRequest, error: null };
}

/**
 * Creates a new vehicle order in the database and records a transaction.
 */
export async function createVehicleOrder(
  userId: string,
  vehicle: Vehicle,
  quantity: number = 1,
  customerName: string = '',
  customerEmail: string = ''
): Promise<{ order: UserOrder | null; error: Error | null }> {
  const fullPrice = vehicle.full_price * quantity;
  const partPayment = (vehicle.part_payment_amount || 5000) * quantity;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      vehicle_id: vehicle.id,
      vehicle_name: vehicle.name,
      quantity,
      full_price: fullPrice,
      part_payment_amount: partPayment,
      status: 'pending',
      contact_status: 'awaiting_contact',
      customer_name: customerName,
      customer_email: customerEmail,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating vehicle order:', error);
    return { order: null, error: new Error(error.message) };
  }

  // Log in transactions
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'order',
    amount: partPayment,
    currency: vehicle.currency || 'USD',
    status: 'pending',
    reference: data.id,
    description: `Vehicle order for ${quantity}x ${vehicle.name} (Part Payment: $${partPayment.toLocaleString()})`,
  });

  return { order: data as UserOrder, error: null };
}

/**
 * Activates or requests subscription to a membership tier.
 */
export async function subscribeToPlan(
  userId: string,
  planId: string,
  planName: string,
  price: number
): Promise<{ success: boolean; error: Error | null }> {
  // Update user profile active_plan_id
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ active_plan_id: planId })
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating profile active plan:', profileError);
    return { success: false, error: new Error(profileError.message) };
  }

  // Insert into user_subscriptions
  await supabase.from('user_subscriptions').insert({
    user_id: userId,
    plan_id: planId,
    status: 'active',
  });

  // Insert transaction record
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'plan',
    amount: price,
    currency: 'USD',
    status: 'completed',
    reference: planId,
    description: `Subscribed to ${planName} membership tier ($${price.toLocaleString()})`,
  });

  return { success: true, error: null };
}
