import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { Footer } from './components/Footer';

describe('Tesla UI Clone Components', () => {
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

  it('renders full App layout without errors', () => {
    render(<App />);
    expect(screen.getByText('TESLA')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: /^invest$/i })).toBeTruthy();
  });
});
