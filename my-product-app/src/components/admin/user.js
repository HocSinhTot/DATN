import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Popup from './Popup';

const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });

    useEffect(() => {
        fetch('http://localhost:8080/api/users')
            .then((response) => response.json())
            .then((data) => setUserList(data))
            .catch((error) => console.error('Error fetching user data:', error));
    }, []);

    const openPopup = (message, onConfirm) => {
        setPopup({ show: true, message, onConfirm });
    };

    const handleDelete = (id) => {
        openPopup('Bạn có chắc chắn muốn xóa người dùng này không?', () => {
            fetch(`http://localhost:8080/api/users/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        setUserList(userList.filter((user) => user.id !== id));
                    }
                })
                .catch((error) => console.error('Error deleting user:', error))
                .finally(() => setPopup({ show: false, message: '', onConfirm: null }));
        });
    };

    const handleBlock = (id) => {
        openPopup('Bạn có chắc chắn muốn khóa người dùng này không?', () => {
            fetch(`http://localhost:8080/api/users/${id}/block`, {
                method: 'PUT',
            })
                .then((response) => {
                    if (response.ok) {
                        setUserList(userList.map((user) => (user.id === id ? { ...user, status: false } : user)));
                    }
                })
                .catch((error) => console.error('Error blocking user:', error))
                .finally(() => setPopup({ show: false, message: '', onConfirm: null }));
        });
    };

    const handleUnblock = (id) => {
        openPopup('Bạn có chắc chắn muốn mở khóa người dùng này không?', () => {
            fetch(`http://localhost:8080/api/users/${id}/unblock`, {
                method: 'PUT',
            })
                .then((response) => {
                    if (response.ok) {
                        setUserList(userList.map((user) => (user.id === id ? { ...user, status: true } : user)));
                    }
                })
                .catch((error) => console.error('Error unblocking user:', error))
                .finally(() => setPopup({ show: false, message: '', onConfirm: null }));
        });
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };


    return (
        <>
            {popup.show && (
                <Popup
                    message={popup.message}
                    onClose={() => setPopup({ show: false, message: '', onConfirm: null })}
                    onConfirm={popup.onConfirm}
                />
            )}
            <div className="be-wrapper be-fixed-sidebar" style={{ paddingTop: '0px' }}>
                <div className="be-content">
                    <div className="container-fluid" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                        <div className="content">
                            <div className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                                    <h5 className="card-title m-0" style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Quản lý khách hàng</h5>
                                    <Link
                                        to="/nguoidung/add"
                                        className="btn btn-light"
                                        style={{
                                            padding: '10px',
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '45px',
                                            height: '45px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = '#0056b3';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = '#007bff';
                                        }}
                                    >
                                        <i className="fa fa-plus" style={{ fontSize: '18px' }}></i>
                                    </Link>

                                </div>
                                <div className="card-body">
                                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ backgroundColor: '#007bff', color: '#fff', fontSize: '18px' }}>
                                            <tr>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>STT</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Tên</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Tên</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Ngày sinh</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Số điện thoại</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Vai trò</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Trạng thái</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Giới tính</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Hình ảnh</th>
                                                <th style={{ padding: '10px', textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userList.length > 0 ? (
                                                userList.map((user, index) => (
                                                    <tr
                                                        key={user.id}
                                                        style={{
                                                            borderBottom: '1px solid #ddd',
                                                            fontSize: '16px',
                                                            transition: 'background-color 0.3s ease', /* Thêm hiệu ứng chuyển màu nền */
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#f1f1f1'; /* Màu nền khi hover */
                                                            e.currentTarget.style.cursor = 'pointer'; /* Thay đổi con trỏ khi hover */
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = ''; /* Khôi phục màu nền ban đầu */
                                                        }}
                                                    >
                                                        <td style={{ padding: '10px' }}>{index + 1}</td>
                                                        <td style={{ padding: '10px' }}>{user.username}</td>
                                                        <td style={{ padding: '10px' }}>{user.email}</td>
                                                        <td style={{ padding: '10px' }}>{user.name}</td>
                                                        <td style={{ padding: '15px' }}>
                                                            {formatDate(user.birthday)}
                                                        </td>
                                                        <td style={{ padding: '10px' }}>{user.phone}</td>
                                                        <td style={{ padding: '10px' }}>{user.role ? 'Admin' : 'User'}</td>
                                                        <td style={{ padding: '10px' }}>{user.status ? 'Active' : 'Inactive'}</td>
                                                        <td style={{ padding: '10px' }}>{user.gender ? 'Male' : 'Female'}</td>
                                                        <td style={{ padding: '10px' }}>
                                                            <img
                                                                src={user.image ? `/assets/images/${user.image}` : '/assets/images/default_user_image.jpg'}
                                                                alt={user.name}
                                                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                            />
                                                        </td>
                                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                                            <Link to={`/nguoidung/edit/${user.id}`} style={{ margin: '5px', fontSize: '18px', color: '#4285f4' }}>
                                                                <i className="fa fa-edit"></i>
                                                            </Link>
                                                            <button onClick={() => handleDelete(user.id)} style={{ margin: '5px', fontSize: '18px', color: '#dc3545', border: 'none', background: 'none' }}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                            {user.status ? (
                                                                <button onClick={() => handleBlock(user.id)} style={{ margin: '5px', fontSize: '18px', color: '#dc3545', border: 'none', background: 'none' }}>
                                                                    <i className="fa fa-lock"></i>
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => handleUnblock(user.id)} style={{ margin: '5px', fontSize: '18px', color: '#28a745', border: 'none', background: 'none' }}>
                                                                    <i className="fa fa-unlock"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>

                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy người dùng nào</td>
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

        </>
    );
};

export default UserManagement;  