import { useState } from 'react';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginGate = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    if (!result.success || result.user.role !== 'admin') {
      setError(result.success ? 'This account does not have admin access.' : result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="admin-login-gate">
      <div className="admin-login-box">
        <div className="admin-login-box__icon">
          <HiOutlineLockClosed size={40} aria-hidden="true" />
        </div>
        <h2>Admin <span className="text-gradient">Login</span></h2>
        <p style={{ color: 'var(--clr-text-muted)' }}>Enter your admin credentials to access the dashboard.</p>

        <div className={`auth-error ${error ? 'show' : ''}`} style={error ? { display: 'block' } : {}}>{error}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Email</label>
            <input
              type="email"
              className="form-input"
              id="admin-email"
              placeholder="admin@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                id="admin-password"
                placeholder="Enter admin password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? <HiOutlineEyeSlash size={18} aria-hidden="true" /> : <HiOutlineEye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-4)' }} disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
