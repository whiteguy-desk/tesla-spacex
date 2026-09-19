import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { Footer } from './components/Footer';
import { InvestPage } from './components/InvestPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ShopPage } from './components/ShopPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { supabase } from './lib/supabase';

vi.mock('./lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'projects') {
          return {
            select: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    id: 'doge-reserve-fund',
                    slug: 'doge-reserve-fund',
                    name: 'Dogecoin Reserve Fund',
                    category: 'Dogecoin',
                    status: 'Open',
                    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248208/projects/doge-reserve.jpg',
                    description: "Ride the world's most iconic meme coin with institutional-grade exposure",
                    target_amount: 50000000,
                    display_metric: '40%–120% Yield',
                    metadata: null,
                    created_at: '2025-01-01T00:00:00Z',
                    updated_at: '2025-01-01T00:00:00Z',
                  },
                  {
                    id: 'xai-colossus-ii-gpu-cluster',
                    slug: 'xai-colossus-ii-gpu-cluster',
                    name: 'xAI Colossus II — 1M GPU Cluster',
                    category: 'xAI',
                    status: 'Open',
                    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248181/projects/xai-colossus.jpg',
                    description: "Back the infrastructure powering the world's most powerful AI",
                    target_amount: 300000000,
                    display_metric: '28%–90% Yield',
                    metadata: null,
                    created_at: '2025-01-01T00:00:00Z',
                    updated_at: '2025-01-01T00:00:00Z',
                  },
                ],
                error: null,
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [], error: null }),
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        };
      }),
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
    },
  };
});

describe('Tesla & Spacex UI Components', () => {
  let originalPath = window.location.pathname;

  beforeEach(() => {
    originalPath = window.location.pathname;
  });

  afterEach(() => {
    window.history.pushState({}, '', originalPath);
  });

  it('renders Navbar with brand logo and navigation links', () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );
    expect(screen.getAllByText(/Tesla/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Spacex/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('navigation')).toBeTruthy();
    expect(screen.getByText('How It Works')).toBeTruthy();
    expect(screen.getByText('Projects')).toBeTruthy();
  });

  it('renders Homepage with cinematic hero and interactive membership tiers', () => {
    render(
      <AuthProvider>
        <Homepage />
      </AuthProvider>
    );
    expect(screen.getByRole('heading', { level: 1, name: /Engineering The Future of Mobility/i })).toBeTruthy();
    expect(screen.getAllByText('Explore Projects').length).toBeGreaterThan(0);
    expect(screen.getByText('Explore Vehicles')).toBeTruthy();
    expect(screen.getByText('Silver Member')).toBeTruthy();
    expect(screen.getByText('Gold Member')).toBeTruthy();
    expect(screen.getByText('Platinum VIP')).toBeTruthy();
  });

  it('renders Footer with links and copyright notice', () => {
    render(<Footer copyrightText="© 2025 Tesla & Spacex. All rights reserved." />);
    expect(screen.getByText('© 2025 Tesla & Spacex. All rights reserved.')).toBeTruthy();
    expect(screen.getByText('Vehicles & Mobility')).toBeTruthy();
    expect(screen.getAllByText('How It Works').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Projects Overview').length).toBeGreaterThan(0);
  });

  it('renders InvestPage directly with hero and opportunity sections', async () => {
    render(
      <AuthProvider>
        <InvestPage />
      </AuthProvider>
    );
    expect(screen.getByText(/Institutional & Private Equity Portal/i)).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: /Invest In The Future/i })).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
      expect(screen.getByText('xAI Colossus II — 1M GPU Cluster')).toBeTruthy();
    });
  });

  it('renders ProjectsPage directly with hero stats and fetched project cards', async () => {
    render(<ProjectsPage />);
    expect(screen.getByText('Private Market Access')).toBeTruthy();
    expect(screen.getAllByText(/Investment/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Opportunities/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Open Now')).toBeTruthy();
    expect(screen.getByText('Total Projects')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
      expect(screen.getByText('xAI Colossus II — 1M GPU Cluster')).toBeTruthy();
    });
  });

  it('renders empty state in ProjectsPage when no projects returned', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    } as any);

    render(<ProjectsPage />);
    await waitFor(() => {
      expect(screen.getByText('No Projects Available')).toBeTruthy();
    });
  });

  it('renders ShopPage directly with vehicle products and interactive hero carousel', async () => {
    render(
      <AuthProvider>
        <ShopPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Vehicles' })).toBeTruthy();
    });

    expect(screen.getAllByText('Model 3').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 3, name: 'Model Y' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Cybertruck' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Model S' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Model X' })).toBeTruthy();

    const nextButton = screen.getByLabelText('Next Slide');
    fireEvent.click(nextButton);
    expect(screen.getAllByText('Model Y').length).toBeGreaterThan(0);
  });

  it('renders HowItWorksPage directly with all guide sections', () => {
    render(<HowItWorksPage />);
    expect(screen.getByText('Platform Guide')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: /How It/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Three Ways to Participate' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /Five Steps to Your/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /Two Paths\./i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Available AI Plans' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Membership Tiers' })).toBeTruthy();
  });

  it('renders SignupPage directly with form elements and password toggle', () => {
    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Create your account' })).toBeTruthy();
    expect(screen.getByLabelText(/Email Address/i)).toBeTruthy();
  });

  it('renders LoginPage directly with login form elements', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome back' })).toBeTruthy();
  });

  it('renders ProjectsPage in App layout when on /projects route', async () => {
    window.history.pushState({}, '', '/projects');
    render(<App />);
    expect(screen.getAllByText(/Tesla/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Private Market Access')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
    });
  });
});
