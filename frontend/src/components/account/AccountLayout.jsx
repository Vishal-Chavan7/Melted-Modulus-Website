import { NavLink, Outlet } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineArchiveBox,
  HiOutlineHeart,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  { to: '/account/profile', label: 'My Profile', Icon: HiOutlineUser },
  { to: '/account/orders', label: 'My Orders', Icon: HiOutlineArchiveBox },
  { to: '/account/wishlist', label: 'Wishlist', Icon: HiOutlineHeart },
];

export const AccountLayout = () => (
  <section className="account-page">
    <div className="container">
      <div className="account-layout">
        <aside className="account-nav">
          <nav>
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `account-nav__link ${isActive ? 'active' : ''}`}
              >
                <Icon className="ri-icon" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="account-content">
          <Outlet />
        </div>
      </div>
    </div>
  </section>
);