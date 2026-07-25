import { useState, useEffect } from 'react';
import { productApi } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const backendProducts = await productApi.getAll();
        if (!isMounted) return;
        setProducts(backendProducts);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load backend products:', err);
        setProducts([]);
        setError(err.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
};
