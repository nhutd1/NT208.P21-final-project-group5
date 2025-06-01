// src/components/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý upload ảnh
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      // Upload file lên backend
      const res = await axios.post('http://localhost:3001/api/upload-image', data);
      setFormData({ ...formData, imageUrl: res.data.url });
      setError('');
    } catch (err) {
      setError('Không upload được ảnh');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate frontend:
    if (!formData.title.trim() || formData.title.length < 3) {
      return setError('Tên sản phẩm phải có ít nhất 3 ký tự.');
    }
    if (!formData.description.trim()) {
      return setError('Mô tả không được để trống.');
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      return setError('Giá phải là số lớn hơn 0.');
    }
    if (!formData.category.trim()) {
      return setError('Vui lòng chọn danh mục.');
    }
    // Không bắt buộc ảnh, nhưng có thể thêm kiểm tra nếu muốn:
    // if (!formData.imageUrl) return setError('Vui lòng chọn ảnh sản phẩm.');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return navigate('/login');
      }
      await axios.post(
        'http://localhost:3001/api/products',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Đã thêm sản phẩm thành công!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Thêm sản phẩm mới</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Tên sản phẩm
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Giá (VNĐ)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            min="0"
            step="1000"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Upload ảnh */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Ảnh sản phẩm
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="mt-1 block"
          />
          {uploading && <p className="text-sm text-gray-500">Đang upload...</p>}
          {formData.imageUrl && (
            <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover mt-2" />
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Danh mục
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Chọn danh mục</option>
            <option value="electronics">Điện tử</option>
            <option value="smartphones">Điện thoại</option>
            <option value="accessories">Phụ kiện</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={uploading}
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
