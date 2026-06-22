const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

const getErrorMessage = (payload, fallback) => {
  const validationErrors = payload?.errors || (Array.isArray(payload?.data) ? payload.data : null);
  if (validationErrors?.length) {
    return validationErrors.map((error) => error.message || error).join(', ');
  }

  return payload?.message || fallback;
};

export const apiRequest = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...options.headers }
    : { 'Content-Type': 'application/json', ...options.headers };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    const error = new Error(getErrorMessage(payload, 'Request failed. Please try again.'));
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? payload;
};

const toNumber = (value, fallback = 0) => {
  if (value && typeof value === 'object' && '$numberDecimal' in value) {
    return Number(value.$numberDecimal);
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const toCategoryName = (category) => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  return category.name || category.title || category.slug || 'Uncategorized';
};

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('assets/')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
};

export const normalizeProduct = (product) => {
  const rawImages = product.images || [];
  const images = rawImages.map(resolveImageUrl).filter(Boolean);

  return {
    id: product._id || product.id,
    name: product.name,
    slug: product.slug,
    category: toCategoryName(product.category),
    categoryId: product.category?._id || product.categoryId || (typeof product.category === 'string' ? product.category : ''),
    description: product.description,
    price: toNumber(product.price),
    originalPrice: product.originalPrice ? toNumber(product.originalPrice) : null,
    currency: product.currency || 'INR',
    material: product.material,
    rating: toNumber(product.rating, 0),
    reviews: toNumber(product.reviews, 0),
    image: images[0] || resolveImageUrl(product.image) || 'assets/images/products/desk-organizer.png',
    images,
    rawImages,
    inStock: product.inStock ?? product.inventoryQuantity > 0,
    isActive: product.isActive ?? true,
    badge: product.badge || null,
    inventoryQuantity: product.inventoryQuantity,
    sku: product.sku,
    specs: product.specs || {},
  };
};

export { resolveImageUrl };

export const normalizeCategory = (category) => ({
  id: category._id || category.id,
  name: category.name,
  slug: category.slug,
  description: category.description || '',
  isActive: category.isActive ?? true,
});

export const normalizeCart = (cart) => {
  if (!cart?.items) return [];

  return cart.items
    .filter((item) => item.product)
    .map((item) => {
      const product = normalizeProduct(item.product);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: item.quantity,
      };
    });
};

export const authApi = {
  login: (email, password) =>
    apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: ({ name, email, password, phone }) =>
    apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    }),
  verifyEmail: (token) =>
    apiRequest('/users/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email) =>
    apiRequest('/users/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  logout: () =>
    apiRequest('/users/logout', {
      method: 'POST',
    }),
};

export const productApi = {
  getAll: async () => {
    const products = await apiRequest('/products');
    return products.map(normalizeProduct);
  },
  create: (formData) =>
    apiRequest('/products', {
      method: 'POST',
      body: formData,
    }),
  update: (id, formData) =>
    apiRequest(`/products/${id}`, {
      method: 'PATCH',
      body: formData,
    }),
  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),
};

export const categoryApi = {
  getAll: async () => {
    const categories = await apiRequest('/categories');
    return categories.map(normalizeCategory);
  },
  create: (category) =>
    apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  update: (id, category) =>
    apiRequest(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(category),
    }),
  delete: (id) =>
    apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    }),
};

export const cartApi = {
  get: async () => normalizeCart(await apiRequest('/cart')),
  add: async (productId, quantity = 1) =>
    normalizeCart(
      await apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }),
    ),
  sync: async (items) =>
    normalizeCart(
      await apiRequest('/cart', {
        method: 'PUT',
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.qty,
          })),
        }),
      }),
    ),
  update: async (productId, quantity) =>
    normalizeCart(
      await apiRequest('/cart', {
        method: 'PATCH',
        body: JSON.stringify({ productId, quantity }),
      }),
    ),
  remove: async (productId) =>
    normalizeCart(
      await apiRequest(`/cart/${productId}`, {
        method: 'DELETE',
      }),
    ),
  clear: async () => {
    await apiRequest('/cart', { method: 'DELETE' });
    return [];
  },
};

export const customQuoteApi = {
  submit: (quote) =>
    apiRequest('/custom-quotes', {
      method: 'POST',
      body: JSON.stringify(quote),
    }),
};

export const contactApi = {
  submit: (message) =>
    apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(message),
    }),
};

export const checkoutApi = {
  submit: ({ shippingAddress, paymentMethod }) =>
    apiRequest('/checkout', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentMethod }),
    }),
};

export const normalizeUser = (user) => ({
  id: user._id || user.id,
  name: user.name || '',
  email: user.email || '',
  phone: user.phone || '',
  role: user.role || 'user',
  isBlocked: user.isBlocked ?? false,
  address: {
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    country: user.address?.country || 'India',
    pincode: user.address?.pincode || '',
  },
  createdAt: user.createdAt,
});

