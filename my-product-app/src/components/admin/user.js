import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './Popup';  // Giả sử bạn đã có một component Popup

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

    const handleAddUser = () => {
        setPopup({
            show: true,
            message: <AddUserForm onClose={() => setPopup({ show: false, message: '', onConfirm: null })} />
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
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Quản lý khách hàng</h5>
                                    <button
                                        className="btn btn-light"
                                        style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}
                                        onClick={handleAddUser}
                                    >
                                        Thêm Người Dùng
                                    </button>
                                </div>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Tên</th>
                                                <th>Email</th>
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
                                            {userList.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{formatDate(user.birthday)}</td>
                                                    <td>{user.phone}</td>
                                                    <td>{user.role ? 'Admin' : 'User'}</td>
                                                    <td>{user.status ? 'Active' : 'Inactive'}</td>
                                                    <td>{user.gender ? 'Male' : 'Female'}</td>
                                                    <td>
                                                        <img
                                                            src={user.image ? `/assets/images/${user.image}` : '/assets/images/default_user_image.jpg'}
                                                            alt={user.name}
                                                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        {/* Thêm các thao tác xóa, khóa, mở khóa */}
                                                    </td>
                                                </tr>
                                            ))}
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

const AddUserForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        birthday: '',
        phone: '',
        role: 'false',
        gender: 'true',
        file: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            const userPayload = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                name: formData.name,
                birthday: formData.birthday,
                phone: formData.phone,
                role: formData.role === 'true',
                gender: formData.gender === 'true',
            };
            formDataToSend.append('user', JSON.stringify(userPayload));
            if (formData.file) {
                formDataToSend.append('file', formData.file);
            }

            const response = await axios.post('http://localhost:8080/api/users', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                alert('User added successfully!');
                onClose(); // Đóng popup sau khi thêm người dùng
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                setErrors(error.response.data.errors || {});
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Add User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    {errors.username && <div>{errors.username}</div>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <div>{errors.password}</div>}
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <div>{errors.email}</div>}
                </div>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <div>{errors.name}</div>}
                </div>
                <div>
                    <label>Birthday</label>
                    <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
                    {errors.birthday && <div>{errors.birthday}</div>}
                </div>
                <div>
                    <label>Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <div>{errors.phone}</div>}
                </div>
                <div>
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="true">Admin</option>
                        <option value="false">User</option>
                    </select>
                </div>
                <div>
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                </div>
                <div>
                    <label>Upload Image</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Thêm
                </button>

            </form>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default UserManagement; 