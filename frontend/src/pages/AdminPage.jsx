import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminLoginGate } from '../components/admin/AdminLoginGate';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminContacts } from '../components/admin/AdminContacts';
import { AdminCustomQuotes } from '../components/admin/AdminCustomQuotes';
import { AdminUsers } from '../components/admin/AdminUsers';

const PANELS = {
  overview: AdminOverview,
  products: AdminProducts,
  categories: AdminCategories,
  orders: AdminOrders,
  contacts: AdminContacts,
  quotes: AdminCustomQuotes,
  users: AdminUsers,
};

export const AdminPage = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  const handlePanelChange = (panel) => {
    setActivePanel(panel);
    setSidebarOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (!isAdmin) {
    return <AdminLoginGate />;
  }

  const ActivePanel = PANELS[activePanel] || AdminOverview;

  return (
    <div className="admin-shell">
      <AdminHeader
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen((open) => !open)}
        menuOpen={sidebarOpen}
      />
      <div className="admin-layout">
        <div
          className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <AdminSidebar
          activePanel={activePanel}
          setActivePanel={handlePanelChange}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
        />
        <main className="admin-content">
          <ActivePanel onNavigate={handlePanelChange} />
        </main>
      </div>
    </div>
  );
};
