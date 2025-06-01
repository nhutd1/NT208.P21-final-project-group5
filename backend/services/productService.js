// backend/services/productService.js
const Product = require('../models/Product');

async function fetchProducts(offset = 0, limit = 10) {
  return await Product.find().skip(Number(offset)).limit(Number(limit));
}

async function fetchProductById(id) {
  // Nếu dùng mongoose, nên convert id sang ObjectId:
  const mongoose = require('mongoose');
  return await Product.findById(mongoose.Types.ObjectId(id));
}


module.exports = { fetchProducts, fetchProductById };
