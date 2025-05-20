const express = require('express');
const router = express.Router();
const { createReview, getReviewsByProduct } = require('../services/reviewService');

// POST /api/reviews
router.post('/', async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const rv = await createReview({ productId, rating, comment });
    res.status(201).json(rv);
  } catch (err) {
    next(err);
  }
});

// GET /api/reviews?productId=123
router.get('/', async (req, res, next) => {
  try {
    const { productId } = req.query;
    const list = await getReviewsByProduct(Number(productId));
    res.json(list);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
