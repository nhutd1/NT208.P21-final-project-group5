import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [newReply, setNewReply] = useState({ reviewId: '', content: '' });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data.product);
      setReviews(response.data.reviews);
      setError('');
    } catch (error) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchProduct();
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      setError('Failed to submit review');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews/${newReply.reviewId}/replies`,
        { content: newReply.content },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchProduct();
      setNewReply({ reviewId: '', content: '' });
    } catch (error) {
      setError('Failed to submit reply');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        <div>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div className="mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="mt-4 text-gray-500">{product.description}</p>
          <div className="mt-4 flex items-center">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            <div className="ml-4 flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-600">
                {product.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        
        <form onSubmit={handleReviewSubmit} className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Review
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-8">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">{review.rating}</span>
                  <span className="ml-4 text-sm text-gray-500">
                    by {review.userId.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>

              <div className="mt-4 space-y-4">
                {review.replies.map((reply) => (
                  <div key={reply._id} className="ml-8 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {reply.userId.username}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{reply.content}</p>
                  </div>
                ))}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNewReply({ ...newReply, reviewId: review._id });
                    handleReplySubmit(e);
                  }}
                  className="ml-8"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReply.reviewId === review._id ? newReply.content : ''}
                      onChange={(e) => setNewReply({ reviewId: review._id, content: e.target.value })}
                      placeholder="Write a reply..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 