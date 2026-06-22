import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const products = await wishlistApi.get();
      setItems(products);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = (productId) =>
    items.some((item) => item.id === productId);

  const toggleWishlist = async (product) => {
    if (!isLoggedIn) {
      throw new Error('LOGIN_REQUIRED');
    }

    if (!MONGO_ID_REGEX.test(product.id)) {
      throw new Error('This product cannot be saved to wishlist.');
    }

    if (isInWishlist(product.id)) {
      const updated = await wishlistApi.remove(product.id);
      setItems(updated);
      return false;
    }

    const updated = await wishlistApi.add(product.id);
    setItems(updated);
    return true;
  };

  const removeFromWishlist = async (productId) => {
    const updated = await wishlistApi.remove(productId);
    setItems(updated);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        reloadWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
