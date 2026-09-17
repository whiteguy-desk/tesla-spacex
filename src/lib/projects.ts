import { supabase } from './supabase';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  target_amount: number;
  display_metric: string;
  image_url: string;
  gallery?: string[];
  location?: string;
  sector?: string;
  investment_info?: string;
  features?: string[];
  timeline?: string;
  risk_disclosure?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'doge-reserve-fund',
    name: 'Dogecoin Reserve Fund',
    slug: 'doge-reserve-fund',
    category: 'Dogecoin',
    status: 'Open',
    target_amount: 50000000,
    display_metric: '40%–120% Yield',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248208/projects/doge-reserve.jpg',
    description: "Sample Project: Ride the world's most iconic meme coin with institutional-grade capital allocation.",
    location: 'Global',
    sector: 'Crypto Capital',
    investment_info: 'Sample Development Data — Min entry $1,000.',
    features: ['Institutional Storage', 'Dynamic Rebalancing', 'Liquidity Management'],
    timeline: 'Q1 2025 - Q4 2025',
    risk_disclosure: 'Cryptocurrency and token investments carry market risk and high volatility. Sample data for preview purposes.',
  },
  {
    id: 'xai-colossus-ii-gpu-cluster',
    name: 'xAI Colossus II — 1M GPU Cluster',
    slug: 'xai-colossus-ii-gpu-cluster',
    category: 'xAI',
    status: 'Open',
    target_amount: 300000000,
    display_metric: '28%–90% Yield',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248181/projects/xai-colossus.jpg',
    description: "Sample Project: Back the next-generation compute infrastructure powering frontier AI research.",
    location: 'Memphis, TN',
    sector: 'AI Infrastructure',
    investment_info: 'Sample Development Data — Min entry $10,000.',
    features: ['1,000,000 GPU Capacity', 'Direct Compute Yield', 'Liquid Allocation'],
    timeline: 'Q2 2025 - Q4 2026',
    risk_disclosure: 'AI infrastructure investments subject to market demand and technology development. Sample data.',
  },
  {
    id: 'tesla-gigafactory-mexico',
    name: 'Gigafactory Mexico — Phase 1',
    slug: 'tesla-gigafactory-mexico',
    category: 'Tesla',
    status: 'Open',
    target_amount: 120000000,
    display_metric: '32%–95% Yield',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248179/projects/tesla-gigafactory-mexico.jpg',
    description: 'Sample Project: Fund manufacturing capacity expansion for next-gen affordable electric platforms.',
    location: 'Nuevo León, Mexico',
    sector: 'Manufacturing',
    investment_info: 'Sample Development Data — Min entry $2,500.',
    features: ['Next-Gen Platform', 'Sustainable Energy Hub', 'Automated Production'],
    timeline: 'Q1 2025 - Q2 2026',
    risk_disclosure: 'Industrial production investments carry operational and regulatory risks. Sample preview data.',
  },
  {
    id: 'spacex-space-city-fund',
    name: 'SpaceX Space City Infrastructure Fund',
    slug: 'spacex-space-city-fund',
    category: 'SpaceX',
    status: 'Open',
    target_amount: 200000000,
    display_metric: '35%–110% Yield',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248200/projects/spacex-space-city.jpg',
    description: 'Sample Project: Infrastructure development supporting orbital launch facilities and Starbase expansion.',
    location: 'Boca Chica, TX',
    sector: 'Aerospace',
    investment_info: 'Sample Development Data — Min entry $5,000.',
    features: ['Starbase Expansion', 'Starlink Production', 'Orbital Launch Complex'],
    timeline: 'Q1 2025 - Q4 2027',
    risk_disclosure: 'Aerospace infrastructure involves long horizons and execution complexity. Sample preview data.',
  },
  {
    id: 'neuralink-bci-series',
    name: 'Neuralink BCI Human Trials Series',
    slug: 'neuralink-bci-series',
    category: 'Neuralink',
    status: 'Open',
    target_amount: 80000000,
    display_metric: '25%–85% Yield',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248190/projects/neuralink-bci.jpg',
    description: 'Sample Project: Support commercial clinical trial deployment for high-bandwidth neural interfaces.',
    location: 'Fremont, CA',
    sector: 'Neurotechnology',
    investment_info: 'Sample Development Data — Min entry $3,000.',
    features: ['Surgical Robotics', 'Clinical Expansion', 'FDA Trial Scaling'],
    timeline: 'Q2 2025 - Q4 2026',
    risk_disclosure: 'Biotech and medical technology subject to regulatory approval schedules. Sample preview data.',
  },
  {
    id: 'boring-loop-network',
    name: 'Boring Company Vegas Loop Network Expansion',
    slug: 'boring-loop-network',
    category: 'The Boring Company',
    status: 'Open',
    target_amount: 95000000,
    display_metric: '30%–88% Yield',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248185/projects/boring-loop.jpg',
    description: 'Sample Project: Expand underground zero-emission transit tunnel networks in major metropolitan areas.',
    location: 'Las Vegas, NV',
    sector: 'Tunneling Transit',
    investment_info: 'Sample Development Data — Min entry $2,000.',
    features: ['68-Station Network', 'Prufrock III Tunneling', 'Zero-Emission Transit'],
    timeline: 'Q1 2025 - Q3 2026',
    risk_disclosure: 'Transit infrastructure subject to municipal permitting and construction timelines. Sample preview data.',
  },
];

export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Using default projects due to DB fetch error:', error);
      return DEFAULT_PROJECTS;
    }
    return data as Project[];
  } catch (err) {
    console.error('Error fetching projects:', err);
    return DEFAULT_PROJECTS;
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_PROJECTS.find((p) => p.slug === slug || p.id === slug) || null;
    }
    return data as Project;
  } catch (err) {
    console.error('Error fetching project by slug:', err);
    return DEFAULT_PROJECTS.find((p) => p.slug === slug || p.id === slug) || null;
  }
}
