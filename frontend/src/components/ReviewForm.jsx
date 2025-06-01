import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiStar, FiSend, FiLoader } from "react-icons/fi";

// Đổi API nếu cần cho backend public
const API_URL = "http://localhost:3001/api/reviews";

export default function ReviewForm({ productId, onNewReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate FE
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét!");
      setLoading(false);
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Điểm phải từ 1 đến 5!");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để đánh giá.");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }
      await axios.post(
        API_URL,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Gửi đánh giá thành công!");
      setComment("");
      setRating(5);
      if (onNewReview) onNewReview();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Hết phiên đăng nhập, vui lòng đăng nhập lại!");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error("Có lỗi xảy ra, thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-6 p-4 bg-slate-50 rounded-xl shadow space-y-3">
      <div>
        <label className="font-medium mb-2 block">Điểm đánh giá:</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              className={`text-2xl ${rating >= n ? "text-yellow-500" : "text-gray-300"} focus:outline-none`}
              tabIndex={0}
            >
              <FiStar />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-medium mb-2 block">Nhận xét của bạn:</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading && <FiLoader className="animate-spin" />}
          <FiSend />
          Gửi đánh giá
        </button>
      </div>
    </form>
  );
}
