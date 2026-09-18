import { supabase } from './supabase';

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  full_price: number;
  currency: string;
  part_payment_amount: number;
  image_url: string;
  gallery_urls?: string[];
  top_speed?: string;
  acceleration?: string;
  range?: string;
  drivetrain?: string;
  seating?: string;
  features?: string[];
  specifications?: Record<string, any>;
  availability?: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'model-3',
    name: 'Model 3',
    slug: 'model-3',
    type: 'Electric Sedan',
    description: 'Experience the Future of electric mobility with high efficiency and instant torque.',
    full_price: 39999,
    currency: 'USD',
    part_payment_amount: 5000,
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912143/shop_products/vjembb6zp8ymaabtyvtf.avif',
    top_speed: '145 mph',
    acceleration: '4.2s 0-60 mph',
    range: '272 miles',
    drivetrain: 'Rear-Wheel Drive',
    seating: '5 Seats',
    features: ['Autopilot', 'Glass Roof', '15" Touchscreen', 'Premium Audio'],
    availability: 'In Stock',
  },
  {
    id: 'model-y',
    name: 'Model Y',
    slug: 'model-y',
    type: 'Electric Crossover',
    description: 'Versatile and spacious electric crossover engineered for max utility and safety.',
    full_price: 44999,
    currency: 'USD',
    part_payment_amount: 5000,
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912441/shop_products/mrmi8lgluhgy3czb1bcd.avif',
    top_speed: '135 mph',
    acceleration: '4.8s 0-60 mph',
    range: '310 miles',
    drivetrain: 'Dual Motor AWD',
    seating: '5 Seats',
    features: ['Dual Motor AWD', 'Heated Seats', 'Power Liftgate', 'Autopilot'],
    availability: 'In Stock',
  },
  {
    id: 'cybertruck',
    name: 'Cybertruck',
    slug: 'cybertruck',
    type: 'Electric Utility Vehicle',
    description: 'Stainless-steel exoskeleton designed for ultimate durability and performance.',
    full_price: 79990,
    currency: 'USD',
    part_payment_amount: 5000,
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Foundation_series_Cybertruck_at_dusk_in_San_Jose_dllu.jpg',
    top_speed: '112 mph',
    acceleration: '4.1s 0-60 mph',
    range: '340 miles',
    drivetrain: 'Dual Motor AWD',
    seating: '5 Seats',
    features: ['Ultra-Hard Exoskeleton', 'Armor Glass', '11,000 lbs Towing', 'Vault Bed'],
    availability: 'In Stock',
  },
  {
    id: 'model-s',
    name: 'Model S',
    slug: 'model-s',
    type: 'Electric Luxury Sedan',
    description: 'Unmatched range, terrifying acceleration, and refined interior luxury.',
    full_price: 49999,
    currency: 'USD',
    part_payment_amount: 5000,
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772907569/shop_products/aq36923m5clq2s9eb1kn.jpg',
    top_speed: '130 mph',
    acceleration: '3.1s 0-60 mph',
    range: '405 miles',
    drivetrain: 'Dual Motor AWD',
    seating: '5 Seats',
    features: ['Yoke Steering Option', 'Tri-Zone Climate', '22-Speaker Audio', 'Full Self-Driving Capability'],
    availability: 'In Stock',
  },
  {
    id: 'model-x',
    name: 'Model X',
    slug: 'model-x',
    type: 'Electric Luxury SUV',
    description: 'Falcon Wing doors, spacious seating for seven, and class-leading SUV safety.',
    full_price: 49999,
    currency: 'USD',
    part_payment_amount: 5000,
    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912600/shop_products/artqw7clgs2xkivyktel.avif',
    top_speed: '130 mph',
    acceleration: '3.8s 0-60 mph',
    range: '348 miles',
    drivetrain: 'Dual Motor AWD',
    seating: '7 Seats',
    features: ['Falcon Wing Doors', 'HEPA Air Filtration', 'Panoramic Windshield', 'Tow Package'],
    availability: 'In Stock',
  },
];

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('full_price', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Using default vehicles due to DB fetch error or empty table:', error);
      return DEFAULT_VEHICLES;
    }
    return data as Vehicle[];
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    return DEFAULT_VEHICLES;
  }
}

export async function fetchVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_VEHICLES.find((v) => v.slug === slug || v.id === slug) || null;
    }
    return data as Vehicle;
  } catch (err) {
    console.error('Error fetching vehicle by slug:', err);
    return DEFAULT_VEHICLES.find((v) => v.slug === slug || v.id === slug) || null;
  }
}
