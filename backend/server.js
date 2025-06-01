// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const auth = require('./middleware/auth'); // <-- Đã tách file riêng

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer: cấu hình upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health-check
app.get('/__test_alive', (req, res) => res.send('Server is ALIVE'));

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
}));
const Product = require('./models/Product');
const Review = require('./models/Review');

// --------- Auth routes ---------
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

// --------- Image Upload route ---------
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// --------- Product routes ---------
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
});

app.post(
  '/api/products',
  auth,
  [
    body('title').isLength({ min: 3 }).withMessage('Tên sản phẩm phải có ít nhất 3 ký tự.'),
    body('description').notEmpty().withMessage('Mô tả không được để trống.'),
    body('price').isFloat({ gt: 0 }).withMessage('Giá phải là số lớn hơn 0.'),
    body('category').notEmpty().withMessage('Danh mục không được để trống.'),
    body('imageUrl').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const product = await Product.create({
        ...req.body,
        ownerId: req.user.userId,
      });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: 'Error creating product', error: err.message });
    }
  }
);

// --------- Review routes ---------
app.post(
  '/api/reviews',
  auth,
  [
    body('productId').notEmpty().withMessage('productId là bắt buộc.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Điểm phải từ 1 đến 5.'),
    body('comment').notEmpty().withMessage('Comment không được để trống.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const review = await Review.create({
        productId: req.body.productId,
        userId: req.user.userId,
        rating: req.body.rating,
        comment: req.body.comment,
      });
      res.json(review);
    } catch (err) {
      res.status(400).json({ message: 'Error creating review', error: err.message });
    }
  }
);

app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalReviews = await Review.countDocuments({ productId: id });
    const reviews = await Review.find({ productId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username');
    return res.json({
      reviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        totalPages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (err) {
    console.error('Lỗi khi fetch reviews:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy review.' });
  }
});

// --------- Start server ---------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} (folder: ${__dirname})`)
);
