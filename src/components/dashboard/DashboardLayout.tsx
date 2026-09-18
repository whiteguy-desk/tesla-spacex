import React, { useState } from 'react';
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Award,
  Shield,
  FolderKanban,
  ShoppingBag,
  Receipt,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  CreditCard,
  Car,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export interface DashboardLayoutProps {
  currentTab: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentTab, children }) => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'User';

  const navItems = [
    { id: 'overview', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'deposit', label: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownCircle },
    { id: 'withdrawal', label: 'Withdrawal', href: '/dashboard/withdrawal', icon: ArrowUpCircle },
    { id: 'subscribe', label: 'Subscribe to Plan', href: '/dashboard/subscribe', icon: Award },
    { id: 'my-plan', label: 'My Plan', href: '/dashboard/my-plan', icon: Shield },
    { id: 'projects', label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { id: 'orders', label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { id: 'membership', label: 'Membership Card', href: '/dashboard/membership', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/invest/login';
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col md:flex-row pt-16">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/10 px-3 py-2.5 flex items-center justify-between sticky top-16 z-30 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-xs font-bold tracking-wider truncate">{displayName}</span>
        </div>

        {/* Quick Return to Public Shop & Invest */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <a
            href="/invest"
            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 rounded-md border border-white/10 flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3 text-red-400" />
            Invest
          </a>
          <a
            href="/shop"
            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-red-600 rounded-md border border-red-500 flex items-center gap-1"
          >
            <Car className="w-3 h-3 text-white" />
            Shop
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white/80 hover:text-white rounded-lg bg-white/5 border border-white/10 cursor-pointer"
            aria-label="Toggle Dashboard Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-red-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-[#0a0a0a] border-r border-white/[0.08] flex-shrink-0 ${
          mobileMenuOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="p-4 sm:p-6 sticky top-16 space-y-6">
          <div className="hidden md:flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-sm flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Quick Links to Public Areas */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 px-2">
              Public Catalog
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <a
                href="/invest"
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-bold uppercase text-white transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                Invest
              </a>
              <a
                href="/shop"
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-[11px] font-bold uppercase text-white transition-all"
              >
                <Car className="w-3.5 h-3.5 text-red-500" />
                Shop
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.08]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 px-2 mb-2">
              Dashboard Menu
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                      isActive
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30 font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-white/40'}`} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
