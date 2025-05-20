const express = require('express');
const router = express.Router();
const { fetchProducts, fetchProductById } = require('../services/productService');

// GET /api/products?offset=0&limit=10
router.get('/', async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query;
    const products = await fetchProducts(offset, limit);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await fetchProductById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
