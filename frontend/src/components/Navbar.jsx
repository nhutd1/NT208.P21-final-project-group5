import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut, FiUserPlus, FiLogIn, FiPlusCircle, FiHome, FiSearch, FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Navbar({ onSearch }) {
  const token = localStorage.getItem("token");
  const [showMenu, setShowMenu] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Đã đăng xuất!");
    navigate("/login");
  };

  // Search chỉ hiển thị ở trang chủ
  const isHome = location.pathname === "/";

  const handleSearch = (e) => {
    setQ(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <nav className="bg-blue-700 text-white shadow px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between sticky top-0 z-20">
      <div className="flex items-center justify-between w-full md:w-auto">
        <NavLink
          to="/"
          className="font-bold text-xl tracking-wide flex items-center gap-2"
        >
          <FiHome className="text-2xl" />
          <span>Điện Thoại Review</span>
        </NavLink>
        <button
          className="md:hidden"
          onClick={() => setShowMenu((v) => !v)}
          aria-label="Mở menu"
        >
          <FiMenu className="text-2xl" />
        </button>
      </div>

      {/* Menu items */}
      <div className={`flex-col md:flex-row md:flex md:items-center md:gap-5 transition-all duration-200 ${showMenu ? "flex" : "hidden"} md:!flex`}>
        <NavLink
          to="/"
          className={({ isActive }) => `flex items-center gap-1 my-1 md:my-0 ${isActive ? "underline" : ""}`}
        >
          <FiHome /> Trang chủ
        </NavLink>
        <NavLink
          to="/add-product"
          className={({ isActive }) => `flex items-center gap-1 my-1 md:my-0 ${isActive ? "underline" : ""}`}
        >
          <FiPlusCircle /> Thêm sản phẩm
        </NavLink>
        {!token && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => `flex items-center gap-1 my-1 md:my-0 ${isActive ? "underline" : ""}`}
            >
              <FiLogIn /> Đăng nhập
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => `flex items-center gap-1 my-1 md:my-0 ${isActive ? "underline" : ""}`}
            >
              <FiUserPlus /> Đăng ký
            </NavLink>
          </>
        )}
        {token && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition my-1 md:my-0"
          >
            <FiLogOut /> Đăng xuất
          </button>
        )}
      </div>
      {/* Search bar */}
      {isHome && (
        <div className="mt-2 md:mt-0 md:ml-6 w-full md:w-72">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-black w-full"
              placeholder="Tìm kiếm điện thoại..."
              value={q}
              onChange={handleSearch}
            />
          </div>
        </div>
      )}
    </nav>
  );
}
