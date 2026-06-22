import { useEffect } from 'react';
import { HiOutlineShoppingCart, HiOutlineXMark } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { PageHero } from '../components/common/PageHero';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { setAuthRedirect } from '../utils/authRedirect';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, getTotal, getTotalItems, getShipping, getGrandTotal } = useCart();
  const { isLoggedIn, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthRedirect('/cart');
      openAuthModal();
    }
  }, [isLoggedIn, openAuthModal]);

  if (!isLoggedIn) {
    return (
      <>
        <PageHero
          label="Checkout"
          titleHighlight="Your Cart"
          description="Sign in to review your cart and complete checkout."
        />
        <section>
          <div className="container">
            <div className="cart-page__auth-prompt">
              <h3>Sign in required</h3>
              <p>Please sign in or create an account to view your cart and proceed to checkout.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setAuthRedirect('/cart');
                  openAuthModal();
                }}
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <PageHero
          label="Checkout"
          titleHighlight="Your Cart"
          description="Your cart is empty. Browse products and add something you like."
        />
        <section>
          <div className="container">
            <div className="cart-page__empty">
              <div className="cart-empty__icon">
                <HiOutlineShoppingCart size={48} aria-hidden="true" />
              </div>
              <p>Your cart is empty</p>
              <Link to="/products" className="btn btn-primary">Browse Products</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        label="Checkout"
        titleHighlight="Your Cart"
        description={`${getTotalItems()} item${getTotalItems() === 1 ? '' : 's'} ready for checkout.`}
      />
      <section>
        <div className="container">
          <div className="cart-page">
            <div className="cart-page__items">
              {items.map((item) => (
                <div key={item.id} className="cart-page__item">
                  <div className="cart-page__item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-page__item-info">
                    <h4>{item.name}</h4>
                    <p>{formatPrice(item.price)}</p>
                    <div className="qty-selector">
                      <button type="button" onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                  <div className="cart-page__item-total">
                    {formatPrice(item.price * item.qty)}
                  </div>
                  <button
                    type="button"
                    className="cart-page__item-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <HiOutlineXMark aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <aside className="cart-page__summary">
              <h3>Order Summary</h3>
              <div className="cart-page__summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="cart-page__summary-row">
                <span>Shipping</span>
                <span>{getShipping() === 0 ? 'Free' : formatPrice(getShipping())}</span>
              </div>
              <div className="cart-page__summary-total">
                <span>Total</span>
                <span>{formatPrice(getGrandTotal())}</span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={() => navigate('/checkout')}
              >
                Place Order
              </button>
              <Link to="/products" className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-3)', textAlign: 'center' }}>
                Continue Shopping
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};
