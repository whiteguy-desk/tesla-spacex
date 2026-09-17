import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { InvestPage } from './components/InvestPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ShopPage } from './components/ShopPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { AboutPage } from './components/AboutPage';
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

  const isAboutRoute = currentPath.startsWith('/about');
  const isProjectsRoute = currentPath.startsWith('/projects');
  const isSignupRoute = currentPath.startsWith('/invest/signup');
  const isHowItWorksRoute = currentPath.startsWith('/how-it-works');
  const isInvestLoginRoute = currentPath === '/invest/login' || currentPath.startsWith('/invest/login');
  const isInvestRoute =
    currentPath.startsWith('/invest') ||
    currentPath.startsWith('/tunnel') ||
    currentPath.startsWith('/ai');
  const isShopRoute = currentPath.startsWith('/shop');

  const renderContent = () => {
    if (isAboutRoute) {
      return <AboutPage />;
    }
    if (isProjectsRoute) {
      return <ProjectsPage />;
    }
    if (isSignupRoute) {
      return <SignupPage />;
    }
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
