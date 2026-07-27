import { useAuth } from '../../context/AuthContext';

export const AdminHeader = ({ onLogout, onMenuToggle, menuOpen }) => {
  const { currentUser } = useAuth();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__start">
        <button
          type="button"
          className={`admin-topbar__menu ${menuOpen ? 'active' : ''}`}
          onClick={onMenuToggle}
          aria-label="Toggle admin menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="admin-topbar__brand">
          <span className="admin-topbar__title">MeltedModulus Admin</span>
          <span className="admin-topbar__subtitle">Store management</span>
        </div>
      </div>
      <div className="admin-topbar__actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <span className="admin-topbar__user">{currentUser?.email}</span>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
          View Site
        </a>
        <button type="button" className="btn btn-primary btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};
