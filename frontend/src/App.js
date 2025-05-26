import React, { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useProductDetail } from './hooks/useProductDetail';
import { useReviews } from './hooks/useReviews';
import ReviewForm from './components/ReviewForm';
import AuthPage from './components/AuthPage'; // Import AuthPage

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [showAuthPage, setShowAuthPage] = useState(false); // Trạng thái hiển thị trang Auth

  const { products, loading: listLoading } = useProducts(0, 10);
  const { product, loading: detailLoading } = useProductDetail(selectedId);
  const { reviews, loading: revLoading, reload } = useReviews(selectedId);

  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthPage(false); // Ẩn trang auth sau khi đăng nhập
    alert('Đăng nhập thành công!');
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedId(null); // Đặt lại chi tiết sản phẩm khi đăng xuất
    alert('Bạn đã đăng xuất.');
  };

  // Hàm để chuyển đến trang đăng nhập/đăng ký
  const goToAuthPage = () => {
    setShowAuthPage(true);
  };

  // Hàm để quay lại trang chính (nếu đang ở trang Auth nhưng chưa đăng nhập)
  const goBackToProducts = () => {
    setShowAuthPage(false);
  };

  if (showAuthPage && !isLoggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={goBackToProducts} style={{ marginBottom: 20, padding: '10px 15px', cursor: 'pointer' }}>
          &larr; Quay lại danh sách sản phẩm
        </button>
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Nút Đăng nhập/Đăng ký hoặc Đăng xuất */}
      <div style={{ textAlign: 'right', marginBottom: 20 }}>
        {isLoggedIn ? (
          <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Đăng xuất
          </button>
        ) : (
          <button onClick={goToAuthPage} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Đăng nhập / Đăng ký
          </button>
        )}
      </div>

      <h1>Danh sách sản phẩm</h1>
      {listLoading
        ? <p>Đang tải danh sách…</p>
        : (
          <ul>
            {products.map(p => (
              <li key={p.id} onClick={() => setSelectedId(p.id)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                {p.title} — ${p.price}
              </li>
            ))}
          </ul>
        )
      }

      {selectedId && !detailLoading && product && (
        <div style={{ marginTop: 30, borderTop: '1px solid #eee', paddingTop: 20 }}>
          <h2>Chi tiết sản phẩm</h2>
          <p><strong>{product.title}</strong></p>
          {product.images?.[0] && <img src={product.images[0]} alt="" width={200} style={{ maxWidth: '100%', height: 'auto', marginBottom: 15 }}/>}
          <p>Giá: ${product.price}</p>
          <p>{product.description}</p>

          <h3>Đánh giá của người dùng</h3>
          {revLoading
            ? <p>Đang tải đánh giá…</p>
            : reviews.length
              ? reviews.map(r => (
                  <div key={r._id} style={{ borderBottom: '1px solid #ddd', padding: '8px 0', marginBottom: 10 }}>
                    <p><strong>Điểm:</strong> {r.rating} sao</p>
                    <p><strong>Bình luận:</strong> {r.comment}</p>
                  </div>
                ))
              : <p>Chưa có đánh giá nào.</p>
          }

          {/* Chỉ cho phép viết đánh giá nếu đã đăng nhập */}
          {isLoggedIn ? (
            <ReviewForm productId={selectedId} onNewReview={reload}/>
          ) : (
            <p style={{ marginTop: 20, color: '#dc3545' }}>Vui lòng <span onClick={goToAuthPage} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>đăng nhập</span> để viết đánh giá.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;