// src/components/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm.jsx'; // Chú ý tên file .jsx

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revLoading, setRevLoading] = useState(true);

  // 1. Fetch thông tin sản phẩm
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error('Lỗi khi fetch product:', err);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });

    // 2. Fetch danh sách review
    fetchReviews();
  }, [id]);

  // Hàm này fetch review từ server
  const fetchReviews = async () => {
    setRevLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/api/products/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error('Lỗi khi fetch reviews:', err);
      setReviews([]);
    } finally {
      setRevLoading(false);
    }
  };

  if (loading) return <div className="p-4">Đang tải sản phẩm...</div>;
  if (!product) return <div className="p-4">Không tìm thấy sản phẩm!</div>;

  // Tính điểm trung bình
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-64 h-64 object-cover rounded mx-auto"
      />
      <h2 className="text-2xl font-bold mt-4 mb-2">{product.title}</h2>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="mb-2">
        <span className="font-semibold">Giá:</span> {product.price.toLocaleString()} VNĐ
      </p>
      <p className="mb-4">
        <span className="font-semibold">Điểm trung bình:</span>{' '}
        {avgRating ? `${avgRating} ⭐` : 'Chưa có'}
      </p>

      {/* Hiển thị danh sách review */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Danh sách đánh giá:</h3>
        {revLoading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border rounded p-3 mb-2">
              <p>
                <b>{r.rating} ⭐</b> – {r.comment}
              </p>
              <p className="text-sm text-gray-500">
                {r.userId?.username || 'User'} –{' '}
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Form để người dùng gửi review */}
      <div className="mt-8">
        <ReviewForm productId={id} onNewReview={fetchReviews} />
      </div>
    </div>
  );
}
