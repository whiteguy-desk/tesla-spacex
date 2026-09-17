import React, { useState } from 'react';
import { Menu, X, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  logoText?: string;
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: 'Shop', href: '/shop' },
  { label: 'Invest', href: '/invest' },
  { label: 'Projects', href: '/projects' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Tunnel Network', href: '/tunnel' },
  { label: 'AI Plans', href: '/ai' },
  { label: 'Support', href: '/support' },
];

export const Navbar: React.FC<NavbarProps> = ({
  logoText = 'TESLA',
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
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 group focus:outline-none">
          <span className="text-xl font-black tracking-[0.3em] uppercase text-white transition-colors group-hover:text-red-500">
            {logoText}
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(232,33,39,0.8)]"></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:tracking-[0.25em] transition-all duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-red-500 hover:after:w-full after:transition-all after:duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white/80 tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-red-500" />
                {displayName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 text-white/60 hover:text-red-400 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Sign Out"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <a
              href="/invest/login"
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </a>
          )}
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-white rounded-md bg-white/10 border border-white/20 hover:border-red-500/50 hover:bg-red-600/20 transition-all duration-300"
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
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-3 py-2 text-sm font-semibold tracking-[0.15em] uppercase text-white/90 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase text-white/80 border border-white/10 rounded-md">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-red-500" />
                    {displayName}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-red-400 hover:text-red-300 text-xs font-bold uppercase cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <a
                href="/invest/login"
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase text-white/80 border border-white/10 rounded-md"
              >
                <User className="w-4 h-4" />
                Account
              </a>
            )}
            <a
              href="/shop"
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase text-white bg-red-600/80 hover:bg-red-600 rounded-md"
            >
              Explore Vehicles
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
