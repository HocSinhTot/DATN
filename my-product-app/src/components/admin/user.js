import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './Popup';  // Giả sử bạn đã có một component Popup

const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/users')
            .then((response) => response.json())
            .then((data) => setUserList(data))
            .catch((error) => console.error('Error fetching user data:', error));
    }, []);

    const openPopup = (message, onConfirm) => {
        setPopup({ show: true, message, onConfirm });
    };

    const handleEditUser = (user) => {
        setPopup({
            show: true,
            message: <EditUserForm user={user} onClose={() => setPopup({ show: false, message: '', onConfirm: null })} />
        });
    };

    const handleAddUser = () => {
        setPopup({
            show: true,
            message: <AddUserForm onClose={() => setPopup({ show: false, message: '', onConfirm: null })} />
        });
    };

    const handleBlock = (id) => {
        openPopup('Bạn có chắc chắn muốn khóa người dùng này không?', () => {
            fetch(`http://localhost:8080/api/admin/users/${id}/block`, {
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
            fetch(`http://localhost:8080/api/admin/users/${id}/unblock`, {
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

    const handleDelete = (id) => {
        openPopup('Bạn có chắc chắn muốn xóa người dùng này không?', () => {
            fetch(`http://localhost:8080/api/admin/users/${id}`, {
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

                                    <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý khách hàng</h5>
                                    {/* <button
                                        className="btn btn-light"
                                        style={{
                                            marginTop: '18px',
                                            backgroundColor: '#28a745',
                                            color: '#fff',
                                            padding: '12px 30px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onClick={handleAddUser}
                                    >
                                        <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
                                    </button> */}






                                </div>
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }} >STT</th>
                                                <th style={{ textAlign: 'center' }} >Tên</th>
                                                <th style={{ textAlign: 'center' }} >Email</th>
<th style={{ textAlign: 'center' }} >Ngày sinh</th>
                                                <th style={{ textAlign: 'center' }} >Số điện thoại</th>
                                                <th style={{ textAlign: 'center' }} >Vai trò</th>
                                                <th style={{ textAlign: 'center' }} >Trạng thái</th>
                                                <th style={{ textAlign: 'center' }} >Giới tính</th>
                                                <th style={{ textAlign: 'center' }} >Hình ảnh</th>
                                                <th style={{ textAlign: 'center' }} >Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userList.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td style={{ padding: '0px' }}>{index + 1}</td>
                                                    <td style={{ padding: '0px' }}>{user.username}</td>
                                                    <td style={{ padding: '0px' }}>{user.email}</td>

                                                    <td style={{ padding: '0px' }}>{formatDate(user.birthday)}</td>
                                                    <td style={{ padding: '0px' }}>{user.phone}</td>
                                                    <td style={{ padding: '0px' }}>{user.role ? 'Admin' : 'User'}</td>
                                                    <td style={{ padding: '0px' }}>{user.status ? 'Active' : 'Inactive'}</td>
                                                    <td style={{ padding: '0px' }}>{user.gender ? 'Male' : 'Female'}</td>
                                                    <td style={{ padding: '0px' }} >
                                                        <img
                                                            src={user.image ? `/assets/images/${user.image}` : '/assets/images/default_user_image.jpg'}
                                                            alt={user.name}
                                                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                        />
                                                    </td>







                                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                                        <button onClick={() => handleEditUser(user)}
                                                            style={{
                                                                backgroundColor: '#ffc107',
                                                                color: '#fff',
                                                                padding: '8px 20px',
                                                                borderRadius: '10px',
                                                                border: 'none',
                                                                cursor: 'pointer',
fontSize: '16px',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 5px 10px rgba(255, 193, 7, 0.3)',
                                                                transition: 'all 0.3s ease',
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.target.style.backgroundColor = '#e0a800';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.target.style.backgroundColor = '#ffc107';
                                                            }}
                                                        >
                                                            <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                                                        </button>



                                                        <button onClick={() => handleDelete(user.id)}
                                                            style={{
                                                                marginLeft: '20px',
                                                                backgroundColor: '#dc3545',
                                                                color: '#fff',
                                                                padding: '8px 20px',
                                                                borderRadius: '10px',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '16px',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                                                                transition: 'all 0.3s ease',
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.target.style.backgroundColor = '#a71d2a';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.target.style.backgroundColor = '#dc3545';
                                                            }}
                                                        >
<i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                                                        </button>


                                                        {user.status ? (


                                                            <button onClick={() => handleBlock(user.id)}
                                                                style={{
                                                                    marginLeft: '20px',
                                                                    backgroundColor: '#dc3545',
                                                                    color: '#fff',
                                                                    padding: '8px 20px',
                                                                    borderRadius: '10px',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontSize: '16px',
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.backgroundColor = '#a71d2a';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.backgroundColor = '#dc3545';
                                                                }}
                                                            >
                                                                <i className="fa fa-lock" style={{ fontSize: '20px' }}></i>
                                                            </button>


                                                        ) : (


                                                            <button onClick={() => handleUnblock(user.id)}
                                                                style={{
                                                                    marginLeft: '20px',
                                                                    backgroundColor: 'green',
                                                                    color: '#fff',
                                                                    padding: '8px 20px',
                                                                    borderRadius: '10px',
border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontSize: '16px',
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.backgroundColor = '#green';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.backgroundColor = '#green';
                                                                }}
                                                            >
                                                                <i className="fa fa-unlock" style={{ fontSize: '20px' }}></i>
                                                            </button>

                                                        )}
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

const EditUserForm = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        name: user.name,
        birthday: user.birthday,
        phone: user.phone,
        role: user.role ? 'true' : 'false',
        gender: user.gender ? 'true' : 'false',
        file: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            const userPayload = {
                username: formData.username,
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

            const response = await axios.put(`http://localhost:8080/api/admin/users/${user.id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                alert('User updated successfully!');
                onClose();
            }
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.errors || {});
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '30px 40px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
                width: '660px',
                maxWidth: '90%',
            }}>
                <h3 style={{
                    marginBottom: '25px',
                    fontSize: '22px',
                    fontWeight: 'bold',
                }}>Edit User</h3>
                <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="username" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                                onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                                onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                            />
                            {errors.username && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.username}</div>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label htmlFor="email" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                                onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                                onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                            />
                            {errors.email && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.email}</div>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="name" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                                onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                                onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                            />
                            {errors.name && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.name}</div>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label htmlFor="birthday" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Birthday
                            </label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                style={{
                                    padding: '4px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                                onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                                onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                            />
                            {errors.birthday && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.birthday}</div>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
<label htmlFor="phone" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                                onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                                onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                            />
                            {errors.phone && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.phone}</div>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label htmlFor="role" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                style={{
                                    padding: '13px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                }}
                            >
                                <option value="true">Admin</option>
                                <option value="false">User</option>
                            </select>
                            {errors.role && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.role}</div>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
<div style={{ flex: 1 }}>
                            <label htmlFor="gender" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={{
                                    padding: '13px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                }}
                            >
                                <option value="true">Male</option>
                                <option value="false">Female</option>
                            </select>
                            {errors.gender && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.gender}</div>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label htmlFor="file" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Profile Image
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={handleFileChange}
                                style={{
                                    padding: '9px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                }}
                            />
                            {errors.file && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.file}</div>}
                        </div>
                    </div>


                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '20px',
                        }}
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
fontWeight: 'bold',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Thêm
                        </button>

                        <button
                            type="reset"
                            className="btn btn-secondary"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};


const AddUserForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        birthday: '',
        phone: '',
        role: 'false',
        gender: 'true',
        file: null,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            const userPayload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
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

            const response = await axios.post('http://localhost:8080/api/admin/users', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                alert('User added successfully!');
                onClose();
}
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.errors || {});
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '30px 40px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
                width: '660px',
                maxWidth: '90%',
            }}>
                <h3 style={{ marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>Add User</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="username"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-control"
                                value={formData.username}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                                onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
                                onMouseEnter={(e) =>
                                    (e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)')
                                }
                                onMouseLeave={(e) =>
(e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)')
                                }
                            />
                            {errors.username && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
                                    {errors.username}
                                </div>
                            )}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="password"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                                onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
                                onMouseEnter={(e) =>
                                    (e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)')
                                }
                            />
                            {errors.password && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
                                    {errors.password}
                                </div>
                            )}
                        </div>


                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>

                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="email"
style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                                onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
                                onMouseEnter={(e) =>
                                    (e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)')
                                }
                            />
                            {errors.email && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
                                    {errors.email}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="name"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                style={{
padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                                onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
                                onMouseEnter={(e) =>
                                    (e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)')
                                }
                            />
                            {errors.name && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
                                    {errors.name}
                                </div>
                            )}
                        </div>


                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="birthday"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Birthday
                            </label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                className="form-control"
                                value={formData.birthday}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                                onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
                                onMouseEnter={(e) =>
                                    (e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)')
                                }
                            />
                            {errors.birthday && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
                                    {errors.birthday}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="phone"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Phone
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                                onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
                                onMouseEnter={(e) =>
                                    (e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)')
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)')
                                }
                            />
                            {errors.phone && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
{errors.phone}
                                </div>
                            )}
                        </div>


                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>

                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="role"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-control"
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                            >
                                <option value="">Select role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
                                    {errors.role}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label
                                htmlFor="gender"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    color: '#333',
                                }}
                            >
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="form-control"
                                style={{
padding: '10px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                    width: '100%',
                                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                                }}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.gender && (
                                <div className="text-danger" style={{ fontSize: '14px' }}>
                                    {errors.gender}
                                </div>
                            )}
                        </div>


                    </div>
                    <div style={{ flex: 1 }}>
                        <label
                            htmlFor="img"
                            style={{
                                fontWeight: 'bold',
                                marginBottom: '5px',
                                color: '#333',
                            }}
                        >
                            Profile Image
                        </label>
                        <input
                            type="file"
                            id="img"
                            name="img"
                            className="form-control"

                            onChange={handleFileChange}





                            style={{
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                marginBottom: '10px',
                                width: '100%',
                                transition: 'border 0.3s ease, box-shadow 0.3s ease',
                            }}
                        />
                        {errors.img && (
                            <div className="text-danger" style={{ fontSize: '14px' }}>
                                {errors.img}
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                            }}
                        >
<button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer', // Khi loading thì không thể click
                                    backgroundColor: loading ? '#ccc' : '#007bff', // Đổi màu khi loading
                                    boxShadow: loading ? 'none' : '0 5px 10px rgba(0, 123, 255, 0.3)', // Đổi shadow khi loading
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {loading ? 'Đang thêm...' : 'Thêm'}
                            </button>

                            <button
                                type="reset"
                                className="btn btn-secondary"
                                onClick={onClose}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </form>



            </div>
        </div>
    );
};


export default UserManagement;