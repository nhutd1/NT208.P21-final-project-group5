// FULL STACK PROJECT FOR NGƯỞI C

// ===================== BACKEND ===================== //

// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String,
  ownerId: mongoose.Schema.Types.ObjectId
}));

const Review = mongoose.model('Review', new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
}));

// Auth
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });
  res.json(user);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
};

// Product routes
app.post('/api/products', auth, async (req, res) => {
  const product = await Product.create({ ...req.body, ownerId: req.user.userId });
  res.json(product);
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Review routes
app.post('/api/reviews', auth, async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = await Review.create({ productId, userId: req.user.userId, rating, comment });
  res.json(review);
});

app.get('/api/products/:id/reviews', async (req, res) => {
  const reviews = await Review.find({ productId: req.params.id }).populate('userId', 'username');
  res.json(reviews);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ===================== FRONTEND NEXT STEP ===================== //

// Sau khi backend chạy, ta sẽ tạo frontend React + Axios + Tailwind sau.
