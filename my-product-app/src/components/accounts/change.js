import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const username = localStorage.getItem("username");
  const navigate = useNavigate();

    // Hàm kiểm tra mật khẩu yếu
    const isWeakPassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra nếu các trường mật khẩu chưa điền
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            setSuccessMessage('');
            return;
        }

        // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu không khớp
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và mật khẩu xác nhận không khớp.");
            setSuccessMessage('');
            return;
        }

        // Kiểm tra nếu mật khẩu mới giống mật khẩu cũ
        if (newPassword === currentPassword) {
            setError("Mật khẩu mới không được giống mật khẩu cũ.");
            setSuccessMessage('');
            return;
        }

        // Kiểm tra nếu mật khẩu mới yếu
        if (isWeakPassword(newPassword)) {
            setError("Mật khẩu mới quá yếu. Mật khẩu cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
            setSuccessMessage('');
            return;
        }

        // Gửi yêu cầu thay đổi mật khẩu tới API
        const changePasswordRequest = {
            username: username,
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(changePasswordRequest)
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage(result.message);
                setError('');  // Clear any previous error messages
                navigate("/");
            } else {
                setError(result.message);
                setSuccessMessage('');
            }
        } catch (error) {
            setError("Đã có lỗi xảy ra, vui lòng thử lại.");
            setSuccessMessage('');
        }
    };

    return (
        <div style={{
            background: 'radial-gradient(ellipse at bottom, #3a6e71 0%, #1a2b3d 100%)',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            margin: 0,
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center',
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Thay Đổi Mật Khẩu</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label htmlFor="currentPassword">Mật Khẩu Hiện Tại:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword">Mật Khẩu Mới:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu Mới:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    {/* Hiển thị lỗi hoặc thông báo thành công */}
                    {error && <div style={styles.errorMessage}>{error}</div>}
                    {successMessage && <div style={styles.successMessage}>{successMessage}</div>}

                    <button type="submit" style={styles.button}>
                        Thay Đổi Mật Khẩu
                        
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        color: 'black',
        borderRadius: '8px',
        boxSizing: 'border-box',
        transition: 'border 0.3s, box-shadow 0.3s',
    },
    button: {
        width: '100%',
        padding: '12px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s, transform 0.3s, box-shadow 0.3s',
    },
    errorMessage: {
        color: 'red',
        marginTop: '-10px',
        marginBottom: '10px',
    },
    successMessage: {
        color: 'yellow',
        marginTop: '10px',
        marginBottom: '10px',
    },
};

export default ChangePasswordForm;
