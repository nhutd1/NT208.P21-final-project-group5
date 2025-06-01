// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  // Lấy token từ header Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.sendStatus(401);
  }
  const token = parts[1];
  try {
    // Xác thực token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;      // gán payload (chứa userId) vào req.user
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
