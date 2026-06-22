import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  HiOutlineChevronDown,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineArchiveBox,
  HiOutlineHeart,
  HiOutlineWrenchScrewdriver,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';

const MenuIconLink = ({ icon: Icon, children, to, onClick }) => (
  <Link to={to} className="navbar__mobile-link navbar__mobile-link--icon" onClick={onClick}>
    <Icon className="ri-icon" aria-hidden="true" />
    {children}
  </Link>
);

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { getTotalItems, openDrawer } = useCart();
  const { currentUser, isLoggedIn, isAdmin, logout, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);
    document.body.style.overflow = nextState ? 'hidden' : '';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const dropdownItemClass = 'user-menu__dropdown-item user-menu__dropdown-item--icon';

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="MeltedModulus" className="navbar__logo-img" />
          <span className="navbar__logo-text"><span>Melted</span>Modulus</span>
        </Link>
        <div className="navbar__links">
          <NavLink to="/products" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Products</NavLink>
          <NavLink to="/custom" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Custom</NavLink>
          <NavLink to="/about" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Contact Us</NavLink>
        </div>
        <div className="navbar__actions">
          {isLoggedIn ? (
            <div className="user-menu" onClick={(e) => e.stopPropagation()}>
              <button 
                className="user-menu__trigger" 
                id="user-menu-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="user-menu__avatar">{getInitials(currentUser.name)}</div>
                <span>{currentUser.name.split(' ')[0]}</span>
                <HiOutlineChevronDown className="ri-icon" aria-hidden="true" size={12} />
              </button>
              <div className={`user-menu__dropdown ${isUserMenuOpen ? 'open' : ''}`} id="user-dropdown">
                <div className="user-menu__dropdown-header">
                  <div className="user-menu__dropdown-name">{currentUser.name}</div>
                  <div className="user-menu__dropdown-email">{currentUser.email}</div>
                </div>
                <Link className={dropdownItemClass} to="/account/profile" onClick={() => setIsUserMenuOpen(false)}>
                  <HiOutlineUser className="ri-icon" aria-hidden="true" /> My Profile
                </Link>
                <Link className={dropdownItemClass} to="/account/orders" onClick={() => setIsUserMenuOpen(false)}>
                  <HiOutlineArchiveBox className="ri-icon" aria-hidden="true" /> My Orders
                </Link>
                <Link className={dropdownItemClass} to="/account/wishlist" onClick={() => setIsUserMenuOpen(false)}>
                  <HiOutlineHeart className="ri-icon" aria-hidden="true" /> Wishlist
                </Link>
                {isAdmin && (
                  <Link className={dropdownItemClass} to="/admin">
                    <HiOutlineWrenchScrewdriver className="ri-icon" aria-hidden="true" /> Admin Dashboard
                  </Link>
                )}
                <div className="user-menu__dropdown-divider"></div>
                <button className={`${dropdownItemClass} user-menu__dropdown-item--danger`} onClick={handleLogout}>
                  <HiOutlineArrowRightOnRectangle className="ri-icon" aria-hidden="true" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button className="navbar__login-btn" onClick={openAuthModal}>Sign In</button>
          )}

          <button className="navbar__cart-btn" aria-label="Open shopping cart" onClick={openDrawer}>
            <HiOutlineShoppingCart className="ri-icon" aria-hidden="true" size={22} />
            <span className="cart-badge">{getTotalItems() > 0 ? getTotalItems() : ''}</span>
          </button>
          <button 
            className={`navbar__toggle ${isMobileMenuOpen ? 'active' : ''}`} 
            aria-label="Toggle menu" 
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} id="mobile-menu">
        <NavLink to="/products" className="navbar__mobile-link">Products</NavLink>
        <NavLink to="/custom" className="navbar__mobile-link">Custom</NavLink>
        <NavLink to="/about" className="navbar__mobile-link">About</NavLink>
        <NavLink to="/contact" className="navbar__mobile-link">Contact Us</NavLink>
        
        {isLoggedIn ? (
          <div className="mobile-auth" style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--clr-border)' }}>
            <div style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: 'var(--space-2)' }}>
              Logged in as {currentUser.name.split(' ')[0]}
            </div>
            <MenuIconLink to="/account/profile" icon={HiOutlineUser} onClick={() => setIsMobileMenuOpen(false)}>My Profile</MenuIconLink>
            <MenuIconLink to="/account/orders" icon={HiOutlineArchiveBox} onClick={() => setIsMobileMenuOpen(false)}>My Orders</MenuIconLink>
            <MenuIconLink to="/account/wishlist" icon={HiOutlineHeart} onClick={() => setIsMobileMenuOpen(false)}>Wishlist</MenuIconLink>
            {isAdmin && (
              <Link to="/admin" className="navbar__mobile-link navbar__mobile-link--icon">
                <HiOutlineWrenchScrewdriver className="ri-icon" aria-hidden="true" />
                Admin Dashboard
              </Link>
            )}
            <button 
              className="navbar__mobile-link mobile-auth-logout navbar__mobile-link--icon" 
              style={{ color: 'var(--clr-error)', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 'var(--space-3) var(--space-4)', fontSize: '1.125rem' }}
              onClick={handleLogout}
            >
              <HiOutlineArrowRightOnRectangle className="ri-icon" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mobile-auth" style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--clr-border)' }}>
            <button 
              className="btn btn-primary" 
              style={{ width: 'calc(100% - 2rem)', margin: '0 1rem' }}
              onClick={() => {
                toggleMobileMenu();
                openAuthModal();
              }}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
