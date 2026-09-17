import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { Footer } from './components/Footer';
import { InvestPage } from './components/InvestPage';

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
  });

  it('renders InvestPage directly with hero and opportunity sections', () => {
    render(<InvestPage />);
    expect(screen.getByText(/Own a Stake in/i)).toBeTruthy();
    expect(screen.getByText("Tomorrow's World")).toBeTruthy();
    expect(screen.getByText('Dogecoin Reserve Fund')).toBeTruthy();
    expect(screen.getByText('xAI Colossus II — 1M GPU Cluster')).toBeTruthy();
    expect(screen.getByText('Gigafactory Mexico — Phase 1')).toBeTruthy();
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
});