export const normalizeOrder = (order) => ({
  id: order._id || order.id,
  orderNumber: order.orderNumber,
  user: order.user
    ? (typeof order.user === 'object' ? normalizeUser(order.user) : { id: order.user })
    : null,
  items: (order.items || []).map((item) => ({
    quantity: item.quantity,
    priceAtPurchase: toNumber(item.priceAtPurchase),
    product: item.product ? normalizeProduct(item.product) : null,
  })),
  totalAmount: toNumber(order.totalAmount),
  shippingAddress: order.shippingAddress || {},
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  createdAt: order.createdAt,
});

export const normalizeWishlist = (wishlist) =>
  (wishlist?.products || [])
    .filter(Boolean)
    .map((product) => normalizeProduct(product));

export const normalizeContact = (contact) => ({
  id: contact._id || contact.id,
  name: contact.name || '',
  email: contact.email || '',
  subject: contact.subject || 'general',
  message: contact.message || '',
  adminReply: contact.adminReply || '',
  status: contact.status === 'read' ? 'pending' : (contact.status || 'pending'),
  createdAt: contact.createdAt,
});

export const normalizeCustomQuote = (quote) => ({
  id: quote._id || quote.id,
  name: quote.name || '',
  email: quote.email || '',
  phone: quote.phone || '',
  quantity: quote.quantity ?? 1,
  description: quote.description || '',
  material: quote.material || '',
  color: quote.color || '',
  quotedPrice: quote.quotedPrice ?? null,
  adminNotes: quote.adminNotes || '',
  status: quote.status || 'pending',
  createdAt: quote.createdAt,
});

export const userApi = {
  getProfile: async () => normalizeUser(await apiRequest('/users/me')),
  updateProfile: async (payload) =>
    normalizeUser(
      await apiRequest('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    ),
};

export const orderApi = {
  getMyOrders: async () => {
    const orders = await apiRequest('/orders/my-orders');
    return orders.map(normalizeOrder);
  },
  cancel: async (orderId) =>
    normalizeOrder(await apiRequest(`/orders/${orderId}/cancel`, { method: 'PATCH' })),
};

export const wishlistApi = {
  get: async () => normalizeWishlist(await apiRequest('/wishlist')),
  add: async (productId) => normalizeWishlist(await apiRequest('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })),
  remove: async (productId) =>
    normalizeWishlist(await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' })),
};

export const adminApi = {
  getDashboard: () => apiRequest('/admin/dashboard'),
  getOrders: async ({ page = 1, limit = 10, orderStatus, paymentStatus, search } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (orderStatus) params.set('orderStatus', orderStatus);
    if (paymentStatus) params.set('paymentStatus', paymentStatus);
    if (search) params.set('search', search);

    const data = await apiRequest(`/admin/orders?${params}`);
    return {
      orders: (data.orders || []).map(normalizeOrder),
      pagination: data.pagination || {},
    };
  },
  getOrderById: async (orderId) => normalizeOrder(await apiRequest(`/admin/orders/${orderId}`)),
  updateOrderStatus: async (orderId, orderStatus) =>
    normalizeOrder(
      await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ orderStatus }),
      }),
    ),
  getUsers: async () => {
    const users = await apiRequest('/admin/users');
    return users.map(normalizeUser);
  },
  getUserById: async (userId) => normalizeUser(await apiRequest(`/admin/users/${userId}`)),
  updateUser: async (userId, payload) =>
    normalizeUser(
      await apiRequest(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    ),
  deleteUser: async (userId) => apiRequest(`/admin/users/${userId}`, { method: 'DELETE' }),
  blockUser: async (userId) =>
    normalizeUser(await apiRequest(`/admin/users/${userId}/block`, { method: 'PATCH' })),
  unblockUser: async (userId) =>
    normalizeUser(await apiRequest(`/admin/users/${userId}/unblock`, { method: 'PATCH' })),
  getContacts: async ({ page = 1, limit = 10, status, search } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    if (search) params.set('search', search);

    const data = await apiRequest(`/admin/contacts?${params}`);
    return {
      contacts: (data.contacts || []).map(normalizeContact),
      pagination: data.pagination || {},
    };
  },
  updateContactStatus: async (contactId, payload) =>
    normalizeContact(
      await apiRequest(`/admin/contacts/${contactId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    ),
  deleteContact: async (contactId) => apiRequest(`/admin/contacts/${contactId}`, { method: 'DELETE' }),
  getCustomQuotes: async ({ page = 1, limit = 10, status, search } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    if (search) params.set('search', search);

    const data = await apiRequest(`/admin/custom-quotes?${params}`);
    return {
      quotes: (data.quotes || []).map(normalizeCustomQuote),
      pagination: data.pagination || {},
    };
  },
  updateCustomQuoteStatus: async (quoteId, payload) =>
    normalizeCustomQuote(
      await apiRequest(`/admin/custom-quotes/${quoteId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    ),
  deleteCustomQuote: async (quoteId) =>
    apiRequest(`/admin/custom-quotes/${quoteId}`, { method: 'DELETE' }),
};
