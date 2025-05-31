    import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow p-4 flex flex-col gap-2 w-full max-w-xs mx-auto">
      <img
        src={product.image || 'https://via.placeholder.com/200x200?text=Product'}
        alt={product.name}
        className="rounded-xl h-48 object-cover mb-2"
      />
      <h3 className="font-semibold text-lg text-neutral-800 dark:text-white line-clamp-2">{product.name}</h3>
      <div className="text-primary font-bold text-xl">
        {product.price?.toLocaleString()} <span className="text-base font-normal">VNĐ</span>
      </div>
      <button className="mt-auto py-1 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Xem chi tiết</button>
    </div>
  );
}
