
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import CartPage from './pages/CartPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { useCart } from './context/CartContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import MiniCart from './components/MiniCart.tsx';
import ToastContainer from './components/ToastContainer.tsx';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const { items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
      <Header
        onNavigate={() => navigate('/')}
        onOpenCart={() => setIsMiniCartOpen(true)}
        cartCount={cartCount}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/product/:refid" element={<ProductDetail />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <MiniCart
        isOpen={isMiniCartOpen}
        onClose={() => setIsMiniCartOpen(false)}
        onGoToCart={() => {
          setIsMiniCartOpen(false);
          navigate('/cart');
        }}
      />
      <ToastContainer />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <CartProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </CartProvider>
  </BrowserRouter>
);

export default App;
