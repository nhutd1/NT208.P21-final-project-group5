// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useProducts(offset = 0, limit = 10) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/products?offset=${offset}&limit=${limit}`)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [offset, limit]);

  return { products, loading };
}
