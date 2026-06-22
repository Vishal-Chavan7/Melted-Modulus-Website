import { useState, useEffect, useRef, useCallback } from 'react';
import { HiOutlineXMark, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { consumeAuthRedirect } from '../../utils/authRedirect';

export const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);

  const resetForm = useCallback(() => {
    setError('');
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupPassword('');
    setSignupConfirm('');
    setActiveTab('login');
  }, []);

  const closeModal = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus email input after transition
      setTimeout(() => {
        if (emailInputRef.current) emailInputRef.current.focus();
      }, 300);
    } else {
      document.body.style.overflow = '';
    }
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeModal]);

  const switchTab = (tab) => {
    setError('');
    setActiveTab(tab);
  };

  const handleAuthSuccess = (user) => {
    closeModal();

    const redirectPath = consumeAuthRedirect();
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      handleAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const result = await signup(signupName, signupEmail, signupPassword, signupPhone);
    if (result.success) {
      handleAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleForgotOrSocial = (msg) => {
    setError(msg);
  };

  if (!isOpen && !document.getElementById('auth-overlay')?.classList.contains('open')) {
     // We use CSS transition for hiding, but we completely unmount if not open to keep DOM clean.
     // Let's just render with classes.
  }

  return (
    <div className={`auth-overlay ${isOpen ? 'open' : ''}`} id="auth-overlay" onClick={(e) => { if (e.target.id === 'auth-overlay') closeModal(); }}>
      <div className="auth-modal">
        <button className="auth-modal__close" onClick={closeModal} aria-label="Close">
          <HiOutlineXMark className="ri-icon" size={18} aria-hidden="true" />
        </button>
        
        <div className="auth-modal__body">
          <div className="auth-modal__logo">
            <img src={logo} alt="MeltedModulus" />
            <h2><span className="text-gradient">Welcome</span></h2>
            <p>Sign in to your account or create a new one</p>
          </div>

          <div className="auth-tabs">
            <button className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
            <button className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</button>
          </div>

          <div className={`auth-error ${error ? 'show' : ''}`} id="auth-error">{error}</div>

          {/* LOGIN PANEL */}
          <div className={`auth-panel ${activeTab === 'login' ? 'active' : ''}`}>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  id="login-email" 
                  placeholder="your@email.com" 
                  required 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  ref={emailInputRef}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showLoginPassword ? 'text' : 'password'} 
                    className="form-input" 
                    id="login-password" 
                    placeholder="Enter your password" 
                    required 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowLoginPassword(!showLoginPassword)} aria-label="Toggle password">
                    {showLoginPassword ? <HiOutlineEyeSlash size={18} aria-hidden="true" /> : <HiOutlineEye size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <div className="auth-options">
                <label className="auth-remember"><input type="checkbox" defaultChecked /> Remember me</label>
                <button type="button" className="auth-forgot" onClick={() => handleForgotOrSocial('Password reset is not yet available. Please contact support.')}>Forgot password?</button>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="auth-divider">or continue with</div>
            <div className="auth-social">
              <button className="auth-social-btn" type="button" onClick={() => handleForgotOrSocial('Google sign-in will be available after backend integration. For now, create an account with email.')}>
                <FcGoogle size={20} aria-hidden="true" />
                Google
              </button>
            </div>
            <div className="auth-footer">
              <p>Don't have an account? <button onClick={() => switchTab('signup')}>Sign up</button></p>
            </div>
          </div>

          {/* SIGNUP PANEL */}
          <div className={`auth-panel ${activeTab === 'signup' ? 'active' : ''}`}>
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  id="signup-name" 
                  placeholder="Your full name" 
                  required 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  id="signup-email" 
                  placeholder="your@email.com" 
                  required 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-phone">Phone</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  id="signup-phone" 
                  placeholder="+91 XXXXX XXXXX" 
                  required 
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showSignupPassword ? 'text' : 'password'} 
                    className="form-input" 
                    id="signup-password" 
                    placeholder="Min. 6 characters" 
                    required minLength="6"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowSignupPassword(!showSignupPassword)} aria-label="Toggle password">
                    {showSignupPassword ? <HiOutlineEyeSlash size={18} aria-hidden="true" /> : <HiOutlineEye size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showSignupConfirm ? 'text' : 'password'} 
                    className="form-input" 
                    id="signup-confirm" 
                    placeholder="Re-enter password" 
                    required
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowSignupConfirm(!showSignupConfirm)} aria-label="Toggle password">
                    {showSignupConfirm ? <HiOutlineEyeSlash size={18} aria-hidden="true" /> : <HiOutlineEye size={18} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <div className="auth-footer" style={{ marginTop: 'var(--space-4)' }}>
              <p>Already have an account? <button onClick={() => switchTab('login')}>Sign in</button></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
