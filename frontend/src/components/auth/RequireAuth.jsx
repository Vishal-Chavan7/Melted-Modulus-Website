import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { setAuthRedirect } from '../../utils/authRedirect';

export const RequireAuth = ({ children, redirectTo }) => {
  const { isLoggedIn, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthRedirect(redirectTo);
      openAuthModal();
    }
  }, [isLoggedIn, openAuthModal, redirectTo]);

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
