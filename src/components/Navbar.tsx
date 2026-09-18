import React, { useState } from 'react';
import { Menu, X, ChevronRight, User, LogOut, TrendingUp, Car } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from './BrandLogo';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Invest', href: '/invest' },
  { label: 'Shop', href: '/shop' },
  { label: 'How It Works', href: '/how-it-works' },
];

export const Navbar: React.FC<NavbarProps> = ({
  navItems = defaultNavItems,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/invest/login';
  };

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'Account';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#030304]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand Logo - Compact on mobile, full size on desktop */}
        <a href="/" className="flex items-center gap-1.5 sm:gap-2 group focus:outline-none rounded-lg p-0.5 transition-all flex-shrink-0">
          <div className="hidden sm:block">
            <BrandLogo size="md" />
          </div>
          <div className="block sm:hidden flex items-center gap-1.5">
            <BrandLogo variant="icon" size="sm" />
            <span className="text-[11px] font-black uppercase tracking-wider text-white">
              Tesla <span className="text-[#e82127]">&</span> Spacex
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
            return (
              <a
                key={item.label}
                href={item.href}
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 relative py-1.5 ${
                  isActive
                    ? 'text-white font-bold after:w-full'
                    : 'text-white/70 hover:text-white hover:tracking-[0.24em]'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#e82127] hover:after:w-full after:transition-all after:duration-300`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-full">
              <a
                href="/dashboard"
                className="text-xs font-semibold uppercase tracking-wider text-white/90 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#e82127]" />
                {displayName}
              </a>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1 text-white/50 hover:text-red-400 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Sign Out"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <a
              href="/invest/login"
              className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-white/80 hover:text-white rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
              aria-label="Account Login"
            >
              <User className="w-3.5 h-3.5 text-white/60" />
              Account
            </a>
          )}
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-white rounded-full bg-[#e82127]/90 border border-[#e82127] hover:bg-[#e82127] hover:shadow-[0_0_20px_rgba(232,33,39,0.4)] transition-all duration-300"
          >
            Explore
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Viewport Header Action Group */}
        <div className="flex md:hidden items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Prominent Quick-Action Links for INVEST & SHOP */}
          <a
            href="/invest"
            className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full transition-all flex items-center gap-0.5 ${
              currentPath.startsWith('/invest')
                ? 'bg-red-600/30 text-red-400 border border-red-500/50'
                : 'text-white/90 bg-white/[0.08] hover:bg-white/15 border border-white/15'
            }`}
          >
            <TrendingUp className="w-2.5 h-2.5 text-red-400" />
            Invest
          </a>
          <a
            href="/shop"
            className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full transition-all flex items-center gap-0.5 ${
              currentPath.startsWith('/shop')
                ? 'bg-[#e82127] text-white border border-[#e82127] shadow-[0_0_10px_rgba(232,33,39,0.5)]'
                : 'text-white bg-[#e82127]/90 hover:bg-[#e82127] border border-[#e82127]'
            }`}
          >
            <Car className="w-2.5 h-2.5 text-white" />
            Shop
          </a>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-white/80 hover:text-white focus:outline-none rounded-lg bg-white/[0.05] border border-white/10"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 text-red-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#030304]/98 backdrop-blur-3xl border-b border-white/15 px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Section 1: Prominent Primary Destinations */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 px-1">
              Primary Destinations
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/invest"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col p-3 rounded-xl border transition-all ${
                  currentPath.startsWith('/invest')
                    ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_15px_rgba(232,33,39,0.2)]'
                    : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <TrendingUp className="w-4 h-4 text-[#e82127]" />
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">INVEST</span>
                <span className="text-[10px] text-white/50 truncate">Capital & AI Funds</span>
              </a>

              <a
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col p-3 rounded-xl border transition-all ${
                  currentPath.startsWith('/shop')
                    ? 'bg-red-600 border-[#e82127] shadow-[0_0_20px_rgba(232,33,39,0.4)]'
                    : 'bg-gradient-to-br from-[#e82127]/80 to-red-900/80 border-[#e82127]/60 hover:border-[#e82127]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Car className="w-4 h-4 text-white" />
                  <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">SHOP</span>
                <span className="text-[10px] text-white/80 truncate">Tesla Vehicles</span>
              </a>
            </div>
          </div>

          {/* Section 2: General Navigation Links */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 px-1 mb-1">
              Explore Platform
            </p>
            {navItems.map((item) => {
              const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-[0.15em] uppercase transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white font-bold border-l-2 border-[#e82127]'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                </a>
              );
            })}
          </div>

          {/* Section 3: Account & Session Controls */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-white/90 border border-white/15 rounded-xl bg-white/[0.03]">
                <a
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-white truncate"
                >
                  <User className="w-4 h-4 text-[#e82127] flex-shrink-0" />
                  <span className="truncate">Dashboard ({displayName})</span>
                </a>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 text-xs font-bold uppercase cursor-pointer flex-shrink-0 ml-2"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <a
                href="/invest/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-white/90 border border-white/15 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all"
              >
                <User className="w-4 h-4 text-white/60" />
                Account Login
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
