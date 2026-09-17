import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { Footer } from './components/Footer';
import { InvestPage } from './components/InvestPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ShopPage } from './components/ShopPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { AboutPage } from './components/AboutPage';

describe('Tesla UI Clone Components', () => {
  let originalPath = window.location.pathname;

  beforeEach(() => {
    originalPath = window.location.pathname;
  });

  afterEach(() => {
    window.history.pushState({}, '', originalPath);
  });

  it('renders Navbar with brand logo and navigation links', () => {
    render(<Navbar logoText="TESLA" />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByRole('navigation')).toBeTruthy();
    expect(screen.getByText('How It Works')).toBeTruthy();
    expect(screen.getByText('Projects')).toBeTruthy();
  });

  it('renders Homepage with Shop and Invest sections', () => {
    render(<Homepage />);
    expect(screen.getByRole('heading', { level: 2, name: /^shop$/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /^invest$/i })).toBeTruthy();
    expect(screen.getByText('Browse Vehicles')).toBeTruthy();
    expect(screen.getByText('Start Investing')).toBeTruthy();
  });

  it('renders Footer with links and copyright notice', () => {
    render(<Footer copyrightText="© 2025 Tesla, Inc. Test Copyright" />);
    expect(screen.getByText('© 2025 Tesla, Inc. Test Copyright')).toBeTruthy();
    expect(screen.getByText('Vehicles & Shop')).toBeTruthy();
    expect(screen.getAllByText('How It Works').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0);
    expect(screen.getByText('About')).toBeTruthy();
  });

  it('renders InvestPage directly with hero and opportunity sections', () => {
    render(<InvestPage />);
    expect(screen.getByText(/Own a Stake in/i)).toBeTruthy();
    expect(screen.getByText("Tomorrow's World")).toBeTruthy();
    expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
    expect(screen.getByText('xAI Colossus II — 1M GPU Cluster')).toBeTruthy();
    expect(screen.getByText('Gigafactory Mexico — Phase 1')).toBeTruthy();
  });

  it('renders ProjectsPage directly with hero stats and project cards', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('Private Market Access')).toBeTruthy();
    expect(screen.getAllByText(/Investment/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Opportunities/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Open Now')).toBeTruthy();
    expect(screen.getByText('Total Projects')).toBeTruthy();
    expect(screen.getByText('Max Projected Yield')).toBeTruthy();

    expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
    expect(screen.getByText('xAI Colossus II — 1M GPU Cluster')).toBeTruthy();
    expect(screen.getByText('Gigafactory Mexico — Phase 1')).toBeTruthy();
    expect(screen.getByText('Starship Commercial Fleet Expansion')).toBeTruthy();
    expect(screen.getByText('Underground Tunnel Network')).toBeTruthy();
    expect(screen.getByText('Space City Infrastructure Fund')).toBeTruthy();
    expect(screen.getByText('Las Vegas Loop — Convention Centre Phase 3')).toBeTruthy();
    expect(screen.getByText('Neuralink N2 — Expanded Clinical Programme')).toBeTruthy();
  });

  it('renders ShopPage directly with vehicle products and interactive hero carousel', () => {
    render(<ShopPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Vehicles' })).toBeTruthy();
    expect(screen.getAllByText('Model 3').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 3, name: 'Model Y' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Cybertruck' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Model S' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Model X' })).toBeTruthy();

    // Test carousel navigation
    const nextButton = screen.getByLabelText('Next Slide');
    fireEvent.click(nextButton);
    expect(screen.getByLabelText('Go to slide 2')).toBeTruthy();
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

    expect(screen.getByText('Starter AI')).toBeTruthy();
    expect(screen.getByText('Growth AI')).toBeTruthy();
    expect(screen.getByText('Elite AI')).toBeTruthy();

    expect(screen.getByText('Silver')).toBeTruthy();
    expect(screen.getByText('Gold')).toBeTruthy();
    expect(screen.getByText('Platinum')).toBeTruthy();
  });

  it('renders AboutPage directly with all sections', () => {
    render(<AboutPage />);
    expect(screen.getByText('Our Story')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: /About Tesla/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /Democratising/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /A World Where/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /Three Products\./i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Our Journey' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /What Sets Us/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /What We/i })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /The Team/i })).toBeTruthy();

    expect(screen.getByText('Marcus Chen')).toBeTruthy();
    expect(screen.getByText('Sofia Reyes')).toBeTruthy();
    expect(screen.getByText('James Kowalski')).toBeTruthy();
    expect(screen.getByText('Amara Levi')).toBeTruthy();
  });

  it('renders SignupPage directly with form elements and password toggle', () => {
    render(<SignupPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Create your account' })).toBeTruthy();
    expect(screen.getByLabelText(/Email Address/i)).toBeTruthy();
    expect(screen.getByLabelText(/First Name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Last Name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Gender/i)).toBeTruthy();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeTruthy();
    expect(screen.getByLabelText(/Country/i)).toBeTruthy();
    expect(screen.getByLabelText(/Currency/i)).toBeTruthy();
    expect(screen.getByLabelText(/Phone Number/i)).toBeTruthy();
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: 'Show' });
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByRole('button', { name: 'Hide' })).toBeTruthy();
  });

  it('renders LoginPage directly with login form elements', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome back' })).toBeTruthy();
    expect(screen.getByText('Access your investment dashboard')).toBeTruthy();
    expect(screen.getByLabelText(/Email Address/i)).toBeTruthy();
    expect(screen.getByLabelText(/Password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Show' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
    expect(screen.getByText('Forgot password?')).toBeTruthy();
    expect(screen.getByText('Create one')).toBeTruthy();

    // Test password show/hide toggle
    const toggleButton = screen.getByRole('button', { name: 'Show' });
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: 'Hide' })).toBeTruthy();
    expect(passwordInput.type).toBe('text');
  });

  it('renders full App layout on root route', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /^invest$/i })).toBeTruthy();
  });

  it('renders AboutPage in App layout when on /about route', () => {
    window.history.pushState({}, '', '/about');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByText('Our Story')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: /About Tesla/i })).toBeTruthy();
  });

  it('renders SignupPage in App layout when on /invest/signup route', () => {
    window.history.pushState({}, '', '/invest/signup');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Create your account' })).toBeTruthy();
  });

  it('renders ProjectsPage in App layout when on /projects route', () => {
    window.history.pushState({}, '', '/projects');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByText('Private Market Access')).toBeTruthy();
    expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
  });

  it('renders InvestPage in App layout when on /invest route', () => {
    window.history.pushState({}, '', '/invest');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByText(/Own a Stake in/i)).toBeTruthy();
    expect(screen.getByText("Tomorrow's World")).toBeTruthy();
    expect(screen.getByText('The Musk')).toBeTruthy();
    expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
  });

  it('renders LoginPage in App layout when on /invest/login route', () => {
    window.history.pushState({}, '', '/invest/login');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome back' })).toBeTruthy();
    expect(screen.getByText('Access your investment dashboard')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
  });

  it('renders ShopPage in App layout when on /shop route', () => {
    window.history.pushState({}, '', '/shop');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Vehicles' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Model Y' })).toBeTruthy();
  });

  it('renders HowItWorksPage in App layout when on /how-it-works route', () => {
    window.history.pushState({}, '', '/how-it-works');
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByText('Platform Guide')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Three Ways to Participate' })).toBeTruthy();
  });
});
