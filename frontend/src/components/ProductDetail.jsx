import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm.jsx';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revLoading, setRevLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    setRevLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/api/products/${id}/reviews`);
      setReviews(res.data.reviews || res.data); // Hỗ trợ cả dạng { reviews } và []
    } catch (err) {
      setReviews([]);
    } finally {
      setRevLoading(false);
    }
  };

  // Tính điểm trung bình
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return <div className="flex items-center justify-center h-80 text-gray-500">Đang tải sản phẩm...</div>;
  if (!product) return <div className="text-center py-16 text-red-500">Không tìm thấy sản phẩm!</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
      {/* Ảnh lớn, flex responsive */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={product.imageUrl || 'https://placehold.co/340x340'}
          alt={product.title}
          className="w-64 h-64 md:w-80 md:h-80 rounded-xl object-contain shadow bg-white border"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-700">{product.title}</h2>
        <div className="mb-3 flex gap-2 items-center">
          {avgRating && (
            <span className="inline-flex items-center text-yellow-400 font-bold text-lg">
              {avgRating} <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-1"><path d="M12 17.75l-6.172 3.67 1.637-7.034L2 9.923l7.095-.611L12 3.5l2.905 5.812L22 9.923l-5.465 4.463 1.637 7.034z"/></svg>
            </span>
          )}
          {!avgRating && <span className="text-gray-400">Chưa có đánh giá</span>}
        </div>
        <p className="text-xl font-bold text-gray-800 mb-2">{Number(product.price).toLocaleString()} VNĐ</p>
        <div className="mb-6 text-gray-700">{product.description}</div>
        <div className="text-sm text-gray-400 mb-8">Danh mục: {product.category}</div>
        <Link
          to="/"
          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 text-sm font-semibold mb-4"
        >← Về trang chủ</Link>
      </div>
      {/* Mobile: ảnh trên, mô tả dưới */}

      {/* Đánh giá */}
      <div className="w-full mt-10 md:mt-0 md:ml-8 md:w-1/2">
        <h3 className="text-xl font-bold mb-3 text-blue-800">Đánh giá sản phẩm</h3>
        <div className="mb-5">
          {revLoading ? (
            <div className="text-gray-400">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-400">Chưa có đánh giá nào.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r._id} className="p-4 rounded-xl bg-gray-50 border shadow-sm">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <svg key={idx} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.75l-6.172 3.67 1.637-7.034L2 9.923l7.095-.611L12 3.5l2.905 5.812L22 9.923l-5.465 4.463 1.637 7.034z"/></svg>
                    ))}
                    <span className="ml-2 font-semibold text-sm text-gray-700">{r.userId?.username || 'User'}</span>
                  </div>
                  <div className="text-gray-800">{r.comment}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ReviewForm productId={id} onNewReview={fetchReviews} />
      </div>
    </div>
  );
}
