import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { Footer } from './components/Footer';
import { InvestPage } from './components/InvestPage';
import { ShopPage } from './components/ShopPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { LoginPage } from './components/LoginPage';

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
  });

  it('renders InvestPage directly with hero and opportunity sections', () => {
    render(<InvestPage />);
    expect(screen.getByText(/Own a Stake in/i)).toBeTruthy();
    expect(screen.getByText("Tomorrow's World")).toBeTruthy();
    expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
    expect(screen.getByText('xAI Colossus II — 1M GPU Cluster')).toBeTruthy();
    expect(screen.getByText('Gigafactory Mexico — Phase 1')).toBeTruthy();
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
    // After clicking next, slide 2 (Model Y) should be active in hero section
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
