import React from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

export const FilterSidebar = ({ isOpen, onClose, filters, setFilters, categories = [] }) => {
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      categories: e.target.checked 
        ? [...prev.categories, value]
        : prev.categories.filter(c => c !== value)
    }));
  };

  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      materials: e.target.checked 
        ? [...prev.materials, value]
        : prev.materials.filter(m => m !== value)
    }));
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({ ...prev, price: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ categories: [], materials: [], price: 'all' });
  };

  return (
    <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`} id="filter-sidebar">
      <div className="filter-sidebar__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ margin: 0 }}>Filters</h3>
        <button 
          className="btn btn-icon d-md-none filter-close-btn" 
          onClick={onClose}
          aria-label="Close filters"
          style={{ display: isOpen ? 'flex' : 'none' }}
        >
          <HiOutlineXMark aria-hidden="true" />
        </button>
      </div>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        {(filters.categories.length > 0 || filters.materials.length > 0 || filters.price !== 'all') && (
          <button className="filter-sidebar__clear" onClick={clearFilters}>Clear All</button>
        )}
      </div>

      <div className="filter-group">
        <h4>Category</h4>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--text-sm)', margin: 0 }}>
            No categories available
          </p>
        ) : (
          categories.map((category) => (
            <label key={category.id} className="filter-option">
              <input
                type="checkbox"
                name="category"
                value={category.name}
                checked={filters.categories.includes(category.name)}
                onChange={handleCategoryChange}
              />
              {category.name}
            </label>
          ))
        )}
      </div>

      <div className="filter-group">
        <h4>Material</h4>
        <label className="filter-option">
          <input type="checkbox" name="material" value="PLA" checked={filters.materials.includes('PLA')} onChange={handleMaterialChange} />
          PLA
        </label>
        <label className="filter-option">
          <input type="checkbox" name="material" value="PETG" checked={filters.materials.includes('PETG')} onChange={handleMaterialChange} />
          PETG
        </label>
        <label className="filter-option">
          <input type="checkbox" name="material" value="TPU" checked={filters.materials.includes('TPU')} onChange={handleMaterialChange} />
          TPU
        </label>
      </div>

      <div className="filter-group">
        <h4>Price Range</h4>
        <label className="filter-option">
          <input type="radio" name="price" value="all" checked={filters.price === 'all'} onChange={handlePriceChange} />
          All Prices
        </label>
        <label className="filter-option">
          <input type="radio" name="price" value="0-1000" checked={filters.price === '0-1000'} onChange={handlePriceChange} />
          Under ₹1,000
        </label>
        <label className="filter-option">
          <input type="radio" name="price" value="1000-2500" checked={filters.price === '1000-2500'} onChange={handlePriceChange} />
          ₹1,000 – ₹2,500
        </label>
        <label className="filter-option">
          <input type="radio" name="price" value="2500-5000" checked={filters.price === '2500-5000'} onChange={handlePriceChange} />
          ₹2,500 – ₹5,000
        </label>
        <label className="filter-option">
          <input type="radio" name="price" value="5000+" checked={filters.price === '5000+'} onChange={handlePriceChange} />
          ₹5,000+
        </label>
      </div>
    </aside>
  );
};
