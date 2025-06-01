import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ProductList from './components/ProductList.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between">
        <NavLink to="/" className="font-bold">Trang chủ</NavLink>
        <div className="space-x-4">
          <NavLink to="/login">Đăng nhập</NavLink>
          <NavLink to="/register">Đăng ký</NavLink>
        </div>
      </nav>

      {/* Routes */}
      <div className="pt-6">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}