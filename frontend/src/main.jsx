// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

function App() {
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Danh sách sản phẩm</h1>
      <Link to="/login" className="text-blue-500 mr-4">Đăng nhập</Link>
      <Link to="/register" className="text-blue-500 mr-4">Đăng ký</Link>
      <Link to="/create" className="text-blue-500">Đăng sản phẩm</Link>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {products.map(p => (
          <Link key={p._id} to={`/products/${p._id}`} className="border p-2 rounded">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p>{p.price} USD</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Login() {
  const nav = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    nav('/');
  };
  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Đăng nhập</h2>
      <input name="email" placeholder="Email" className="border p-2 w-full mb-2" required />
      <input name="password" type="password" placeholder="Mật khẩu" className="border p-2 w-full mb-2" required />
      <button className="bg-blue-500 text-white px-4 py-2">Đăng nhập</button>
    </form>
  );
}

function Register() {
  const nav = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    await api.post('/auth/register', { username, email, password });
    nav('/login');
  };
  return (
    <form onSubmit={handleRegister} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Đăng ký</h2>
      <input name="username" placeholder="Tên người dùng" className="border p-2 w-full mb-2" required />
      <input name="email" placeholder="Email" className="border p-2 w-full mb-2" required />
      <input name="password" type="password" placeholder="Mật khẩu" className="border p-2 w-full mb-2" required />
      <button className="bg-green-500 text-white px-4 py-2">Đăng ký</button>
    </form>
  );
}

function CreateProduct() {
  const nav = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const product = {
      title: e.target.title.value,
      description: e.target.description.value,
      price: e.target.price.value,
      imageUrl: e.target.imageUrl.value,
      category: e.target.category.value
    };
    await api.post('/products', product, config);
    nav('/');
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Đăng sản phẩm mới</h2>
      <input name="title" placeholder="Tên sản phẩm" className="border p-2 w-full mb-2" required />
      <input name="price" placeholder="Giá" className="border p-2 w-full mb-2" required />
      <input name="imageUrl" placeholder="Ảnh URL" className="border p-2 w-full mb-2" />
      <input name="category" placeholder="Danh mục" className="border p-2 w-full mb-2" />
      <textarea name="description" placeholder="Mô tả" className="border p-2 w-full mb-2" rows="4"></textarea>
      <button className="bg-purple-500 text-white px-4 py-2">Đăng sản phẩm</button>
    </form>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);

  React.useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
    api.get(`/products/${id}/reviews`).then(res => setReviews(res.data));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const body = {
      productId: id,
      rating: e.target.rating.value,
      comment: e.target.comment.value
    };
    await api.post('/reviews', body, config);
    const updated = await api.get(`/products/${id}/reviews`);
    setReviews(updated.data);
    e.target.reset();
  };

  if (!product) return <div className="p-4">Đang tải...</div>;
  
  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">{product.title}</h2>
      <p>{product.price} USD</p>
      <p>{product.description}</p>
      <h3 className="mt-4 font-semibold">Đánh giá</h3>
      {reviews.map(r => (
        <div key={r._id} className="border p-2 mb-2">
          <p><b>{r.rating} ⭐</b> {r.comment}</p>
        </div>
      ))}
      <form onSubmit={handleReview} className="mt-4">
        <select name="rating" className="border p-2 mb-2">
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
        </select>
        <textarea name="comment" placeholder="Nhận xét" className="border p-2 w-full mb-2" rows="3"></textarea>
        <button className="bg-blue-500 text-white px-4 py-2">Gửi đánh giá</button>
      </form>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
