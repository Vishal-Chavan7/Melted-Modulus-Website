import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

const SESSION_KEY = 'mm_session';

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user._id || user.id,
    name: user.name || 'User',
    email: user.email,
    phone: user.phone,
    role: user.role || 'user',
    address: {
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      country: user.address?.country || '',
      pincode: user.address?.pincode || '',
    },
    createdAt: user.createdAt,
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      return session || null;
    } catch (error) {
      console.error('Failed to parse session:', error);
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const saveSession = (user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
  };

  const signup = async (name, email, password, phone) => {
    if (!name || name.length < 2) return { success: false, error: 'Name must be at least 2 characters.' };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Please enter a valid email address.' };
    if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    if (!phone || phone.trim().length < 10) return { success: false, error: 'Phone number must be at least 10 digits.' };

    try {
      await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
      });

      return login(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email.trim().toLowerCase(), password);
      const session = normalizeUser(data.user || data);
      saveSession(session);
      setCurrentUser(session);
      return { success: true, user: session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Backend logout failed:', error);
    }
    clearSession();
    setCurrentUser(null);
  };

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser && currentUser.role === 'admin';

  const updateCurrentUser = useCallback((user) => {
    const session = normalizeUser(user);
    saveSession(session);
    setCurrentUser(session);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        updateCurrentUser,
        isLoggedIn,
        isAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
