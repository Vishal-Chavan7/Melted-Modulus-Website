import { useState, useEffect } from 'react';
import productsData from '../assets/data/products.json';
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
        setProducts(backendProducts.length ? backendProducts : productsData);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load backend products:', err);
        setProducts(productsData);
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
