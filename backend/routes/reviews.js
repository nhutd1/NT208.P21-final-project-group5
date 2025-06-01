// Nếu định nghĩa riêng routes/reviews.js:
// router.get('/api/products/:id/reviews', ...) đã có.

// Trong server.js:
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy reviews' });
  }
});

app.post('/api/reviews', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.create({ productId, userId: req.user.userId, rating, comment });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lưu review' });
  }
});