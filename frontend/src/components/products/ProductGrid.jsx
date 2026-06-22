import React from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import { ProductCard } from '../common/ProductCard';

export const ProductGrid = ({ products, filters, setFilters, clearFilters }) => {
  const getChips = () => {
    const chips = [];
    filters.categories.forEach(c => chips.push({ label: c, type: 'category', value: c }));
    filters.materials.forEach(m => chips.push({ label: m, type: 'material', value: m }));
    if (filters.price !== 'all') {
      chips.push({ 
        label: '₹' + filters.price.replace('-', '–').replace('+', '+'), 
        type: 'price', 
        value: filters.price 
      });
    }
    return chips;
  };

  const handleRemoveChip = (chip) => {
    if (chip.type === 'category') {
      setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== chip.value) }));
    } else if (chip.type === 'material') {
      setFilters(prev => ({ ...prev, materials: prev.materials.filter(m => m !== chip.value) }));
    } else if (chip.type === 'price') {
      setFilters(prev => ({ ...prev, price: 'all' }));
    }
  };

  const chips = getChips();

  if (products.length === 0) {
    return (
      <div className="product-grid product-grid--empty">
        <div>
          <div className="product-grid__empty-icon">
            <HiOutlineMagnifyingGlass size={48} aria-hidden="true" />
          </div>
          <h3 style={{ marginBottom: 'var(--space-3)' }}>No products found</h3>
          <p style={{ color: 'var(--clr-text-muted)' }}>Try adjusting your filters to find what you're looking for.</p>
          <button className="btn btn-secondary" onClick={clearFilters} style={{ marginTop: 'var(--space-4)' }}>
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="active-filters" id="active-filters">
        {chips.map((chip, idx) => (
          <button key={idx} className="active-filter-chip" onClick={() => handleRemoveChip(chip)}>
            {chip.label} <HiOutlineXMark className="ri-icon" aria-hidden="true" size={12} />
          </button>
        ))}
      </div>
      <div className="product-grid" id="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};
