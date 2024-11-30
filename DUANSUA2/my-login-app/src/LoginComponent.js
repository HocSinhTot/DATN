import React, { useState } from 'react';
import axios from 'axios';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', {
                username,
                password,
                rememberMe
            });

            if (response.status === 200) {
                window.location.href = response.data.redirectUrl;
            }
        } catch (error) {
            setError('Tên đăng nhập hoặc mật khẩu không chính xác');
        }
    };

    return (
        <div className="login-container">
            <h1>Đăng Nhập</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Tên đăng nhập:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Mật khẩu:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="remember-me">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Lưu mật khẩu</label>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Đăng Nhập</button>
            </form>
        </div>
    );
};

export default LoginComponent;
