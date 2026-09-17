import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { InvestPage } from './components/InvestPage';
import { ShopPage } from './components/ShopPage';
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

  const isInvestRoute = currentPath.startsWith('/invest');
  const isShopRoute = currentPath.startsWith('/shop');

  const renderContent = () => {
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
