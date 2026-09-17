import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LivePurchaseTicker } from './components/LivePurchaseTicker';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactPage } from './pages/ContactPage';

export const App: React.FC = () => {
  const { currentPage } = useApp();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'account':
        return <AccountPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07080f] text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black font-sans relative overflow-x-hidden">
      {/* Subtle Background Glow Spheres */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-700/10 rounded-full filter blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-100px] right-[-50px] w-[500px] h-[300px] bg-cyan-600/10 rounded-full filter blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header />

      {/* Live Social Proof Purchase Ticker */}
      <LivePurchaseTicker />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default App;
