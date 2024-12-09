import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    // Cấu hình fetch với header Authorization
    const fetchOptions = (method, body = null) => ({
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Thêm header Authorization
        },
        body: body ? JSON.stringify(body) : null,
    });

    // Lấy danh sách người dùng
    useEffect(() => {
        fetch('http://localhost:8080/api/admin/users', fetchOptions('GET'))
            .then((response) => response.json())
            .then((data) => setUserList(data))
            .catch((error) => console.error('Error fetching user data:', error));
    }, []);

    // Xử lý xóa người dùng
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            fetch(`http://localhost:8080/api/admin/users/${id}`, fetchOptions('DELETE'))
                .then((response) => {
                    if (response.ok) {
                        alert('User deleted successfully!');
                        setUserList(userList.filter(user => user.id !== id));  // Xóa người dùng khỏi danh sách
                    }
                })
                .catch((error) => console.error('Error deleting user:', error));
        }
    };

    // Xử lý khóa người dùng
    const handleBlock = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn khóa người dùng này không?')) {
            fetch(`http://localhost:8080/api/admin/users/${id}/block`, fetchOptions('PUT'))
                .then((response) => {
                    if (response.ok) {
                        alert('Khóa người dùng thành công!');
                        setUserList(userList.map(user =>
                            user.id === id ? { ...user, status: false } : user
                        ));
                    }
                })
                .catch((error) => console.error('Lỗi khi khóa người dùng:', error));
        }
    };
    
    // Xử lý mở khóa người dùng
    const handleUnblock = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn mở khóa người dùng này không?')) {
            fetch(`http://localhost:8080/api/admin/users/${id}/unblock`, fetchOptions('PUT'))
                .then((response) => {
                    if (response.ok) {
                        alert('Mở khóa người dùng thành công!');
                        setUserList(userList.map(user =>
                            user.id === id ? { ...user, status: true } : user
                        ));
                    }
                })
                .catch((error) => console.error('Lỗi khi mở khóa người dùng:', error));
        }
    };

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý khách hàng</h5>
                                <Link to="/nguoidung/add" className="btn btn-light">
                                    Thêm mới
                                </Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên người dùng</th>
                                            <th>Email</th>
                                            <th>Tên</th>
                                            <th>Ngày sinh</th>
                                            <th>Số điện thoại</th>
                                            <th>Vai trò</th>
                                            <th>Trạng thái</th>
                                            <th>Giới tính</th>
                                            <th>Hình ảnh</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.length > 0 ? (
                                            userList.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.birthday}</td>
                                                    <td>{user.phone}</td>
                                                    <td>{user.role ? 'Admin' : 'User'}</td>
                                                    <td>{user.status ? 'Active' : 'Inactive'}</td>
                                                    <td>{user.gender ? 'Male' : 'Female'}</td>
                                                    <td>
                                                        <img
                                                            src={user.image ? `/assets/images/${user.image}` : '/assets/images/default_user_image.jpg'}
                                                            alt={user.name}
                                                            width="50"
                                                            height="50"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Link to={`/nguoidung/edit/${user.id}`} className="btn btn-warning btn-sm">Chỉnh sửa</Link>
                                                        <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Xóa</button>
                                                        {user.status ? (
                                                            <button onClick={() => handleBlock(user.id)} className="btn btn-danger btn-sm">Khóa</button>
                                                        ) : (
                                                            <button onClick={() => handleUnblock(user.id)} className="btn btn-success btn-sm">Mở</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="11" style={{ textAlign: 'center' }}>Không tìm thấy người dùng nào</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
