import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { setAuthRedirect } from '../../utils/authRedirect';

export const RequireAuth = ({ children }) => {
  const { isLoggedIn, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthRedirect(location.pathname);
      openAuthModal();
    }
  }, [isLoggedIn, openAuthModal, location.pathname]);

  if (!isLoggedIn) {
    return (
      <section>
        <div className="container">
          <div className="cart-page__auth-prompt">
            <h3>Sign in required</h3>
            <p>Please sign in to access this page.</p>
            <button type="button" className="btn btn-primary" onClick={() => {
              setAuthRedirect(redirectTo);
              openAuthModal();
            }}>
              Sign In to Continue
            </button>
            <Link to="/" className="btn btn-secondary" style={{ marginLeft: 'var(--space-3)' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return children;
};
