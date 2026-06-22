import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineXMark, HiOutlineShoppingCart } from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { setAuthRedirect } from '../../utils/authRedirect';

export const CartDrawer = () => {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQty, getTotal } = useCart();
  const { isLoggedIn, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeDrawer();

    if (!isLoggedIn) {
      setAuthRedirect('/checkout');
      openAuthModal();
      return;
    }

    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`cart-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={closeDrawer}
      ></div>
      <div className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="cart-drawer__header">
          <h3>Your Cart</h3>
          <button className="btn btn-icon" onClick={closeDrawer} aria-label="Close cart">
            <HiOutlineXMark className="ri-icon" size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">
                <HiOutlineShoppingCart size={48} aria-hidden="true" />
              </div>
              <p>Your cart is empty</p>
              <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={closeDrawer}>
                Browse Products
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-drawer__item">
                <div className="cart-drawer__item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-drawer__item-info">
                  <div className="cart-drawer__item-name">{item.name}</div>
                  <div className="cart-drawer__item-price">{formatPrice(item.price)}</div>
                  <div className="qty-selector" style={{ marginTop: 'var(--space-2)' }}>
                    <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <button
                  className="cart-drawer__item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <HiOutlineXMark aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer" style={{ display: 'block' }}>
            <div className="cart-drawer__total">
              <span>Total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
