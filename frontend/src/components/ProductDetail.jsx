import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  // Chuyển reviews thành object chứa mảng + pagination
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    pagination: { total: 0, page: 1, limit: 5, totalPages: 1 }
  });
  const [loading, setLoading] = useState(true);
  const [revLoading, setRevLoading] = useState(true);

  // Lấy sản phẩm
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error('Lỗi khi fetch product:', err);
        setProduct(null);
      })
      .finally(() => setLoading(false));

    // Khi vào trang, fetch reviews trang 1
    fetchReviews(1);
  }, [id]);

  // Hàm fetchReviews nhận page làm tham số
  const fetchReviews = async (page = 1) => {
    setRevLoading(true);
    try {
      const limit = reviewsData.pagination.limit;
      const res = await axios.get(
        `http://localhost:3001/api/products/${id}/reviews?page=${page}&limit=${limit}`
      );
      // res.data = { reviews: [...], pagination: {...} }
      setReviewsData({
        reviews: res.data.reviews,
        pagination: res.data.pagination
      });
    } catch (err) {
      console.error('Lỗi khi fetch reviews:', err);
      // Nếu lỗi, reset về rỗng
      setReviewsData(prev => ({
        reviews: [],
        pagination: prev.pagination
      }));
    } finally {
      setRevLoading(false);
    }
  };

  if (loading) return <div className="p-4">Đang tải sản phẩm...</div>;
  if (!product) return <div className="p-4">Không tìm thấy sản phẩm!</div>;

  // Tính điểm trung bình (từ tất cả review trên DB, không chỉ page hiện tại)
  // Nếu bạn muốn trung bình chính xác, cần fetch total sum rating. Tạm lấy trung bình của các review trên page hiện tại:
  const avgRating = reviewsData.reviews.length
    ? (
        reviewsData.reviews.reduce((sum, r) => sum + r.rating, 0)
        / reviewsData.reviews.length
      ).toFixed(1)
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
        ) : reviewsData.reviews.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          reviewsData.reviews.map((r) => (
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

        {/* === Pagination controls === */}
        {!revLoading && reviewsData.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => fetchReviews(reviewsData.pagination.page - 1)}
              disabled={reviewsData.pagination.page <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {reviewsData.pagination.page} of {reviewsData.pagination.totalPages}
            </span>
            <button
              onClick={() => fetchReviews(reviewsData.pagination.page + 1)}
              disabled={reviewsData.pagination.page >= reviewsData.pagination.totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Form để người dùng gửi review */}
      <div className="mt-8">
        <ReviewForm productId={id} onNewReview={() => fetchReviews(1)} />
      </div>
    </div>
  );
}
