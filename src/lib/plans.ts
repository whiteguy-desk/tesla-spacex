import { supabase } from './supabase';

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  benefits: string[];
  features: string[];
  display_order: number;
  active: boolean;
  upgrade_info?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AiPlan {
  id: string;
  name: string;
  min_amount: number;
  max_amount?: number | null;
  expected_return_range: string;
  cycle_duration: string;
  description: string;
  features: string[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: '39210b44-7892-4c62-b15a-d5f429e83bbf',
    name: 'Silver',
    price: 2000,
    currency: 'USD',
    description: 'Entry tier membership for emerging private equity and vehicle investors.',
    benefits: ['Priority Support (48h)', 'Member-only Market Insights', 'Early Access to New Projects'],
    features: ['$2,000 Entry Level', 'Standard Yield Analytics', 'Email Portfolio Digest'],
    display_order: 1,
    active: true,
    upgrade_info: 'Deposit $2,000 or maintain active investments to unlock Silver privileges.',
  },
  {
    id: '0b26ab31-f64d-4e6b-8b1f-01e98f30f9f3',
    name: 'Gold',
    price: 5000,
    currency: 'USD',
    description: 'Elevated membership tier for active capital allocators with dedicated management.',
    benefits: ['24/7 Priority Support Line', 'Dedicated Account Manager', 'Reduced Transaction Fees', 'Private Webcast Invitations'],
    features: ['$5,000 Entry Level', 'Real-Time Portfolio Telemetry', 'Priority Vehicle Delivery Allocation'],
    display_order: 2,
    active: true,
    upgrade_info: 'Deposit $5,000 or upgrade to unlock Gold privileges.',
  },
  {
    id: '4049f74b-bdbf-437e-9d42-bd7460bfac36',
    name: 'Platinum',
    price: 10000,
    currency: 'USD',
    description: 'Institutional-grade tier offering bespoke portfolio structuring and zero management fees.',
    benefits: ['1-on-1 Strategy Sessions with Analysts', 'Direct Co-Investment Allocation', 'Zero Strategy Management Fees', 'Exclusive Quarterly Briefings'],
    features: ['$10,000 Entry Level', 'VIP Direct Contact Line', 'Bespoke AI Execution Parameters'],
    display_order: 3,
    active: true,
    upgrade_info: 'Deposit $10,000 to achieve Platinum VIP status.',
  },
];

export const DEFAULT_AI_PLANS: AiPlan[] = [
  {
    id: 'starter-ai',
    name: 'Starter AI',
    min_amount: 1000,
    max_amount: 10000,
    expected_return_range: '200%–350%',
    cycle_duration: '24 Hours',
    description: 'Designed for new investors seeking structured exposure with automated risk controls.',
    features: ['Automated trade execution', 'Risk-adjusted capital deployment', 'Portfolio rebalancing', 'Monthly performance reporting'],
    active: true,
  },
  {
    id: 'growth-ai',
    name: 'Growth AI',
    min_amount: 10000,
    max_amount: 100000,
    expected_return_range: '350%–550%',
    cycle_duration: '3 Days',
    description: 'Enhanced AI signal modeling focused on high-growth technology sectors.',
    features: ['High-frequency signal detection', 'Sector rotation strategy', 'Volatility hedging logic', 'Weekly analytics dashboard'],
    active: true,
  },
  {
    id: 'elite-ai',
    name: 'Elite AI',
    min_amount: 100000,
    max_amount: null,
    expected_return_range: '+700%',
    cycle_duration: '5 Days',
    description: 'Multi-layered AI execution across diversified innovation assets with downside protection.',
    features: ['Cross-sector AI allocation engine', 'Downside risk containment protocol', 'Real-time capital rebalancing', 'Dedicated strategy oversight'],
    active: true,
  },
];

export async function fetchMembershipTiers(): Promise<MembershipTier[]> {
  try {
    const { data, error } = await supabase
      .from('membership_tiers')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Using default membership tiers due to DB fetch error:', error);
      return DEFAULT_MEMBERSHIP_TIERS;
    }
    return data as MembershipTier[];
  } catch (err) {
    console.error('Error fetching membership tiers:', err);
    return DEFAULT_MEMBERSHIP_TIERS;
  }
}

export async function fetchAiPlans(): Promise<AiPlan[]> {
  try {
    const { data, error } = await supabase
      .from('ai_plans')
      .select('*')
      .eq('active', true)
      .order('min_amount', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Using default AI plans due to DB fetch error:', error);
      return DEFAULT_AI_PLANS;
    }
    return data as AiPlan[];
  } catch (err) {
    console.error('Error fetching AI plans:', err);
    return DEFAULT_AI_PLANS;
  }
}
