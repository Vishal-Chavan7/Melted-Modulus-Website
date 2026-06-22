import { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../services/api';

export const useCategories = ({ includeInactive = false } = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(includeInactive ? data : data.filter((category) => category.isActive !== false));
      setError('');
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { categories, loading, error, reload };
};
