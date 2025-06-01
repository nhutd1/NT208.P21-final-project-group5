const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String,
  ownerId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Product', ProductSchema);