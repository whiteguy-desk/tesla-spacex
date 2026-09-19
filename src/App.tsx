import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { InvestPage } from './components/InvestPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ShopPage } from './components/ShopPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { PaymentPage } from './components/PaymentPage';
import { Footer } from './components/Footer';
import { navigate } from './lib/navigation';

// Dashboard imports
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { DepositPage } from './components/dashboard/DepositPage';
import { WithdrawalPage } from './components/dashboard/WithdrawalPage';
import { MyPlanPage } from './components/dashboard/MyPlanPage';
import { OrdersPage } from './components/dashboard/OrdersPage';
import { MembershipPage } from './components/dashboard/MembershipPage';
import { TransactionsPage } from './components/dashboard/TransactionsPage';
import { SettingsPage } from './components/dashboard/SettingsPage';
import { Loader2 } from 'lucide-react';

export function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isSignupRoute = currentPath.startsWith('/invest/signup') || currentPath.startsWith('/invest/register');
  const isHowItWorksRoute = currentPath.startsWith('/how-it-works') || currentPath.startsWith('/support');
  const isInvestLoginRoute = currentPath === '/invest/login' || currentPath.startsWith('/invest/login');
  const isProjectsRoute = currentPath === '/projects' || currentPath.startsWith('/projects');
  const isInvestRoute =
    currentPath === '/invest' ||
    currentPath.startsWith('/tunnel') ||
    currentPath.startsWith('/ai');
  const isShopRoute = currentPath.startsWith('/shop');
  const isMembershipRoute = currentPath === '/membership' || currentPath.startsWith('/membership');
  const isPaymentRoute = currentPath === '/payment' || currentPath.startsWith('/payment');

  // Redirect authenticated user away from login/signup routes
  useEffect(() => {
    if (!isLoading && user && (isSignupRoute || isInvestLoginRoute)) {
      navigate('/dashboard');
    }
  }, [user, isLoading, isSignupRoute, isInvestLoginRoute]);

  // General standalone /payment route
  if (isPaymentRoute) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest text-white/50">Loading Payment Gateway...</p>
        </div>
      );
    }

    if (!user) {
      navigate(`/invest/login?redirect=${encodeURIComponent(currentPath)}`);
      return null;
    }

    return (
      <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen bg-[#030304] text-white">
        <Navbar />
        <div className="flex-1">
          <PaymentPage />
        </div>
        <Footer />
      </div>
    );
  }

  // Dashboard route check
  const isDashboardRoute = currentPath.startsWith('/dashboard');

  // Auth Protection for Dashboard
  if (isDashboardRoute) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest text-white/50">Authenticating Session...</p>
        </div>
      );
    }

    if (!user) {
      // Redirect unauthenticated user to login page
      navigate(`/invest/login?redirect=${encodeURIComponent(currentPath)}`);
      return null;
    }

    let activeTab = 'overview';
    let content = <DashboardOverview />;

    if (currentPath.startsWith('/dashboard/payment')) {
      activeTab = 'payment';
      content = <PaymentPage />;
    } else if (currentPath.startsWith('/dashboard/deposit')) {
      activeTab = 'deposit';
      content = <DepositPage />;
    } else if (currentPath.startsWith('/dashboard/withdrawal')) {
      activeTab = 'withdrawal';
      content = <WithdrawalPage />;
    } else if (currentPath.startsWith('/dashboard/subscribe')) {
      activeTab = 'subscribe';
      content = <MyPlanPage isSubscribeTab={true} />;
    } else if (currentPath.startsWith('/dashboard/my-plan')) {
      activeTab = 'my-plan';
      content = <MyPlanPage isSubscribeTab={false} />;
    } else if (currentPath.startsWith('/dashboard/projects')) {
      activeTab = 'projects';
      content = <ProjectsPage />;
    } else if (currentPath.startsWith('/dashboard/orders')) {
      activeTab = 'orders';
      content = <OrdersPage />;
    } else if (currentPath.startsWith('/dashboard/membership')) {
      activeTab = 'membership';
      content = <MembershipPage />;
    } else if (currentPath.startsWith('/dashboard/transactions')) {
      activeTab = 'transactions';
      content = <TransactionsPage />;
    } else if (currentPath.startsWith('/dashboard/settings')) {
      activeTab = 'settings';
      content = <SettingsPage />;
    }

    return (
      <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen bg-[#080808] text-white">
        <Navbar />
        <DashboardLayout currentTab={activeTab}>
          {content}
        </DashboardLayout>
        <Footer />
      </div>
    );
  }

  const renderPublicContent = () => {
    if (isSignupRoute) {
      return <SignupPage />;
    }
    if (isHowItWorksRoute) {
      return <HowItWorksPage />;
    }
    if (isInvestLoginRoute) {
      return <LoginPage />;
    }
    if (isProjectsRoute) {
      return <ProjectsPage />;
    }
    if (isInvestRoute) {
      return <InvestPage />;
    }
    if (isShopRoute) {
      return <ShopPage />;
    }
    if (isMembershipRoute) {
      return (
        <div className="max-w-7xl mx-auto px-6 py-28 w-full">
          <MembershipPage />
        </div>
      );
    }
    return <Homepage />;
  };

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      {renderPublicContent()}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
