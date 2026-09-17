import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { InvestPage } from './components/InvestPage';
import { ShopPage } from './components/ShopPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { LoginPage } from './components/LoginPage';
import { Footer } from './components/Footer';

export function App() {
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

  const isHowItWorksRoute = currentPath.startsWith('/how-it-works');
  const isInvestLoginRoute = currentPath === '/invest/login' || currentPath.startsWith('/invest/login');
  const isInvestRoute =
    currentPath.startsWith('/invest') ||
    currentPath.startsWith('/projects') ||
    currentPath.startsWith('/tunnel') ||
    currentPath.startsWith('/ai');
  const isShopRoute = currentPath.startsWith('/shop');

  const renderContent = () => {
    if (isHowItWorksRoute) {
      return <HowItWorksPage />;
    }
    if (isInvestLoginRoute) {
      return <LoginPage />;
    }
    if (isInvestRoute) {
      return <InvestPage />;
    }
    if (isShopRoute) {
      return <ShopPage />;
    }
    return <Homepage />;
  };

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
