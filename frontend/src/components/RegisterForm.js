import React, { useState } from 'react';
import './FormStyles.css'; // CSS chung cho các form

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }
    // Đây là nơi bạn sẽ gọi API để đăng ký người dùng mới
    alert(`Đăng ký thành công (chưa kết nối backend) với:
      Tên đăng nhập: ${username}
      Email: ${email}`);
    // Trong thực tế, bạn sẽ dùng Axios để gửi request POST đến backend
    // try {
    //   const response = await axios.post('/api/register', { username, email, password });
    //   if (response.data.success) {
    //     alert('Đăng ký thành công!');
    //     // Chuyển hướng hoặc tự động đăng nhập sau khi đăng ký
    //   } else {
    //     alert(response.data.message);
    //   }
    // } catch (error) {
    //   console.error('Lỗi đăng ký:', error);
    //   alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    // }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Đăng ký</h2>
      <div className="input-group">
        <label htmlFor="registerUsername">Tên đăng nhập:</label>
        <input
          type="text"
          id="registerUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="registerEmail">Email:</label>
        <input
          type="email"
          id="registerEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="registerPassword">Mật khẩu:</label>
        <input
          type="password"
          id="registerPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-button">
        Đăng ký
      </button>
    </form>
  );
}

export default RegisterForm;