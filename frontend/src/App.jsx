// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProductList from './components/ProductList.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import AddProduct from './components/AddProduct.jsx';
import AdminPage from './components/AdminPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gray-100 overflow-x-hidden">
      <ToastContainer position="top-center" />
      <Navbar />
      <div className="pt-6 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}
