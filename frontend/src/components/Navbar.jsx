// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem('token');
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Điện Thoại Review</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Trang chủ</Link>
        <Link to="/add" className="hover:underline">Thêm sản phẩm</Link>
        {!token
          ? <>
              <Link to="/login" className="hover:underline">Đăng nhập</Link>
              <Link to="/register" className="hover:underline">Đăng ký</Link>
            </>
          : <button
              className="hover:underline"
              onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
            >Đăng xuất</button>
        }
      </div>
    </nav>
  );
}
