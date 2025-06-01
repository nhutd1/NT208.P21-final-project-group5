// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Models
// Define User model only once
const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
  })
);

// Import Product & Review schemas from separate files
const Product = require('./models/Product');
const Review = require('./models/Review');

// JWT authentication middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload; // contains { userId: ... }
    next();
  });
};

// Health-check route
app.get('/__test_alive', (req, res) => res.send('Server is ALIVE'));

// --------- Auth routes ---------

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error registering', error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --------- Product routes ---------

// Fetch all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Fetch single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
});

// Create new product (requires JWT auth)
app.post('/api/products', auth, async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      ownerId: req.user.userId,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err.message });
  }
});

// --------- Review routes ---------

// Add a review (requires JWT auth)
app.post('/api/reviews', auth, async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    const review = await Review.create({
      productId,
      userId: req.user.userId,
      rating,
      comment,
    });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: 'Error creating review', error: err.message });
  }
});

// Get all reviews for a product
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).populate(
      'userId',
      'username'
    );
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
});

// --------- Start server ---------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} (folder: ${__dirname})`)
);
