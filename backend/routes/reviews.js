// backend/routes/reviews.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const auth = require('../middleware/auth');   // Đảm bảo tồn tại file middleware/auth.js

const router = express.Router();
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

// POST /api/reviews
router.post(
  '/',
  auth,
  [
    body('productId').notEmpty().withMessage('productId là bắt buộc.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating phải từ 1 đến 5.'),
    body('comment').notEmpty().withMessage('Comment không được để trống.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { productId, rating, comment } = req.body;
      const review = await Review.create({
        productId,
        userId: req.user.userId,
        rating,
        comment
      });
      res.json(review);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server khi tạo review.' });
    }
  }
);

module.exports = router;
