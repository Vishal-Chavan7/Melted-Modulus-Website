import { useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiMiniSignal, HiOutlineMinusCircle } from 'react-icons/hi2';
import { AdminModal } from './AdminModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { categoryApi } from '../../services/api';
import { useCategories } from '../../hooks/useCategories';

const emptyForm = {
  name: '',
  description: '',
  isActive: true,
};

export const AdminCategories = () => {
  const { categories, loading, error, reload } = useCategories({ includeInactive: true });
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive !== false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError('');
    try {
      await categoryApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        await categoryApi.update(editingId, form);
      } else {
        await categoryApi.create(form);
      }
      setIsModalOpen(false);
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-content__header">
        <div>
          <h1>Categories</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-small)' }}>
            Manage product categories for the store.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
          + Add Category
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {actionError && <p className="admin-error">{actionError}</p>}

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>All Categories ({filtered.length})</h3>
          <input
            type="search"
            className="form-input"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '240px' }}
          />
        </div>

        {loading ? (
          <p className="admin-loading">Loading categories...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description || '—'}</td>
                  <td>
                    <span className={`status-badge status-badge--icon ${category.isActive ? 'status-badge--active' : ''}`}>
                      {category.isActive ? (
                        <><HiMiniSignal aria-hidden="true" /> Active</>
                      ) : (
                        <><HiOutlineMinusCircle aria-hidden="true" /> Inactive</>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" title="Edit" onClick={() => openEdit(category)} aria-label="Edit category">
                        <HiOutlinePencil aria-hidden="true" />
                      </button>
                      <button type="button" className="delete" title="Delete" onClick={() => setDeleteTarget(category)} aria-label="Delete category">
                        <HiOutlineTrash aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <AdminModal title={editingId ? 'Edit Category' : 'Add Category'} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            {formError && <p className="admin-error">{formError}</p>}
            <div className="form-group">
              <label className="form-label" htmlFor="category-name">Name</label>
              <input
                id="category-name"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="category-description">Description</label>
              <textarea
                id="category-description"
                className="form-input"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active category
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete this category?"
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed.` : ''}
        confirmLabel="Delete Category"
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
