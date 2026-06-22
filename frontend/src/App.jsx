import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { SocialFloat } from './components/common/SocialFloat';
import { useAuth } from './context/AuthContext';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomPage } from './pages/CustomPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { AccountLayout } from './components/account/AccountLayout';
import { RequireAuth } from './components/auth/RequireAuth';
import { ProfilePage } from './pages/account/ProfilePage';
import { OrdersPage } from './pages/account/OrdersPage';
import { WishlistPage } from './pages/account/WishlistPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';

import { useScrollToTop } from './hooks/useScrollToTop';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isAuthModalOpen, closeAuthModal } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useScrollToTop();

  useEffect(() => {
    if (!isAdmin) return;

    if (!location.pathname.startsWith('/admin')) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, location.pathname, navigate]);

  return (
    <>
      {/* Admin layout has its own structure without public navbar/footer */}
      {!isAdminRoute && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/account"
            element={
              <RequireAuth redirectTo="/account/profile">
                <AccountLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CartDrawer />}
      
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      {!isAdminRoute && <SocialFloat />}
    </>
  );
}

export default App;
