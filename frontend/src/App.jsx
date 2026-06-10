import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import './i18n';

import SplashScreen  from './components/ui/SplashScreen';
import TopBar        from './components/Layout/TopBar';
import BottomNav     from './components/Layout/BottomNav';
import Home          from './pages/Home/Home';
import About         from './pages/About/About';
import Contact       from './pages/Contact/Contact';
import Catalog       from './pages/Catalog/Catalog';
import BookDetail    from './pages/BookDetail/BookDetail';
import Cart          from './pages/Cart/Cart';
import Checkout      from './pages/Checkout/Checkout';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import Auth          from './pages/Auth/Auth';
import Account       from './pages/Account/Account';

function AppShell() {
  const location = useLocation();
  const noTop    = ['/book/'].some(p => location.pathname.startsWith(p));
  const noBottom = ['/checkout', '/auth'].some(p => location.pathname.startsWith(p));

  return (
    <div
      className="flex flex-col mx-auto overflow-hidden relative"
      style={{
        width: '100%',
        maxWidth: 430,
        height: '100dvh',
        background: '#0A1628',
        boxShadow: '0 0 80px rgba(0,0,0,0.8)',
      }}
    >
      {!noTop && <TopBar />}

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"         element={<Home />} />
            <Route path="/about"    element={<About />} />
            <Route path="/contact"  element={<Contact />} />
            <Route path="/catalog"  element={<Catalog />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/cart"     element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track"    element={<OrderTracking />} />
            <Route path="/auth"     element={<Auth />} />
            <Route path="/account"  element={<Account />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!noBottom && <BottomNav />}
    </div>
  );
}

export default function App() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter basename="/ILC-APP">
      <SplashScreen visible={splash} />
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse at center, #0f1e35 0%, #050d18 100%)' }}
      >
        <AppShell />
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0F1E35',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
          },
        }}
      />
    </BrowserRouter>
  );
}
