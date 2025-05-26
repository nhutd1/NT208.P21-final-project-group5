import React, { useState } from 'react';
import './FormStyles.css'; // CSS chung cho các form

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Đây là nơi bạn sẽ gọi API để xác thực người dùng
    // Ví dụ đơn giản:
    if (username === 'test' && password === '123') {
      onLoginSuccess(); // Gọi hàm từ App.js để cập nhật trạng thái đăng nhập
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
    // Trong thực tế, bạn sẽ dùng Axios để gửi request POST đến backend
    // try {
    //   const response = await axios.post('/api/login', { username, password });
    //   if (response.data.success) {
    //     onLoginSuccess();
    //   } else {
    //     alert(response.data.message);
    //   }
    // } catch (error) {
    //   console.error('Lỗi đăng nhập:', error);
    //   alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    // }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Đăng nhập</h2>
      <div className="input-group">
        <label htmlFor="loginUsername">Tên đăng nhập:</label>
        <input
          type="text"
          id="loginUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="loginPassword">Mật khẩu:</label>
        <input
          type="password"
          id="loginPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Đăng nhập
      </button>
    </form>
  );
}

export default LoginForm;