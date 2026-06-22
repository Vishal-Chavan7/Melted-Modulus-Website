import { useCallback, useEffect, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import { adminApi } from '../../services/api';
import { ConfirmDialog } from '../common/ConfirmDialog';

const STATUS_LABELS = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  quoted: 'Quoted',
  closed: 'Closed',
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

  const handleStatusChange = async (quoteId, status) => {
    setUpdatingId(quoteId);
    try {
      await adminApi.updateCustomQuoteStatus(quoteId, status);
      await loadQuotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
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
                      onChange={(event) => handleStatusChange(quote.id, event.target.value)}
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
    </>
  );
};
