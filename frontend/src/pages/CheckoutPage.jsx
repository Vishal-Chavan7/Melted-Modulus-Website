import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineBanknotes,
  HiOutlineCreditCard,
  HiOutlineDevicePhoneMobile,
  HiOutlineBuildingLibrary,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { PageHero } from '../components/common/PageHero';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutApi } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { setAuthRedirect } from '../utils/authRedirect';

const PAYMENT_METHODS = [
  {
    id: 'cash_on_delivery',
    label: 'Cash on Delivery',
    description: 'Pay with cash when your order is delivered.',
    Icon: HiOutlineBanknotes,
  },
  {
    id: 'upi',
    label: 'UPI',
    description: 'Pay via Google Pay, PhonePe, Paytm, or any UPI app.',
    Icon: HiOutlineDevicePhoneMobile,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay accepted.',
    Icon: HiOutlineCreditCard,
  },
  {
    id: 'net_banking',
    label: 'Net Banking',
    description: 'Pay directly from your bank account.',
    Icon: HiOutlineBuildingLibrary,
  },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, getTotalItems, getShipping, getGrandTotal, clearCart, syncCartForCheckout, canSyncProduct } = useCart();
  const { isLoggedIn, currentUser, openAuthModal } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    country: 'India',
    pincode: '',
    notes: '',
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setAuthRedirect('/checkout');
      openAuthModal();
    }
  }, [isLoggedIn, openAuthModal]);

  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (isLoggedIn && items.length === 0 && status !== 'success') {
      navigate('/cart', { replace: true });
    }
  }, [isLoggedIn, items.length, navigate, status]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const hasInvalidItems = items.some((item) => !canSyncProduct(item.id));
      if (hasInvalidItems) {
        throw new Error(
          'Some items in your cart are outdated. Please go back to the cart, remove them, and re-add products from the shop.'
        );
      }

      await syncCartForCheckout();
      const displayTotal = getGrandTotal();
      const order = await checkoutApi.submit({
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          pincode: form.pincode.trim(),
        },
        paymentMethod,
      });

      await clearCart();
      setOrderResult({ ...order, displayTotal });
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      setError(err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <PageHero
          label="Checkout"
          titleHighlight="Complete Order"
          description="Sign in to enter delivery details and place your order."
        />
        <section>
          <div className="container">
            <div className="cart-page__auth-prompt">
              <h3>Sign in required</h3>
              <p>Please sign in to continue to checkout.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setAuthRedirect('/checkout');
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

  if (status === 'success' && orderResult) {
    const paymentLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod;

    return (
      <>
        <PageHero
          label="Order Confirmed"
          titleHighlight="Thank You!"
          description="Your order has been placed successfully."
        />
        <section>
          <div className="container">
            <div className="checkout-success">
              <div className="checkout-success__icon">
                <HiOutlineCheckCircle size={56} aria-hidden="true" />
              </div>
              <h3>Order Placed Successfully</h3>
              <p className="checkout-success__order-id">
                Order ID: <strong>{orderResult.orderNumber}</strong>
              </p>
              <div className="checkout-success__details">
                <p><span>Payment method</span> {paymentLabel}</p>
                <p><span>Total amount</span> {formatPrice(orderResult.displayTotal ?? orderResult.totalAmount)}</p>
                <p><span>Delivery to</span> {form.fullName}, {form.city} — {form.pincode}</p>
              </div>
              {paymentMethod !== 'cash_on_delivery' && (
                <p className="checkout-success__note">
                  Payment instructions will be shared on your registered email and phone shortly.
                </p>
              )}
              <div className="checkout-success__actions">
                <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                <Link to="/" className="btn btn-secondary">Back to Home</Link>
              </div>
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
        titleHighlight="Complete Order"
        description={`Review your details and place your order (${getTotalItems()} item${getTotalItems() === 1 ? '' : 's'}).`}
      />
      <section>
        <div className="container">
          <form className="checkout-page" onSubmit={handleSubmit}>
            <div className="checkout-page__main">
              <div className="checkout-section">
                <h3>Delivery Address</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-name">Full Name *</label>
                    <input
                      id="checkout-name"
                      type="text"
                      className="form-input"
                      required
                      minLength={2}
                      value={form.fullName}
                      onChange={handleChange('fullName')}
                      placeholder="Recipient full name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-phone">Phone *</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      className="form-input"
                      required
                      minLength={10}
                      value={form.phone}
                      onChange={handleChange('phone')}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-street">Street Address *</label>
                  <input
                    id="checkout-street"
                    type="text"
                    className="form-input"
                    required
                    minLength={2}
                    value={form.street}
                    onChange={handleChange('street')}
                    placeholder="House no., building, street, area"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-city">City *</label>
                    <input
                      id="checkout-city"
                      type="text"
                      className="form-input"
                      required
                      value={form.city}
                      onChange={handleChange('city')}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-pincode">Pincode *</label>
                    <input
                      id="checkout-pincode"
                      type="text"
                      className="form-input"
                      required
                      minLength={4}
                      maxLength={10}
                      value={form.pincode}
                      onChange={handleChange('pincode')}
                      placeholder="400001"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-state">State *</label>
                    <select
                      id="checkout-state"
                      className="form-input"
                      required
                      value={form.state}
                      onChange={handleChange('state')}
                    >
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="checkout-country">Country *</label>
                    <input
                      id="checkout-country"
                      type="text"
                      className="form-input"
                      required
                      value={form.country}
                      onChange={handleChange('country')}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-notes">Delivery Notes (optional)</label>
                  <textarea
                    id="checkout-notes"
                    className="form-textarea"
                    rows={2}
                    value={form.notes}
                    onChange={handleChange('notes')}
                    placeholder="Landmark, gate code, preferred delivery time..."
                  />
                </div>
              </div>

              <div className="checkout-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map(({ id, label, description, Icon }) => (
                    <label
                      key={id}
                      className={`payment-method ${paymentMethod === id ? 'payment-method--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)}
                      />
                      <span className="payment-method__icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="payment-method__content">
                        <span className="payment-method__label">{label}</span>
                        <span className="payment-method__desc">{description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <aside className="checkout-page__summary">
              <h3>Order Summary</h3>
              <ul className="checkout-summary__items">
                {items.map((item) => (
                  <li key={item.id} className="checkout-summary__item">
                    <div className="checkout-summary__item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="checkout-summary__item-info">
                      <span>{item.name}</span>
                      <span className="text-muted">Qty: {item.qty}</span>
                    </div>
                    <span className="checkout-summary__item-price">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="cart-page__summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="cart-page__summary-row">
                <span>Shipping</span>
                <span>{getShipping() === 0 ? 'Free' : formatPrice(getShipping())}</span>
              </div>
              {getShipping() === 0 && (
                <p className="checkout-summary__shipping-note">Free shipping on orders ₹2,000+</p>
              )}
              <div className="cart-page__summary-total">
                <span>Total</span>
                <span>{formatPrice(getGrandTotal())}</span>
              </div>

              {error && <p className="checkout-error">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Placing Order...' : 'Confirm & Place Order'}
              </button>
              <Link to="/cart" className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-3)', textAlign: 'center' }}>
                Back to Cart
              </Link>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
};
