import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HiOutlineCheck } from 'react-icons/hi2';
import App from './App.jsx';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import './styles/variables.css';
import './styles/reset.css';
import './styles/global.css';
import './styles/components.css';
import './styles/navbar.css';
import './styles/hero.css';
import './styles/sections.css';
import './styles/footer.css';
import './styles/responsive.css';
import './styles/auth.css';
import './styles/pages.css';
import './styles/products.css';
import './styles/account.css';

const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="toast toast--visible">
      <div className="toast-icon">
        <HiOutlineCheck aria-hidden="true" />
      </div>
      <div className="toast-message">
        Added <strong>{message}</strong> to cart
      </div>
    </div>
  );
};

const ToastManager = () => {
  const { toastMessage } = useCart();
  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    if (toastMessage) {
      setActiveToast(toastMessage);
    }
  }, [toastMessage]);

  if (!activeToast) return null;

  return (
    <Toast
      message={activeToast}
      onDone={() => setActiveToast(null)}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
              <div id="toast-container" className="toast-container">
                <ToastManager />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
