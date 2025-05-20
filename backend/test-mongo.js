require('dotenv').config();
const mongoose = require('mongoose');

console.log('Trying to connect to:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅'))
  .catch(err => console.error('❌', err));
