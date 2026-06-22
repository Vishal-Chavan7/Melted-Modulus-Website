import { useCallback, useEffect, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import { adminApi } from '../../services/api';
import { ConfirmDialog } from '../common/ConfirmDialog';

const SUBJECT_LABELS = {
  general: 'General',
  product: 'Product',
  custom: 'Custom Print',
  shipping: 'Shipping',
  feedback: 'Feedback',
  other: 'Other',
};

const STATUS_LABELS = {
  pending: 'Pending',
  read: 'Read',
  replied: 'Replied',
};

export const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 1, status: '', search: '' });
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getContacts({
        page: filters.page,
        limit: 10,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      setContacts(data.contacts);
      setPagination(data.pagination);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleStatusChange = async (contactId, status) => {
    setUpdatingId(contactId);
    try {
      await adminApi.updateContactStatus(contactId, status);
      await loadContacts();
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
      await adminApi.deleteContact(deleteTarget.id);
      setDeleteTarget(null);
      await loadContacts();
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
          <h1>Contact Messages</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-small)' }}>
            {pagination.totalContacts ?? 0} messages received
          </p>
        </div>
      </div>

      <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
        <input
          type="search"
          name="search"
          placeholder="Search by name, email, or message..."
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
        <p className="admin-loading">Loading contact messages...</p>
      ) : contacts.length === 0 ? (
        <div className="admin-empty">No contact messages found.</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <strong>{contact.name}</strong>
                    <div className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{contact.email}</div>
                  </td>
                  <td>{SUBJECT_LABELS[contact.subject] || contact.subject}</td>
                  <td className="admin-table__message">{contact.message}</td>
                  <td>
                    {new Date(contact.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <select
                      className="form-input"
                      value={contact.status}
                      disabled={updatingId === contact.id}
                      onChange={(event) => handleStatusChange(contact.id, event.target.value)}
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
                        title="Delete message"
                        aria-label={`Delete message from ${contact.name}`}
                        onClick={() => setDeleteTarget(contact)}
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
        title="Delete this message?"
        message={deleteTarget ? `The message from ${deleteTarget.name} will be permanently removed.` : ''}
        confirmLabel="Delete Message"
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
