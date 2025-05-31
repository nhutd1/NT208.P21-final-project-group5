const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb';

const users = [
  {
    name: "Alice Demo",
    email: "alice@example.com",
    password: "hashed_password_1", // Nên hash nếu có middleware, còn seed demo thì để plain text cũng được
  },
  {
    name: "Bob Demo",
    email: "bob@example.com",
    password: "hashed_password_2",
  },
];

const products = [
  {
    name: "iPhone 15 Pro",
    price: 29990000,
    description: "Điện thoại cao cấp của Apple, nhiều công nghệ mới.",
    image: "https://via.placeholder.com/200x300?text=Iphone+15+Pro",
  },
  {
    name: "Samsung Galaxy S24",
    price: 21990000,
    description: "Flagship Samsung, màn hình đẹp, pin trâu.",
    image: "https://via.placeholder.com/200x300?text=Galaxy+S24",
  },
];

const reviews = [
  {
    user: null, // sẽ gán sau khi insert user
    product: null, // sẽ gán sau khi insert product
    rating: 5,
    comment: "Sản phẩm tuyệt vời!",
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    const insertedUsers = await User.insertMany(users);
    const insertedProducts = await Product.insertMany(products);

    // Gán user & product cho review
    reviews[0].user = insertedUsers[0]._id;
    reviews[0].product = insertedProducts[0]._id;

    await Review.insertMany(reviews);

    console.log("✅ Seed dữ liệu thành công!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
    process.exit(1);
  }
}
seed();
