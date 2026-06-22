import { useEffect, useState } from 'react';
import {
  HiOutlineBanknotes,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';
import { adminApi } from '../../services/api';
import { formatPrice } from '../../utils/helpers';

export const AdminOverview = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getDashboard();
        setStats(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (loading) {
    return <p className="admin-loading">Loading overview...</p>;
  }

  if (error) {
    return <p className="admin-error">{error}</p>;
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats.revenue.totalRevenue),
      Icon: HiOutlineBanknotes,
      panel: 'orders',
    },
    {
      label: 'Total Orders',
      value: stats.orders.totalOrders,
      Icon: HiOutlineClipboardDocumentList,
      panel: 'orders',
    },
    {
      label: 'Total Customers',
      value: stats.users.totalUsers,
      Icon: HiOutlineUsers,
      panel: 'users',
    },
    {
      label: 'Active Products',
      value: stats.products.activeProducts,
      Icon: HiOutlineCube,
      panel: 'products',
    },
  ];

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1>Dashboard <span className="text-gradient">Overview</span></h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-small)', marginTop: 'var(--space-1)' }}>
            Welcome back. Here is your store summary.
          </p>
        </div>
        <span className="badge badge-accent">{currentDate}</span>
      </div>

      <div className="admin-stats">
        {cards.map(({ label, value, Icon, panel }) => (
          <button
            key={label}
            type="button"
            className="admin-stat-card admin-stat-card--clickable"
            onClick={() => onNavigate?.(panel)}
          >
            <div className="admin-stat-card__icon"><Icon size={28} aria-hidden="true" /></div>
            <div className="admin-stat-card__value">{value}</div>
            <div className="admin-stat-card__label">{label}</div>
          </button>
        ))}
      </div>

      <div className="admin-panel-grid">
        <section className="admin-summary-panel">
          <h2>Orders by Status</h2>
          <ul className="admin-breakdown">
            {Object.entries(stats.orders.byStatus).map(([status, count]) => (
              <li key={status}>
                <span>{status}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-summary-panel">
          <h2>Inventory</h2>
          <ul className="admin-breakdown">
            <li><span>Total products</span><strong>{stats.products.totalProducts}</strong></li>
            <li><span>Active products</span><strong>{stats.products.activeProducts}</strong></li>
            <li><span>Low stock</span><strong>{stats.products.lowStockProducts}</strong></li>
            <li><span>Blocked users</span><strong>{stats.users.blockedUsers}</strong></li>
          </ul>
        </section>

        <section className="admin-summary-panel">
          <h2>Inquiries</h2>
          <ul className="admin-breakdown">
            <li>
              <button type="button" className="admin-breakdown__link" onClick={() => onNavigate?.('contacts')}>
                Contact messages
              </button>
              <strong>{stats.inquiries?.totalContacts ?? 0}</strong>
            </li>
            <li>
              <button type="button" className="admin-breakdown__link" onClick={() => onNavigate?.('contacts')}>
                Pending contacts
              </button>
              <strong>{stats.inquiries?.pendingContacts ?? 0}</strong>
            </li>
            <li>
              <button type="button" className="admin-breakdown__link" onClick={() => onNavigate?.('quotes')}>
                Custom quotes
              </button>
              <strong>{stats.inquiries?.totalCustomQuotes ?? 0}</strong>
            </li>
            <li>
              <button type="button" className="admin-breakdown__link" onClick={() => onNavigate?.('quotes')}>
                Pending quotes
              </button>
              <strong>{stats.inquiries?.pendingCustomQuotes ?? 0}</strong>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};
