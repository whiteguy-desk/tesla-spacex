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
    category: 'Space Technology',
    status: 'Demo Allocation Open',
    target_amount: 250000000,
    min_investment: 5000,
    display_metric: '18%–32% Demo Target Range',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248200/projects/spacex-space-city.jpg',
    description: 'Mock Opportunity: Orbital launch complex expansion and Starship integration infrastructure in Boca Chica.',
    location: 'Boca Chica, TX, USA',
    sector: 'Aerospace Infrastructure',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $5,000.',
    features: ['Orbital Pad Acceleration', 'Cryogenic Tank Farm', 'Starship Integration Hub'],
    timeline: 'Demo Period: Q1 2025 - Q4 2027',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'megapack-energy-grid',
    name: 'Megapack Grid Storage — Outback Initiative',
    slug: 'megapack-energy-grid',
    category: 'Energy Storage',
    status: 'Demo Allocation Open',
    target_amount: 150000000,
    min_investment: 2500,
    display_metric: '12%–22% Demo Target Range',
    image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    description: 'Mock Opportunity: Utility-scale Megapack energy storage installation reinforcing renewable grid stabilization.',
    location: 'South Australia Corridor',
    sector: 'Clean Energy & Battery Grid',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $2,500.',
    features: ['2.5 GWh Megapack Capacity', 'Subsecond Grid Response', 'Renewable Firming'],
    timeline: 'Demo Period: Q2 2025 - Q2 2026',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'supercharger-v4-network',
    name: 'V4 Ultra-Fast Supercharger Highway Mesh',
    slug: 'supercharger-v4-network',
    category: 'Charging Infrastructure',
    status: 'Demo Allocation Open',
    target_amount: 100000000,
    min_investment: 1000,
    display_metric: '14%–25% Demo Target Range',
    image_url: 'https://images.unsplash.com/photo-1558441719-670b357029bc?auto=format&fit=crop&w=800&q=80',
    description: 'Mock Opportunity: Deploying 350kW+ universal V4 Supercharger stations across trans-continental logistics arteries.',
    location: 'North America & Europe Expressways',
    sector: 'EV Infrastructure',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $1,000.',
    features: ['800V Architecture Support', 'Universal NACS & CCS Cables', 'Solar Canopy Integration'],
    timeline: 'Demo Period: Q1 2025 - Q4 2026',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'starlink-satellite-mesh',
    name: 'Starlink Direct-to-Cell LEO Satellite Mesh',
    slug: 'starlink-satellite-mesh',
    category: 'Satellite Infrastructure',
    status: 'Demo Allocation Open',
    target_amount: 300000000,
    min_investment: 10000,
    display_metric: '20%–35% Demo Target Range',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    description: 'Mock Opportunity: High-capacity second-generation Starlink satellite constellation delivering cellular backhaul globally.',
    location: 'Low Earth Orbit (Global)',
    sector: 'Aerospace & Telecom',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $10,000.',
    features: ['Direct-to-Cell Payload', 'E-Band Laser Inter-Links', 'Global Maritime Coverage'],
    timeline: 'Demo Period: Q3 2025 - Q4 2028',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'xai-colossus-cluster',
    name: 'xAI Compute Supercluster — Phase II',
    slug: 'xai-colossus-cluster',
    category: 'Advanced AI Compute',
    status: 'Demo Allocation Open',
    target_amount: 400000000,
    min_investment: 10000,
    display_metric: '22%–40% Demo Target Range',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248181/projects/xai-colossus.jpg',
    description: 'Mock Opportunity: Liquid-cooled megawatt GPU compute farm scaling neural network foundation training.',
    location: 'Memphis, TN, USA',
    sector: 'AI Technology Infrastructure',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $10,000.',
    features: ['Liquid Cooling Thermal Loop', '1,000,000 Accelerator Capacity', 'Direct Onsite Substation'],
    timeline: 'Demo Period: Q2 2025 - Q4 2026',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'cybercab-autonomous-fleet',
    name: 'Cybercab Autonomous Urban Transit Pilot',
    slug: 'cybercab-autonomous-fleet',
    category: 'Autonomous Mobility',
    status: 'Demo Allocation Open',
    target_amount: 120000000,
    min_investment: 2500,
    display_metric: '16%–30% Demo Target Range',
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    description: 'Mock Opportunity: Unsupervised Full Self-Driving commercial robotaxi fleet deployment in metropolitan centers.',
    location: 'Austin, TX & Phoenix, AZ',
    sector: 'Autonomous Mobility',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $2,500.',
    features: ['Inductive Wireless Charging', 'Vision-Only AI Autonomy', '24/7 Automated Fleet Dispatch'],
    timeline: 'Demo Period: Q1 2025 - Q3 2026',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: '4680-battery-gigafactory',
    name: '4680 Dry-Cathode Cell Line Scale-Up',
    slug: '4680-battery-gigafactory',
    category: 'Battery Technology',
    status: 'Demo Allocation Open',
    target_amount: 200000000,
    min_investment: 5000,
    display_metric: '15%–28% Demo Target Range',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    description: 'Mock Opportunity: Next-generation high-energy-density 4680 battery manufacturing line expansion.',
    location: 'Sparks, NV, USA',
    sector: 'Advanced Battery Manufacturing',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $5,000.',
    features: ['Dry Electrode Coating', 'Tabless Architecture', 'Energy Density Optimization'],
    timeline: 'Demo Period: Q2 2025 - Q4 2027',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'gigafactory-mexico-nextgen',
    name: 'Gigafactory Next-Gen Affordable Platform',
    slug: 'gigafactory-mexico-nextgen',
    category: 'Advanced Manufacturing',
    status: 'Demo Allocation Open',
    target_amount: 180000000,
    min_investment: 2500,
    display_metric: '14%–26% Demo Target Range',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248179/projects/tesla-gigafactory-mexico.jpg',
    description: 'Mock Opportunity: High-speed unboxed vehicle assembly process for mass-market electric vehicles.',
    location: 'Nuevo León, Mexico',
    sector: 'Electric Automotive Manufacturing',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $2,500.',
    features: ['Unboxed Assembly System', 'Gigacasting Die Casting', '100% Recycled Water Process'],
    timeline: 'Demo Period: Q1 2025 - Q4 2026',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'boring-vegas-loop',
    name: 'Boring Company Vegas Underground Loop Arterial',
    slug: 'boring-vegas-loop',
    category: 'Underground Mobility',
    status: 'Demo Allocation Open',
    target_amount: 95000000,
    min_investment: 1500,
    display_metric: '12%–24% Demo Target Range',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248185/projects/boring-loop.jpg',
    description: 'Mock Opportunity: Underground zero-emission express tunnel expansion connecting resort corridors and transit hubs.',
    location: 'Las Vegas, NV, USA',
    sector: 'Subterranean Infrastructure',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $1,500.',
    features: ['68-Station Connected Grid', 'Prufrock III Tunneling Machine', 'Zero-Emission Autonomous Transit'],
    timeline: 'Demo Period: Q1 2025 - Q3 2026',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
  },
  {
    id: 'neuralink-bci-trials',
    name: 'Neuralink High-Bandwidth BCI Clinical Initiative',
    slug: 'neuralink-bci-trials',
    category: 'Neurotechnology',
    status: 'Demo Allocation Open',
    target_amount: 85000000,
    min_investment: 3000,
    display_metric: '15%–32% Demo Target Range',
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248190/projects/neuralink-bci.jpg',
    description: 'Mock Opportunity: High-precision surgical robotics and clinical trial deployment for brain-computer interface platforms.',
    location: 'Fremont, CA, USA',
    sector: 'Neurotech & Medical Hardware',
    investment_info: 'Illustrative demo opportunity. Minimum mock allocation $3,000.',
    features: ['R1 Surgical Robot Scaling', 'N1 Thread Sensor Array', 'Clinical Multicenter Expansion'],
    timeline: 'Demo Period: Q2 2025 - Q4 2026',
    risk_disclosure: 'Fictional/demo project for preview purposes. No real securities offered.',
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
