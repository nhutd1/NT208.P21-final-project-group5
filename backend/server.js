require('dotenv').config();           // load .env
const connectDB = require('./config/db.js');
connectDB();                          // nối MongoDB Atlas trước hết
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');

// --- DEBUG START ---
console.log('Type of productRoutes =', typeof productRoutes);
console.log('productRoutes =', productRoutes);
// --- DEBUG END ---

const app = express();
app.use(cors());
app.use('/api/products', productRoutes);  
app.use(express.json());                 // để đọc req.body
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

// ...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
