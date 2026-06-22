import { useCallback, useEffect, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import { adminApi } from '../../services/api';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { AdminModal } from './AdminModal';

const STATUS_LABELS = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  quoted: 'Quoted',
  closed: 'Closed',
};

const STATUS_MODAL_COPY = {
  quoted: {
    title: 'Send quote to customer',
    description: 'Enter the quoted price. The customer will receive an email with these details.',
    showPrice: true,
    priceRequired: true,
  },
  closed: {
    title: 'Close quote request',
    description: 'Optionally add a note for the customer. They will receive a closure email.',
    showPrice: false,
    priceRequired: false,
  },
};

export const AdminCustomQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 1, status: '', search: '' });
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [statusForm, setStatusForm] = useState({ quotedPrice: '', adminNotes: '' });

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCustomQuotes({
        page: filters.page,
        limit: 10,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      setQuotes(data.quotes);
      setPagination(data.pagination);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleStatusChange = async (quoteId, status, extras = {}) => {
    setUpdatingId(quoteId);
    try {
      await adminApi.updateCustomQuoteStatus(quoteId, { status, ...extras });
      await loadQuotes();
      setError('');
    } catch (err) {
      setError(err.message);
      await loadQuotes();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusSelect = (quote, nextStatus) => {
    if (quote.status === nextStatus) return;

    if (nextStatus === 'quoted' || nextStatus === 'closed') {
      setStatusForm({
        quotedPrice: quote.quotedPrice != null ? String(quote.quotedPrice) : '',
        adminNotes: quote.adminNotes || '',
      });
      setStatusModal({ quote, nextStatus });
      return;
    }

    handleStatusChange(quote.id, nextStatus);
  };

  const closeStatusModal = () => {
    if (updatingId) return;
    setStatusModal(null);
    setStatusForm({ quotedPrice: '', adminNotes: '' });
  };

  const handleStatusModalSubmit = async (event) => {
    event.preventDefault();
    if (!statusModal) return;

    const { quote, nextStatus } = statusModal;
    const payload = {
      status: nextStatus,
      adminNotes: statusForm.adminNotes.trim() || undefined,
    };

    if (nextStatus === 'quoted') {
      const quotedPrice = Number(statusForm.quotedPrice);
      if (!Number.isFinite(quotedPrice) || quotedPrice < 0) {
        setError('Please enter a valid quoted price.');
        return;
      }
      payload.quotedPrice = quotedPrice;
    }

    await handleStatusChange(quote.id, nextStatus, payload);
    setStatusModal(null);
    setStatusForm({ quotedPrice: '', adminNotes: '' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteCustomQuote(deleteTarget.id);
      setDeleteTarget(null);
      await loadQuotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: String(formData.get('search') || '').trim(),
      status: String(formData.get('status') || ''),
    }));
  };

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1>Custom Quote Requests</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-small)' }}>
            {pagination.totalQuotes ?? 0} quote requests received
          </p>
        </div>
      </div>

      <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
        <input
          type="search"
          name="search"
          placeholder="Search by name, email, or description..."
          defaultValue={filters.search}
          className="form-input admin-toolbar__search"
        />
        <select name="status" defaultValue={filters.status} className="form-input admin-toolbar__select">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">Apply</button>
      </form>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="admin-loading">Loading custom quotes...</p>
      ) : quotes.length === 0 ? (
        <div className="admin-empty">No custom quote requests found.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Project Details</th>
                <th>Qty</th>
                <th>Material / Color</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id}>
                  <td>
                    <strong>{quote.name}</strong>
                    <div className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{quote.email}</div>
                    {quote.phone && (
                      <div className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{quote.phone}</div>
                    )}
                  </td>
                  <td className="admin-table__message">{quote.description}</td>
                  <td>{quote.quantity}</td>
                  <td>
                    {quote.material || '—'}
                    {quote.color && (
                      <div className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{quote.color}</div>
                    )}
                  </td>
                  <td>
                    {new Date(quote.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <select
                      className="form-input"
                      value={quote.status}
                      disabled={updatingId === quote.id}
                      onChange={(event) => handleStatusSelect(quote, event.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        type="button"
                        className="delete"
                        title="Delete quote request"
                        aria-label={`Delete quote request from ${quote.name}`}
                        onClick={() => setDeleteTarget(quote)}
                      >
                        <HiOutlineTrash aria-hidden="true" />
                      </button>
                    </div>
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete this quote request?"
        message={deleteTarget ? `The request from ${deleteTarget.name} will be permanently removed.` : ''}
        confirmLabel="Delete Request"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />

      {statusModal && (
        <AdminModal
          title={STATUS_MODAL_COPY[statusModal.nextStatus]?.title || 'Update quote status'}
          onClose={closeStatusModal}
        >
          <form className="admin-form" onSubmit={handleStatusModalSubmit}>
            <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
              {STATUS_MODAL_COPY[statusModal.nextStatus]?.description}
            </p>

            {STATUS_MODAL_COPY[statusModal.nextStatus]?.showPrice && (
              <label className="form-group">
                <span>Quoted price (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={statusForm.quotedPrice}
                  onChange={(event) =>
                    setStatusForm((prev) => ({ ...prev, quotedPrice: event.target.value }))
                  }
                  required
                />
              </label>
            )}

            <label className="form-group">
              <span>{statusModal.nextStatus === 'closed' ? 'Note for customer (optional)' : 'Notes (optional)'}</span>
              <textarea
                className="form-input"
                rows={4}
                value={statusForm.adminNotes}
                onChange={(event) =>
                  setStatusForm((prev) => ({ ...prev, adminNotes: event.target.value }))
                }
                placeholder="Add any details the customer should know..."
              />
            </label>

            <div className="admin-form__actions">
              <button type="button" className="btn btn-secondary" onClick={closeStatusModal} disabled={Boolean(updatingId)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={updatingId === statusModal.quote.id}>
                {updatingId === statusModal.quote.id ? 'Saving...' : 'Update & Notify Customer'}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
};
