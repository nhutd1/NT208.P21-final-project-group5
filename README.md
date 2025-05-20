# ReviewPulse

## 📖 Mô tả
ReviewPulse là ứng dụng web tổng hợp sản phẩm và đánh giá của người dùng.  
- **Backend**: Node.js, Express, MongoDB (Mongoose)  
- **Frontend**: React, Axios  

---

## 🚀 Chạy dự án

### 1. Backend
```bash
cd prj/backend
npm install
# Tạo file .env với nội dung:
# MONGODB_URI=<your MongoDB connection string>
# PORT=3001
node server.js
API endpoints

GET /api/products?limit=&offset=&category=&minPrice=&maxPrice=&minRating=&sortBy=

GET /api/products/:id

GET /api/reviews?productId=

POST /api/reviews
```

JSON body:
{
  "productId": 5,
  "rating": 4,
  "comment": "Sản phẩm tốt!"
}
2. Frontend
cd prj/frontend
npm install
npm start
Mở trình duyệt tại http://localhost:3000
📂 Cấu trúc thư mục
prj/
├── backend/
│   ├── .env
│   ├── server.js
│   ├── config/db.js
│   ├── models/Review.js
│   ├── services/
│   │   ├── productService.js
│   │   └── reviewService.js
│   └── routes/
│       ├── products.js
│       └── reviews.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── App.js
        └── index.js
Just create a file named `README.md` in your repo root and paste the above content.
