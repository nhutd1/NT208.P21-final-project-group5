// src/components/ReviewForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

toast.success('Đăng ký thành công!');
toast.error('Đăng nhập thất bại!');
export default function ReviewForm({ productId, onNewReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Nếu chưa có token => redirect về login
      return navigate('/login');
    }

    try {
      // Gửi POST lên server với header Authorization
      await axios.post(
        'http://localhost:3001/api/reviews',
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Nếu gửi thành công, xóa form, gọi callback để reload lại danh sách review
      setComment('');
      setRating(5);
      setError('');
      onNewReview();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Server trả về 401: chưa đăng nhập hoặc token hết hạn
        return navigate('/login');
      }
      // Bất kỳ lỗi nào khác
      setError('Đã có lỗi xảy ra, vui lòng thử lại sau.');
      console.error('Lỗi khi gửi review:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 max-w-md">
      {error && (
        <div className="mb-2 text-red-600">
          {error}
        </div>
      )}
      <div className="mb-2">
        <label className="block mb-1 font-medium">Điểm:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} sao
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-medium">Nhận xét:</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Chia sẻ cảm nhận của bạn..."
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Gửi đánh giá
      </button>
    </form>
  );
}
