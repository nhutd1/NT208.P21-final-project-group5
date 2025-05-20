const Review = require('../models/Review.js');

async function createReview({ productId, rating, comment }) {
  const rv = await Review.create({ productId, rating, comment });
  return rv;
}

async function getReviewsByProduct(productId) {
  return Review.find({ productId })
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = { createReview, getReviewsByProduct };
