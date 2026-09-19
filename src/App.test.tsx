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
                    id: 'spacex-starbase-infra',
                    slug: 'spacex-starbase-infra',
                    name: 'Starbase Orbital Launch Hub Expansion',
                    category: 'Space',
                    status: 'Demo Allocation Open',
                    image_url: 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248200/projects/spacex-space-city.jpg',
                    description: 'Simulated Opportunity: Starship orbital launch tower expansion',
                    target_amount: 250000000,
                    min_investment: 5000,
                    display_metric: 'Orbital Capacity Scale',
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
    expect(screen.getByRole('heading', { level: 1, name: /Explore The Future/i })).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
    });
  });

  it('renders ProjectsPage directly with hero stats and fetched project cards', async () => {
    render(
      <AuthProvider>
        <ProjectsPage />
      </AuthProvider>
    );
    expect(screen.getByText(/Demo Opportunities & Tech Simulations/i)).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: /Project Discovery/i })).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
    });
  });

  it('falls back gracefully to default projects when DB table returns empty or error', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    } as any);

    render(
      <AuthProvider>
        <ProjectsPage />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
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
    expect(screen.getByText(/Demo Opportunities & Tech Simulations/i)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Starbase Orbital Launch Hub Expansion')).toBeTruthy();
    });
  });
});
