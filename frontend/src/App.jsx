import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProductList from "./components/ProductList.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import AddProduct from "./components/AddProduct.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Navbar cố định trên cùng */}
      <Navbar />

      {/* Toast toàn app */}
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Nội dung */}
      <main className="max-w-5xl mx-auto px-2 py-6">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
