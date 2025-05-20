import React, { useState } from 'react';
import axios from 'axios';

export default function ReviewForm({ productId, onNewReview }) {
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/reviews', {
        productId,
        rating,
        comment
      });
      setComment('');
      onNewReview();  // reload lại danh sách
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h3>Viết đánh giá</h3>
      <label>
        Điểm:
        <select value={rating} onChange={e => setRating(+e.target.value)}>
          {[1,2,3,4,5].map(n => (
            <option key={n} value={n}>{n} sao</option>
          ))}
        </select>
      </label>
      <br/>
      <textarea
        rows={3}
        cols={40}
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Nhận xét của bạn..."
        required
      />
      <br/>
      <button type="submit" disabled={loading}>
        {loading ? 'Đang gửi…' : 'Gửi đánh giá'}
      </button>
    </form>
  );
}
