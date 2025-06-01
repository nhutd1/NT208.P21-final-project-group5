// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3001/api/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Lọc sản phẩm theo search và hãng
  const filtered = products.filter(
    p =>
      (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filter || p.category === filter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Banner kiểu Shopee/Tiki */}
      <div className="rounded-xl overflow-hidden shadow mb-10 relative h-40 md:h-56 bg-gradient-to-r from-blue-600 via-sky-400 to-purple-500 flex items-center">
        <img
          src="/phone-banner.png"
          className="absolute right-0 h-40 md:h-56 top-0 object-contain opacity-40 pointer-events-none select-none hidden md:block"
          alt="banner"
        />
        <div className="relative z-10 px-6 md:px-16">
          <div className="text-2xl md:text-4xl font-bold text-white drop-shadow">Nền tảng Đánh Giá Điện Thoại Uy Tín</div>
          <div className="text-white text-sm md:text-lg mt-2 drop-shadow">Chia sẻ cảm nhận, lựa chọn sản phẩm tốt nhất từ cộng đồng.</div>
        </div>
      </div>

      {/* Thanh search & filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 w-full md:w-80 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 w-full md:w-52 shadow-sm bg-white"
        >
          <option value="">Tất cả hãng</option>
          {Array.from(new Set(products.map(p => p.category))).map(
            cat => <option key={cat} value={cat}>{cat}</option>
          )}
        </select>
      </div>

      {/* Sản phẩm */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          )}
          {filtered.map(product => (
            <div
              key={product._id}
              className="group card flex flex-col items-center p-6 hover:shadow-2xl border border-gray-100 bg-white rounded-2xl relative transition-all duration-200 hover:-translate-y-1 hover:border-blue-400"
            >
              <img
                src={product.imageUrl || 'https://placehold.co/220x220'}
                alt={product.title}
                className="w-32 h-32 object-contain rounded-xl mb-4 bg-gradient-to-tr from-blue-50 via-white to-pink-50 group-hover:scale-105 transition"
              />
              <div className="font-bold text-blue-800 text-lg text-center mb-1 group-hover:text-blue-600 transition">{product.title}</div>
              <div className="text-gray-900 mb-1 text-center font-semibold">{Number(product.price).toLocaleString()} VNĐ</div>
              <div className="text-xs text-gray-400 mb-3 capitalize">{product.category || 'Chưa rõ'}</div>
              <Link
                to={`/products/${product._id}`}
                className="mt-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl px-6 py-2 hover:from-blue-700 hover:to-blue-500 shadow font-medium text-sm transition"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
