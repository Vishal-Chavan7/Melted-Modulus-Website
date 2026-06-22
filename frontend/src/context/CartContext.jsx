import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const STORAGE_KEY = 'mm_cart';
const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;

const readLocalCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to read cart from localStorage', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const applyCart = useCallback((newItems) => {
    setItems(newItems);
    if (newItems.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    }
  }, []);

  const canSyncProduct = useCallback((productId) => MONGO_ID_REGEX.test(String(productId)), []);

  const mergeGuestCartIntoBackend = useCallback(async () => {
    const backendItems = await cartApi.get();
    const localItems = readLocalCart().filter((item) => canSyncProduct(item.id));

    if (localItems.length === 0) {
      return backendItems;
    }

    const merged = new Map();
    backendItems.forEach((item) => merged.set(String(item.id), { ...item }));
    localItems.forEach((local) => {
      const key = String(local.id);
      const existing = merged.get(key);
      if (existing) {
        existing.qty = Math.max(existing.qty, local.qty);
      } else {
        merged.set(key, local);
      }
    });

    try {
      return await cartApi.sync([...merged.values()]);
    } catch (error) {
      console.error('Failed to merge guest cart into backend:', error);
      return backendItems;
    }
  }, [canSyncProduct]);

  const reloadCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const cartItems = await mergeGuestCartIntoBackend();
        applyCart(cartItems);
        return cartItems;
      } catch (error) {
        console.error('Failed to load backend cart:', error);
        applyCart([]);
        return [];
      }
    }

    applyCart(readLocalCart());
    return readLocalCart();
  }, [isLoggedIn, applyCart, mergeGuestCartIntoBackend]);

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (!isMounted) return;

      if (isLoggedIn) {
        setItems([]);
      }

      await reloadCart();
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, reloadCart]);

  const showToast = useCallback((productName) => {
    setToastMessage(productName);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const addItem = async (product) => {
    if (isLoggedIn && canSyncProduct(product.id)) {
      try {
        const backendItems = await cartApi.add(product.id, 1);
        applyCart(backendItems);
        showToast(product.name);
        return;
      } catch (error) {
        console.error('Failed to add backend cart item:', error);
        return;
      }
    }

    const existingIndex = items.findIndex((item) => item.id === product.id);
    let newItems = [...items];
    if (existingIndex > -1) {
      newItems[existingIndex].qty += 1;
    } else {
      newItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }
    applyCart(newItems);
    showToast(product.name);
  };

  const removeItem = async (productId) => {
    if (isLoggedIn && canSyncProduct(productId)) {
      try {
        const backendItems = await cartApi.remove(productId);
        applyCart(backendItems);
        return;
      } catch (error) {
        console.error('Failed to remove backend cart item:', error);

        // Item exists in UI but not on server — drop it locally and resync.
        if (error.status === 404) {
          applyCart(items.filter((item) => item.id !== productId));
          try {
            const freshItems = await cartApi.get();
            applyCart(freshItems);
          } catch (reloadError) {
            console.error('Failed to reload cart after remove:', reloadError);
          }
        }
      }
      return;
    }

    applyCart(items.filter((item) => item.id !== productId));
  };

  const updateQty = async (productId, delta) => {
    const existingIndex = items.findIndex((i) => i.id === productId);
    if (existingIndex === -1) return;

    const nextQuantity = items[existingIndex].qty + delta;

    if (isLoggedIn && canSyncProduct(productId)) {
      try {
        if (nextQuantity <= 0) {
          await removeItem(productId);
        } else {
          const backendItems = await cartApi.update(productId, nextQuantity);
          applyCart(backendItems);
        }
      } catch (error) {
        console.error('Failed to update backend cart item:', error);
      }
      return;
    }

    let newItems = [...items];
    newItems[existingIndex].qty = nextQuantity;

    if (newItems[existingIndex].qty <= 0) {
      newItems = newItems.filter((item) => item.id !== productId);
    }

    applyCart(newItems);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await cartApi.clear();
      } catch (error) {
        if (error.status !== 404) {
          console.error('Failed to clear backend cart:', error);
        }
      }
    }
    applyCart([]);
  }, [isLoggedIn, applyCart]);

  const getShipping = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return subtotal >= 2000 ? 0 : 149;
  };

  const getGrandTotal = () => getTotal() + getShipping();

  const syncCartForCheckout = useCallback(async () => {
    const syncableItems = items.filter((item) => canSyncProduct(item.id));

    if (syncableItems.length === 0) {
      throw new Error(
        'Your cart contains outdated items. Please clear your cart and add products again from the shop.'
      );
    }

    const syncedItems = await cartApi.sync(syncableItems);
    applyCart(syncedItems);
    return syncedItems;
  }, [items, applyCart, canSyncProduct]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        getTotal,
        getTotalItems,
        getShipping,
        getGrandTotal,
        clearCart,
        syncCartForCheckout,
        canSyncProduct,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
