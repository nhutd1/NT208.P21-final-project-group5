import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AddProduct from './components/AddProduct.jsx';
import Navbar from './components/Navbar.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar cố định */}
      <Navbar />

      {/* Toast notification */}
      <ToastContainer position="top-center" />

      {/* Các route */}
      <div className="pt-6">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add" element={<AddProduct />} />
        </Routes>
      </div>
    </div>
  );
}
