import {
  HiOutlineChartBarSquare,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
  HiOutlineWrenchScrewdriver,
  HiOutlineEnvelope,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', Icon: HiOutlineChartBarSquare },
  { id: 'products', label: 'Products', Icon: HiOutlineCube },
  { id: 'categories', label: 'Categories', Icon: HiOutlineTag },
  { id: 'orders', label: 'Orders', Icon: HiOutlineClipboardDocumentList },
  { id: 'contacts', label: 'Contact Us', Icon: HiOutlineEnvelope },
  { id: 'quotes', label: 'Custom Quotes', Icon: HiOutlineDocumentText },
  { id: 'users', label: 'Users', Icon: HiOutlineUsers },
];

export const AdminSidebar = ({ activePanel, setActivePanel, onLogout, isOpen }) => {
  const { currentUser } = useAuth();

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} id="admin-sidebar">
      <div className="admin-sidebar__header">
        <h3>
          <HiOutlineWrenchScrewdriver className="ri-icon" aria-hidden="true" />
          Admin
        </h3>
        <p>Dashboard</p>
      </div>
      <nav className="admin-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`admin-nav__item ${activePanel === id ? 'active' : ''}`}
            onClick={() => setActivePanel(id)}
          >
            <span className="admin-nav__icon"><Icon aria-hidden="true" /></span>
            {label}
          </button>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <p className="admin-sidebar__user">{currentUser?.name}</p>
        <button type="button" className="btn btn-secondary btn-sm admin-sidebar__logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};
