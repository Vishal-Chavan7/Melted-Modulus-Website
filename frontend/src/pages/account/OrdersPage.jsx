import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { orderApi, resolveImageUrl } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

const PAYMENT_LABELS = {
  cash_on_delivery: 'Cash on Delivery',
  upi: 'UPI',
  card: 'Credit / Debit Card',
  net_banking: 'Net Banking',
};

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancellingId(cancelTarget.id);
    try {
      await orderApi.cancel(cancelTarget.id);
      setCancelTarget(null);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <p className="account-loading">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="account-panel account-panel--empty">
        <HiOutlineArchiveBox size={48} aria-hidden="true" />
        <h2>No orders yet</h2>
        <p>When you place an order, it will appear here.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <>
    <div className="account-panel">
      <div className="account-panel__header">
        <h2>My Orders</h2>
        <p>{orders.length} order{orders.length === 1 ? '' : 's'} placed</p>
      </div>

      {error && <p className="account-error">{error}</p>}

      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-card__header">
              <div>
                <h3>{order.orderNumber}</h3>
                <p className="text-muted">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="order-card__badges">
                <span className={`status-badge status-badge--${order.orderStatus}`}>
                  {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                </span>
                <span className="badge badge-brand">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
              </div>
            </div>

            <ul className="order-card__items">
              {order.items.map((item, index) => (
                <li key={`${order.id}-${index}`} className="order-card__item">
                  <div className="order-card__item-img">
                    {item.product?.image && (
                      <img src={resolveImageUrl(item.product.image)} alt={item.product.name} />
                    )}
                  </div>
                  <div>
                    <strong>{item.product?.name || 'Product unavailable'}</strong>
                    <p className="text-muted">Qty: {item.quantity} · {formatPrice(item.priceAtPurchase)} each</p>
                  </div>
                  <span>{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="order-card__footer">
              <div className="order-card__address">
                <span className="text-muted">Ship to:</span>{' '}
                {order.shippingAddress?.fullName}, {order.shippingAddress?.city} — {order.shippingAddress?.pincode}
              </div>
              <div className="order-card__total">
                <strong>{formatPrice(order.totalAmount)}</strong>
                {['pending', 'processing'].includes(order.orderStatus) && order.paymentStatus !== 'paid' && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setCancelTarget(order)}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>

    <ConfirmDialog
      isOpen={Boolean(cancelTarget)}
      title="Cancel this order?"
      message={cancelTarget ? `Order ${cancelTarget.orderNumber} will be cancelled. This cannot be undone.` : ''}
      confirmLabel="Cancel Order"
      variant="danger"
      isLoading={Boolean(cancellingId)}
      onConfirm={handleCancel}
      onClose={() => {
        if (!cancellingId) setCancelTarget(null);
      }}
    />
    </>
  );
};
