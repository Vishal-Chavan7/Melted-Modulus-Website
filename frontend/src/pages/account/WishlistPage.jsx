import { HiOutlineHeart, HiOutlineShoppingCart, HiOutlineTrash } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { resolveImageUrl } from '../../services/api';

export const WishlistPage = () => {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  if (loading) {
    return <p className="account-loading">Loading wishlist...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="account-panel account-panel--empty">
        <HiOutlineHeart size={48} aria-hidden="true" />
        <h2>Your wishlist is empty</h2>
        <p>Save products you love and come back to them anytime.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="account-panel">
      <div className="account-panel__header">
        <h2>Wishlist</h2>
        <p>{items.length} saved product{items.length === 1 ? '' : 's'}</p>
      </div>

      <div className="wishlist-grid">
        {items.map((product) => (
          <article key={product.id} className="wishlist-card">
            <div className="wishlist-card__image">
              <img src={resolveImageUrl(product.image)} alt={product.name} />
            </div>
            <div className="wishlist-card__body">
              <span className="card-product__category">{product.category}</span>
              <h4>{product.name}</h4>
              <p className="wishlist-card__price">{formatPrice(product.price)}</p>
              <div className="wishlist-card__actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => addItem(product)}>
                  <HiOutlineShoppingCart className="ri-icon" aria-hidden="true" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <HiOutlineTrash aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
