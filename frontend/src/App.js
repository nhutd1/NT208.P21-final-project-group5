import React, { useState } from 'react';
import { useProducts }   from './hooks/useProducts';
import { useProductDetail } from './hooks/useProductDetail';
import { useReviews }    from './hooks/useReviews';
import ReviewForm        from './components/ReviewForm';

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const { products, loading: listLoading }  = useProducts(0, 10);
  const { product, loading: detailLoading } = useProductDetail(selectedId);
  const { reviews, loading: revLoading, reload } = useReviews(selectedId);

  return (
    <div style={{ padding: 20 }}>
      <h1>Danh sách sản phẩm</h1>
      {listLoading
        ? <p>Đang tải danh sách…</p>
        : (
          <ul>
            {products.map(p => (
              <li key={p.id} onClick={() => setSelectedId(p.id)} style={{ cursor: 'pointer' }}>
                {p.title} — ${p.price}
              </li>
            ))}
          </ul>
        )
      }

      {selectedId && !detailLoading && product && (
        <div style={{ marginTop: 30 }}>
          <h2>Chi tiết sản phẩm</h2>
          <p><strong>{product.title}</strong></p>
          {product.images?.[0] && <img src={product.images[0]} alt="" width={200}/>}
          <p>Giá: ${product.price}</p>
          <p>{product.description}</p>

          <h3>Đánh giá của người dùng</h3>
          {revLoading
            ? <p>Đang tải đánh giá…</p>
            : reviews.length
              ? reviews.map(r => (
                  <div key={r._id} style={{ borderBottom: '1px solid #ddd', padding: '8px 0' }}>
                    <p>{r.rating} sao</p>
                    <p>{r.comment}</p>
                  </div>
                ))
              : <p>Chưa có đánh giá nào.</p>
          }

          <ReviewForm productId={selectedId} onNewReview={reload}/>
        </div>
      )}
    </div>
  );
}

export default App;
