import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, id: null });
  const navigate = useNavigate();

  const isAdmin = () => localStorage.getItem("role") === "admin";

  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = () => {
    setLoading(true);
    axios.get("http://localhost:3001/api/products")
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa sản phẩm!");
      setModal({ show: false, id: null });
      fetchProducts();
    } catch (err) {
      toast.error("Không đủ quyền hoặc lỗi server!");
    }
  };

  if (!isAdmin())
    return (
      <div className="max-w-3xl mx-auto my-20 text-center text-red-500 font-bold">
        Bạn không có quyền truy cập trang quản lý sản phẩm.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <Link
          to="/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Thêm mới
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Ảnh</th>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Danh mục</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img
                      src={p.imageUrl || "https://placehold.co/50x50"}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded shadow"
                    />
                  </td>
                  <td className="px-4 py-2 font-bold">{p.title}</td>
                  <td className="px-4 py-2 text-blue-600">{Number(p.price).toLocaleString()} VNĐ</td>
                  <td className="px-4 py-2">{p.category}</td>
                  <td className="px-4 py-2 flex gap-2 items-center">
                    <button
                      onClick={() => navigate(`/edit-product/${p._id}`)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setModal({ show: true, id: p._id })}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal xác nhận xóa */}
          {modal.show && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <div className="text-lg font-bold mb-4">Bạn chắc chắn muốn xóa sản phẩm này?</div>
                <div className="flex gap-4 justify-center">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(modal.id)}
                  >
                    Xác nhận xóa
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setModal({ show: false, id: null })}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
