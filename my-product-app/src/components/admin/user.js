import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './Popup';  // Giả sử bạn đã có một component Popup

import Swal from 'sweetalert2';
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
            message: <EditUserForm user={user} setUserList={setUserList} onClose={() => setPopup({ show: false, message: '', onConfirm: null })} />
        });
    };
    const handleBlock = (id) => {
        openPopup('Bạn có chắc chắn muốn khóa người dùng này không?', () => {
            fetch(`http://localhost:8080/api/admin/users/${id}/block`, {
                method: 'PUT',
            })
                .then((response) => {
                    if (response.ok) {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Khóa người dùng thành công.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000,
                            timerProgressBar: true,
                        });

                        setUserList(userList.map((user) => (user.id === id ? { ...user, status: false } : user)));
                    }
                })
                .catch((error) => {
                    console.error('Error blocking user:', error);
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi khóa người dùng.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                })
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
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Mở khóa người dùng thành công.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000,
                            timerProgressBar: true,
                        });

                        setUserList(userList.map((user) => (user.id === id ? { ...user, status: true } : user)));
                    }
                })
                .catch((error) => {
                    console.error('Error unblocking user:', error);
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi mở khóa người dùng.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                })
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
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Xóa người dùng thành công.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000,
                            timerProgressBar: true,
                        });

                        setUserList(userList.filter((user) => user.id !== id));
                    }
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi xóa người dùng.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                })
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
                                <div
                                    className="card-header"
                                    style={{
                                        background: 'linear-gradient(90deg, rgb(44, 62, 80), rgb(52, 73, 94))',
                                        color: '#fff' // Để chữ hiển thị rõ hơn trên nền tối
                                    }}
                                >

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
                                                <th style={{ textAlign: 'center', }} >STT</th>
                                                <th style={{ textAlign: 'center', }} >Tên</th>
                                                <th style={{ textAlign: 'center', }} >Email</th>
                                                <th style={{ textAlign: 'center', }} >Ngày sinh</th>
                                                <th style={{ textAlign: 'center', }} >Số điện thoại</th>
                                                <th style={{ textAlign: 'center', }} >Vai trò</th>
                                                <th style={{ textAlign: 'center', }} >Trạng thái</th>
                                                <th style={{ textAlign: 'center', }} >Giới tính</th>
                                                <th style={{ textAlign: 'center', }} >Hình ảnh</th>
                                                <th style={{ textAlign: 'center', }} >Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userList.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td style={{ padding: '20px' }}>{index + 1}</td>
                                                    <td style={{ padding: '20px' }}>{user.username}</td>
                                                    <td style={{ padding: '20px' }}>{user.email}</td>

                                                    <td style={{ padding: '20px' }}>{formatDate(user.birthday)}</td>
                                                    <td style={{ padding: '20px' }}>{user.phone}</td>
                                                    <td style={{ padding: '20px' }}>{user.role ? 'Quản lý' : 'Khách hàng'}</td>
                                                    <td style={{ padding: '20px' }}>{user.status ? 'Mở' : 'Khóa'}</td>
                                                    <td style={{ padding: '20px' }}>{user.gender ? 'Nam' : 'Nữ'}</td>
                                                    <td style={{ padding: '20px' }} >
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

const EditUserForm = ({ user, setUserList, onClose }) => {
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

        // Kiểm tra các trường
        const newErrors = {};

        // Kiểm tra trường username (ít nhất 5 ký tự)
        if (!formData.username.trim()) {
            newErrors.username = 'Tên người dùng không được để trống!';
        } else if (formData.username.length < 5) {
            newErrors.username = 'Tên người dùng phải có ít nhất 5 ký tự!';
        }

        // Kiểm tra email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|fpt\.edu\.vn)$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống!';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email phải kết thúc bằng @gmail.com hoặc @fpt.edu.vn!';
        }

        // Kiểm tra trường name (tên không được có số hoặc ký tự đặc biệt)
        const nameRegex = /^[A-Za-z\s]+$/; // Chỉ cho phép chữ cái và khoảng trắng
        if (!formData.name.trim()) {
            newErrors.name = 'Tên không được để trống!';
        } else if (!nameRegex.test(formData.name)) {
            newErrors.name = 'Tên không được có số hoặc ký tự đặc biệt!';
        }

        // Kiểm tra trường birthday (ngày sinh phải đủ 18 tuổi)
        if (!formData.birthday.trim()) {
            newErrors.birthday = 'Ngày sinh không được để trống!';
        } else {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.birthday = 'Bạn phải đủ 18 tuổi!';
            }
        }

        // Kiểm tra trường phone (số điện thoại bắt đầu bằng 09 và có đúng 10 chữ số)
        const phoneRegex = /^09\d{8}$/; // Số điện thoại phải bắt đầu bằng "09" và có đúng 10 chữ số
        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại không được để trống!';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 09, không chứa ký tự đặc biệt hoặc chữ cái!';
        }

        // Nếu có lỗi, không tiếp tục gửi yêu cầu
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }


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
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Cập nhật thông tin người dùng thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                });

                setUserList((prevList) =>
                    prevList.map((u) => (u.id === user.id ? { ...u, ...userPayload } : u))
                );
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
                }}>Sửa người dùng</h3>
                <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="username" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Tên người dùng
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
                                Tên
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
                                Ngày sinh
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
                                Số điện thoại
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
                                Vai trò
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
                                <option value="true">Quản lý</option>
                                <option value="false">Khách hàng</option>
                            </select>
                            {errors.role && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.role}</div>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label htmlFor="gender" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Giới tính
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
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
                            {errors.gender && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.gender}</div>}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label htmlFor="file" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                Hình ảnh
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
                            Cập nhật
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



export default UserManagement;