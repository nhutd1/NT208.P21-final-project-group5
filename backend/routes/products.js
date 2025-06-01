// backend/routes/products.js (nếu bạn tách routes riêng)
const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/products
router.post(
  '/',
  auth,
  [
    body('title').isLength({ min: 3 }).withMessage('Tiêu đề phải có ít nhất 3 ký tự.'),
    body('description').notEmpty().withMessage('Mô tả không được để trống.'),
    body('price').isFloat({ gt: 0 }).withMessage('Giá phải là số lớn hơn 0.'),
    body('category').notEmpty().withMessage('Danh mục không được để trống.'),
    // bạn có thể thêm validate imageUrl ở đây nếu muốn
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const product = await Product.create({ ...req.body, ownerId: req.user.userId });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm.' });
    }
  }
);

module.exports = router;