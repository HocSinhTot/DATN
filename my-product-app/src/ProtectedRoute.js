import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, roles }) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        // Chuyển hướng đến trang đăng nhập nếu chưa có token
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.roles; // Vai trò được lưu trong token
        console.log(userRole)
        // Kiểm tra quyền truy cập
        if (roles && !roles.includes(userRole)) {
            return <Navigate to="/"/>; // Trang không đủ quyền
        }

        return children; // Cho phép truy cập
    } catch (error) {
        console.error('Lỗi token:', error);
        sessionStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;
