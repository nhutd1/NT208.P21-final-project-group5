import { Link } from 'react-router-dom';

export default function ProductList({ products }) {
  if (!products || products.length === 0)
    return (
      <div className="flex flex-col items-center mt-16">
        {/* SVG hoặc icon rỗng */}
        <svg className="w-20 h-20 text-gray-300" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#d1d5db" strokeWidth="2"/><path d="M6 10.5L9 13L14 8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <p className="text-gray-500 mt-2">Chưa có sản phẩm nào</p>
      </div>
    );

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
      {products.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center"
        >
          <img
            src={p.imageUrl}
            alt={p.title}
            className="w-32 h-32 object-cover rounded-lg mb-3 shadow"
            loading="lazy"
          />
          <div className="font-semibold text-lg text-center">{p.title}</div>
          <div className="text-blue-600 font-bold mt-1 mb-3">
            {p.price.toLocaleString()} VNĐ
          </div>
          <Link
            to={`/products/${p._id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 transition"
          >
            Xem chi tiết
          </Link>
        </div>
      ))}
    </div>
  );
}