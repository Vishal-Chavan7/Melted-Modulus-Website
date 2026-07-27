import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineChevronLeft,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiStar,
  HiOutlineStar,
  HiOutlineHeart,
  HiHeart,
  HiOutlineMinus,
  HiOutlinePlus,
} from 'react-icons/hi2';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, generateStars } from '../utils/helpers';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find(p => p.id === id || p._id === id);

  if (loading) {
    return (
      <div className="pdp-loading">
        <div className="pdp-loading__spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-empty">
        <h2>Product not found</h2>
        <p style={{ color: 'var(--clr-text-secondary)', margin: 'var(--space-4) 0' }}>
          This product may have been removed or the link is invalid.
        </p>
        <Link to="/products" className="btn btn-primary">← Back to Products</Link>
      </div>
    );
  }

  const saved = isInWishlist(product.id);
  const stars = generateStars(product.rating);

  const handleWishlist = async () => {
    if (!isLoggedIn) { openAuthModal(); return; }
    try { await toggleWishlist(product); } catch (err) { console.error(err); }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <section className="pdp">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="pdp__breadcrumb">
            <button className="pdp__back" onClick={() => navigate(-1)}>
              <HiOutlineChevronLeft aria-hidden="true" />
              <span>Back</span>
            </button>
            <div className="pdp__breadcrumb-trail">
              <Link to="/">Home</Link>
              <span className="pdp__breadcrumb-sep">/</span>
              <Link to="/products">Products</Link>
              <span className="pdp__breadcrumb-sep">/</span>
              <span className="pdp__breadcrumb-current">{product.name}</span>
            </div>
          </nav>

          <div className="pdp__grid">
            {/* Image Section */}
            <div className="pdp__image-section">
              <div className="pdp__image-main">
                {product.badge && (
                  <span className={`badge ${product.badge === 'New' ? 'badge-accent' : product.badge === 'Premium' ? 'badge-warm' : 'badge-brand'}`} style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                    {product.badge}
                  </span>
                )}
                <img src={product.image} alt={product.name} />
              </div>
            </div>

            {/* Info Section */}
            <div className="pdp__info">
              <span className="pdp__category">{product.category}</span>
              <h1 className="pdp__title">{product.name}</h1>

              {/* Rating */}
              <div className="pdp__rating">
                <div className="stars">
                  {stars.map((star, i) =>
                    star === 'empty'
                      ? <HiOutlineStar key={i} className="star star-empty" aria-hidden="true" />
                      : <HiStar key={i} className={`star ${star === 'half' ? 'star-half' : ''}`} aria-hidden="true" />
                  )}
                </div>
                <span className="pdp__rating-count">{product.rating} ({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="pdp__price-block">
                <span className="pdp__price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="pdp__price-original">{formatPrice(product.originalPrice)}</span>
                    <span className="pdp__price-discount">{discount}% off</span>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="pdp__description">{product.description}</p>
              )}

              {/* Specs */}
              <div className="pdp__specs">
                {product.material && (
                  <div className="pdp__spec">
                    <span className="pdp__spec-label">Material</span>
                    <span className="pdp__spec-value">{product.material}</span>
                  </div>
                )}
                {product.category && (
                  <div className="pdp__spec">
                    <span className="pdp__spec-label">Category</span>
                    <span className="pdp__spec-value">{product.category}</span>
                  </div>
                )}
              </div>

              {/* Quantity + Add to Cart */}
              <div className="pdp__actions">
                <div className="pdp__qty">
                  <button
                    className="pdp__qty-btn"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <HiOutlineMinus aria-hidden="true" />
                  </button>
                  <span className="pdp__qty-value">{qty}</span>
                  <button
                    className="pdp__qty-btn"
                    onClick={() => setQty(q => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <HiOutlinePlus aria-hidden="true" />
                  </button>
                </div>

                <button
                  className={`btn btn-primary btn-lg pdp__add-to-cart ${addedToCart ? 'added' : ''}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? '✓ Added!' : 'Add to Cart'}
                </button>

                <button
                  className={`pdp__wishlist-btn ${saved ? 'active' : ''}`}
                  onClick={handleWishlist}
                  aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {saved ? <HiHeart aria-hidden="true" /> : <HiOutlineHeart aria-hidden="true" />}
                </button>
              </div>

              {/* Trust badges */}
              <div className="pdp__trust">
                <div className="pdp__trust-item">
                  <HiOutlineTruck aria-hidden="true" />
                  <span>Free shipping on ₹2,000+</span>
                </div>
                <div className="pdp__trust-item">
                  <HiOutlineShieldCheck aria-hidden="true" />
                  <span>Quality guaranteed</span>
                </div>
                <div className="pdp__trust-item">
                  <HiOutlineArrowPath aria-hidden="true" />
                  <span>7-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
