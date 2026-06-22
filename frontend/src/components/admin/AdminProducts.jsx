import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2';
import { AdminModal } from './AdminModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { productApi, resolveImageUrl } from '../../services/api';
import { useCategories } from '../../hooks/useCategories';
import { formatPrice } from '../../utils/helpers';

const emptyForm = {
  name: '',
  description: '',
  material: '',
  price: '',
  category: '',
  inventoryQuantity: 0,
  sku: '',
  isActive: true,
};

const buildFormData = (form, imageFiles, existingImages) => {
  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });
  imageFiles.forEach((file) => formData.append('images', file));
  if (existingImages.length > 0) {
    formData.append('existingImages', JSON.stringify(existingImages));
  }
  return formData;
};

export const AdminProducts = () => {
  const { categories } = useCategories({ includeInactive: true });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
    || product.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setForm(emptyForm);
    setImageFiles([]);
    setExistingImages([]);
    setEditingId(null);
    setFormError('');
  };

  const openCreate = () => {
    resetForm();
    setForm({ ...emptyForm, category: categories[0]?.id || '' });
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      material: product.material || '',
      price: product.price,
      category: product.categoryId || '',
      inventoryQuantity: product.inventoryQuantity ?? 0,
      sku: product.sku || '',
      isActive: product.isActive !== false,
    });
    setExistingImages(product.rawImages || []);
    setImageFiles([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    try {
      await productApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    setImageFiles((prev) => [...prev, ...files].slice(0, 5));
    event.target.value = '';
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingId && imageFiles.length === 0) {
      setFormError('At least one product image is required.');
      return;
    }
    if (editingId && imageFiles.length === 0 && existingImages.length === 0) {
      setFormError('At least one product image is required.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      const payload = buildFormData(form, imageFiles, existingImages);
      if (editingId) {
        await productApi.update(editingId, payload);
      } else {
        await productApi.create(payload);
      }
      setIsModalOpen(false);
      resetForm();
      await loadProducts();
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
          <h1>Products</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-small)' }}>
            Manage store products, pricing, and inventory.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={openCreate}>
          + Add Product
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>All Products ({filtered.length})</h3>
          <input
            type="search"
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '240px' }}
          />
        </div>

        {loading ? (
          <p className="admin-loading">Loading products...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-table__product">
                      <div className="admin-table__product-img">
                        {product.image && <img src={resolveImageUrl(product.image)} alt={product.name} />}
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.sku}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.inventoryQuantity ?? 0}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'status-badge--active' : ''}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" title="Edit" onClick={() => openEdit(product)} aria-label="Edit product">
                        <HiOutlinePencil aria-hidden="true" />
                      </button>
                      <button type="button" className="delete" title="Delete" onClick={() => setDeleteTarget(product)} aria-label="Delete product">
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
        <AdminModal title={editingId ? 'Edit Product' : 'Add Product'} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            {formError && <p className="admin-error">{formError}</p>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="product-name">Name</label>
                <input id="product-name" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-sku">SKU</label>
                <input id="product-sku" className="form-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="product-description">Description</label>
              <textarea id="product-description" className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="product-material">Material</label>
                <input id="product-material" className="form-input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-category">Category</label>
                <select id="product-category" className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="product-price">Price (INR)</label>
                <input id="product-price" type="number" min="0" step="0.01" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-stock">Stock</label>
                <input id="product-stock" type="number" min="0" className="form-input" value={form.inventoryQuantity} onChange={(e) => setForm({ ...form, inventoryQuantity: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="product-images">Product Images (max 5)</label>
              <input id="product-images" type="file" accept="image/*" multiple onChange={handleImageChange} />
              <div className="admin-image-preview-grid">
                {existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="admin-image-preview">
                    <img src={resolveImageUrl(image)} alt="" />
                    <button type="button" onClick={() => removeExistingImage(index)} aria-label="Remove image">
                      <HiOutlineXMark aria-hidden="true" />
                    </button>
                    <span className="admin-image-preview__label">Saved</span>
                  </div>
                ))}
                {imageFiles.map((file, index) => (
                  <div key={`new-${index}`} className="admin-image-preview">
                    <img src={URL.createObjectURL(file)} alt="" />
                    <button type="button" onClick={() => removeNewImage(index)} aria-label="Remove image">
                      <HiOutlineXMark aria-hidden="true" />
                    </button>
                    <span className="admin-image-preview__label">New</span>
                  </div>
                ))}
              </div>
            </div>
            <label className="form-checkbox">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Active product
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
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
        title="Delete this product?"
        message={deleteTarget ? `"${deleteTarget.name}" will be permanently removed from the store.` : ''}
        confirmLabel="Delete Product"
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
