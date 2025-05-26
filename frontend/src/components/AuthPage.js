import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthPage.css'; // CSS riêng cho AuthPage

function AuthPage({ onLoginSuccess }) {
  // Trạng thái để xác định đang hiển thị form nào
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-page-container">
      <div className="form-toggle-buttons">
        <button
          className={showLogin ? 'active' : ''}
          onClick={() => setShowLogin(true)}
        >
          Đăng nhập
        </button>
        <button
          className={!showLogin ? 'active' : ''}
          onClick={() => setShowLogin(false)}
        >
          Đăng ký
        </button>
      </div>

      {showLogin ? (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
}

export default AuthPage;