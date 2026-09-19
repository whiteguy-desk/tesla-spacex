import { supabase } from './supabase';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  target_amount: number;
  min_investment: number;
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
    id: 'spacex-starbase-infra',
    name: 'Starbase Orbital Launch Hub Expansion',
    slug: 'spacex-starbase-infra',
    category: 'Space',
    status: 'Demo Allocation Open',
    target_amount: 250000000,
    min_investment: 5000,
    display_metric: 'Orbital Capacity Scale',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248200/projects/spacex-space-city.jpg',
    description: 'Simulated Opportunity: Starship orbital launch tower expansion, liquid methane/LOX tank farm acceleration, and payload integration bay development.',
    location: 'Boca Chica, TX, USA',
    sector: 'Space Infrastructure',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $5,000.',
    features: ['Orbital Pad Acceleration', 'Cryogenic Tank Farm Scale', 'Starship Integration Hub'],
    timeline: 'Simulation Horizon: 2025 - 2027',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
  {
    id: 'megapack-energy-grid',
    name: 'Megapack Utility Storage Grid Initiative',
    slug: 'megapack-energy-grid',
    category: 'Energy',
    status: 'Demo Allocation Open',
    target_amount: 150000000,
    min_investment: 2500,
    display_metric: '2.5 GWh Storage Target',
    image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    description: 'Simulated Opportunity: Deploying utility-scale Megapack energy storage units to stabilize regional renewable grid networks.',
    location: 'South Australia Regional Grid',
    sector: 'Clean Energy & Grid Resilience',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $2,500.',
    features: ['2.5 GWh Storage Capacity', 'Subsecond Frequency Response', 'Renewable Firming Tech'],
    timeline: 'Simulation Horizon: 2025 - 2026',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
  {
    id: 'supercharger-v4-network',
    name: 'V4 Universal Supercharger Arterial Mesh',
    slug: 'supercharger-v4-network',
    category: 'Infrastructure',
    status: 'Demo Allocation Open',
    target_amount: 100000000,
    min_investment: 1000,
    display_metric: '350kW Peak Charging',
    image_url: 'https://images.unsplash.com/photo-1558441719-670b357029bc?auto=format&fit=crop&w=800&q=80',
    description: 'Simulated Opportunity: Expanding 350kW+ universal V4 Supercharger stations along key interstate freight and transit arteries.',
    location: 'North America & Europe Expressways',
    sector: 'EV Charging Infrastructure',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $1,000.',
    features: ['800V Architecture Support', 'Universal NACS & CCS Cables', 'Solar Canopy Integration'],
    timeline: 'Simulation Horizon: 2025 - 2026',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
  {
    id: 'starlink-satellite-mesh',
    name: 'Starlink Direct-to-Cell Constellation',
    slug: 'starlink-satellite-mesh',
    category: 'Connectivity',
    status: 'Demo Allocation Open',
    target_amount: 300000000,
    min_investment: 10000,
    display_metric: 'Global Low-Latency Coverage',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Simulated Opportunity: Second-generation Low Earth Orbit satellite mesh delivering seamless direct-to-cell voice and data backhaul globally.',
    location: 'Low Earth Orbit (Global)',
    sector: 'Satellite Telecom',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $10,000.',
    features: ['Direct-to-Cell Payload', 'Laser Inter-Satellite Links', 'Global Maritime & Aviation Access'],
    timeline: 'Simulation Horizon: 2025 - 2028',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
  {
    id: 'xai-colossus-cluster',
    name: 'xAI Compute Supercluster Phase II',
    slug: 'xai-colossus-cluster',
    category: 'AI',
    status: 'Demo Allocation Open',
    target_amount: 400000000,
    min_investment: 10000,
    display_metric: '1M Accelerator Target Scale',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248181/projects/xai-colossus.jpg',
    description: 'Simulated Opportunity: Next-generation liquid-cooled GPU megawatt compute facility for frontier artificial intelligence model training.',
    location: 'Memphis, TN, USA',
    sector: 'AI Infrastructure & Supercomputing',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $10,000.',
    features: ['Liquid Cooling Loop', '1M Accelerator Capacity', 'Dedicated Substation Power'],
    timeline: 'Simulation Horizon: 2025 - 2026',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
  {
    id: 'cybercab-autonomous-fleet',
    name: 'Cybercab Autonomous Mobility Pilot',
    slug: 'cybercab-autonomous-fleet',
    category: 'Mobility',
    status: 'Demo Allocation Open',
    target_amount: 120000000,
    min_investment: 2500,
    display_metric: '24/7 Fleet Dispatch Target',
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    description: 'Simulated Opportunity: Commercial deployment of unsupervised Full Self-Driving robotaxis in high-density urban ride-hailing networks.',
    location: 'Austin, TX & Phoenix, AZ',
    sector: 'Autonomous Mobility',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $2,500.',
    features: ['Inductive Wireless Charging', 'Vision-Only AI Autonomy', 'Automated Fleet Cleaning & Hubs'],
    timeline: 'Simulation Horizon: 2025 - 2026',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
  {
    id: '4680-battery-gigafactory',
    name: '4680 Battery Dry-Cathode Scale-Up',
    slug: '4680-battery-gigafactory',
    category: 'Energy',
    status: 'Demo Allocation Open',
    target_amount: 200000000,
    min_investment: 5000,
    display_metric: '100 GWh Annual Target Output',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    description: 'Simulated Opportunity: Dry electrode coating technology expansion for high-density 4680 cell lines yielding lower costs and higher throughput.',
    location: 'Sparks, NV, USA',
    sector: 'Battery Technology Manufacturing',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $5,000.',
    features: ['Dry Electrode Process', 'Tabless Cell Design', 'High Energy Density Chemistry'],
    timeline: 'Simulation Horizon: 2025 - 2027',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
  {
    id: 'boring-vegas-loop',
    name: 'Underground Zero-Emission Express Loop',
    slug: 'boring-vegas-loop',
    category: 'Infrastructure',
    status: 'Demo Allocation Open',
    target_amount: 95000000,
    min_investment: 1500,
    display_metric: '68 Station Network Target',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248185/projects/boring-loop.jpg',
    description: 'Simulated Opportunity: Subterranean high-speed EV transit tunnel mesh bypassing surface congestion across resort corridors and airport hubs.',
    location: 'Las Vegas, NV, USA',
    sector: 'Underground Mobility Infrastructure',
    investment_info: 'Demo opportunity for simulation purposes. Minimum demo allocation: $1,500.',
    features: ['68-Station Connected Grid', 'Prufrock III Rapid TBM', 'Zero-Emission Autonomous Shuttles'],
    timeline: 'Simulation Horizon: 2025 - 2026',
    risk_disclosure: 'Demo Opportunity — For demonstration purposes only. No real securities are offered through this simulation.',
  },
];

export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
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
