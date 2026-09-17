import React, { useState } from 'react';
import { Menu, X, ChevronRight, User, LogOut } from 'lucide-react';
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

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#030304]/70 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 group focus:outline-none focus:ring-1 focus:ring-red-500/50 rounded-lg p-1 transition-all">
          <BrandLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white hover:tracking-[0.24em] transition-all duration-300 relative py-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#e82127] hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
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

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded-lg"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#030304]/95 backdrop-blur-2xl border-b border-white/10 px-5 pt-3 pb-6 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-3 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/90 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <div className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-white/80 border border-white/10 rounded-lg bg-white/[0.02]">
                <a href="/dashboard" className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-[#e82127]" />
                  Dashboard ({displayName})
                </a>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-300 text-xs font-bold uppercase cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <a
                href="/invest/login"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-white/80 border border-white/10 rounded-lg hover:border-white/20 transition-all"
              >
                <User className="w-4 h-4" />
                Sign In
              </a>
            )}
            <a
              href="/shop"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase text-white bg-[#e82127] hover:bg-red-600 rounded-lg shadow-[0_0_15px_rgba(232,33,39,0.3)] transition-all"
            >
              Explore Vehicles
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
