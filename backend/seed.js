require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Seeding database...');
    await Product.deleteMany({});
    await Product.create([
      {
        title: 'iPhone 15 Pro',
        description: 'Điện thoại cao cấp của Apple, nhiều công nghệ mới.',
        price: 29990000,
        imageUrl: 'https://via.placeholder.com/200',
        category: 'electronics'
      },
      {
        title: 'Samsung Galaxy S24',
        description: 'Flagship Samsung, màn hình đẹp, pin trâu.',
        price: 21990000,
        imageUrl: 'https://via.placeholder.com/200',
        category: 'electronics'
      }
    ]);
    console.log('Seeding done.');
    process.exit();
  })
  .catch(err => console.error(err));