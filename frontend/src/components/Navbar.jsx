import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiUserPlus, FiLogIn, FiPlusCircle, FiHome } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Đã đăng xuất!");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white shadow flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <NavLink
          to="/"
          className="font-bold text-xl tracking-wide flex items-center gap-2"
        >
          <FiHome className="text-2xl" />
          <span>Điện Thoại Review</span>
        </NavLink>
      </div>
      <div className="flex gap-4 mt-2 md:mt-0 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-1 ${isActive ? "underline" : ""}`
          }
        >
          <FiHome /> Trang chủ
        </NavLink>
        <NavLink
          to="/add-product"
          className={({ isActive }) =>
            `flex items-center gap-1 ${isActive ? "underline" : ""}`
          }
        >
          <FiPlusCircle /> Thêm sản phẩm
        </NavLink>
        {!token && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "underline" : ""}`
              }
            >
              <FiLogIn /> Đăng nhập
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "underline" : ""}`
              }
            >
              <FiUserPlus /> Đăng ký
            </NavLink>
          </>
        )}
        {token && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            <FiLogOut /> Đăng xuất
          </button>
        )}
      </div>
    </nav>
  );
}
