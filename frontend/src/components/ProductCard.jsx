import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={product.imageUrl || 'https://via.placeholder.com/200'}
        alt={product.title}
        className="h-48 w-full object-cover rounded mb-3"
      />
      <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
      <p className="text-gray-700 font-bold mb-2">{product.price.toLocaleString()} VNĐ</p>
      <button className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Xem chi tiết
      </button>
    </div>
  );
}