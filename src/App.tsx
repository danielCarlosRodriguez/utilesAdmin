
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import Categories from './pages/Categories.tsx';
import Orders from './pages/Orders.tsx';
import CartPage from './pages/CartPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import Products from './pages/Products.tsx';
import Dashboard from './pages/Dashboard.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import MiniCart from './components/MiniCart.tsx';
import ToastContainer from './components/ToastContainer.tsx';

const AppContent = () => {
  const navigate = useNavigate();
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
      <Header
        onNavigate={() => navigate('/')}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/usuarios" element={<div className="max-w-7xl mx-auto px-4 md:px-8 py-12" />} />
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
