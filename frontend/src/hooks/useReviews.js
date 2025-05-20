import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useReviews(productId) {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(false);

  const fetchReviews = useCallback(() => {
    if (!productId) return;
    setLoading(true);
    axios.get(`http://localhost:3001/api/reviews?productId=${productId}`)
      .then(res => setReviews(res.data))
      .finally(() => setLoading(false));
  }, [productId]);

  // fetch khi productId thay đổi
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, reload: fetchReviews };
}
