import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Popup from './Popup';

const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });
    const [showAddUserForm, setShowAddUserForm] = useState(false); // State to show/hide the add user form

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

    // Add User Form handler
    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            // Add other user fields as needed
        };
        fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((newUser) => {
                setUserList([...userList, newUser]);
                setShowAddUserForm(false); // Close form after adding the user
            })
            .catch((error) => console.error('Error adding user:', error));
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

            {showAddUserForm && (
                <div className="add-user-popup">
                    <div className="popup-content">
                        <h3>Thêm người dùng mới</h3>
                        <form onSubmit={handleAddUserSubmit}>
                            <div>
                                <label>Họ tên</label>
                                <input type="text" name="name" required />
                            </div>
                            <div>
                                <label>Email</label>
                                <input type="email" name="email" required />
                            </div>
                            {/* Add more fields as necessary */}
                            <div>
                                <button type="submit">Thêm người dùng</button>
                                <button type="button" onClick={() => setShowAddUserForm(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="be-wrapper be-fixed-sidebar" style={{ paddingTop: '0px' }}>
                <div className="be-content">
                    <div className="container-fluid" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                        <div className="content">
                            <div className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
                                    <h5 className="card-title m-0" style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Quản lý khách hàng</h5>
                                    <button
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
                                        onClick={() => setShowAddUserForm(true)} // Show the form when clicked
                                    >
                                        <i className="fa fa-plus" style={{ fontSize: '18px' }}></i>
                                    </button>
                                </div>
                                <div className="card-body">
                                    {/* Display user list here */}
                                    <ul>
                                        {userList.map((user) => (
                                            <li key={user.id}>{user.name} - {user.email}</li>
                                        ))}
                                    </ul>
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
