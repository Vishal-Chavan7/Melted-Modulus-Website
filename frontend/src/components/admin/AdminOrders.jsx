import { useCallback, useEffect, useState } from 'react';
import { adminApi, resolveImageUrl } from '../../services/api';
import { formatPrice } from '../../utils/helpers';

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const NEXT_STATUS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 1, orderStatus: '', search: '' });
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getOrders({
        page: filters.page,
        limit: 10,
        orderStatus: filters.orderStatus || undefined,
        search: filters.search || undefined,
      });
      setOrders(data.orders);
      setPagination(data.pagination);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, orderStatus) => {
    setUpdatingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, orderStatus);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: String(formData.get('search') || '').trim(),
      orderStatus: String(formData.get('orderStatus') || ''),
    }));
  };

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1>Orders</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-small)' }}>
            {pagination.totalOrders ?? 0} total orders
          </p>
        </div>
      </div>

      <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
        <input
          type="search"
          name="search"
          placeholder="Search by order number..."
          defaultValue={filters.search}
          className="form-input admin-toolbar__search"
        />
        <select name="orderStatus" defaultValue={filters.orderStatus} className="form-input admin-toolbar__select">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">Apply</button>
      </form>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-loading">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="admin-empty">No orders found.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--clr-brand)' }}>{order.orderNumber}</strong>
                    <div className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </td>
                  <td>
                    {order.user?.name || '—'}
                    <div className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{order.user?.email}</div>
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index} className="admin-table__product">
                        {item.product?.image && (
                          <div className="admin-table__product-img">
                            <img src={resolveImageUrl(item.product.image)} alt={item.product.name} />
                          </div>
                        )}
                        <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <span className={`status-badge status-badge--${order.orderStatus}`}>
                      {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                    </span>
                  </td>
                  <td>
                    {(NEXT_STATUS[order.orderStatus] || []).length > 0 ? (
                      <select
                        className="form-input"
                        value=""
                        disabled={updatingId === order.id}
                        onChange={(event) => {
                          const nextStatus = event.target.value;
                          if (nextStatus) handleStatusChange(order.id, nextStatus);
                        }}
                      >
                        <option value="">Update</option>
                        {NEXT_STATUS[order.orderStatus].map((status) => (
                          <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                        ))}
                      </select>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};
