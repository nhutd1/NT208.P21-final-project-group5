// src/hooks/useProductDetail.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading };
}
