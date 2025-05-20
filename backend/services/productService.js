const axios = require('axios');
const BASE_URL = 'https://api.escuelajs.co/api/v1';

async function fetchProducts(offset = 0, limit = 10) {
  const url = `${BASE_URL}/products?offset=${offset}&limit=${limit}`;
  const res = await axios.get(url);
  return res.data;
}

async function fetchProductById(id) {
  const url = `${BASE_URL}/products/${id}`;
  const res = await axios.get(url);
  return res.data;
}

module.exports = { fetchProducts, fetchProductById };
