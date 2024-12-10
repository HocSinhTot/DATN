import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ColorManagement = () => {
    const [colorList, setColorList] = useState([]);
    const [popup, setPopup] = useState({ show: false, type: '', color: null }); // Manage popup state
    const [currentColor, setCurrentColor] = useState({ name: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Loading state for form submission

    // Fetch color data when the component mounts
    useEffect(() => {
        fetchColors();
    }, []);

    // Fetch color list from the API
    const fetchColors = () => {
        fetch('http://localhost:8080/api/admin/colors', fetchOptions('GET')) // API endpoint to fetch colors
            .then((response) => response.json())
            .then((data) => setColorList(data))
            .catch((error) => console.error('Error fetching color data:', error));
    };

    // Fetch options with headers for API requests
    const fetchOptions = (method, body = null) => {
        const token = sessionStorage.getItem("token");
        return {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : null,
        };
    };

    // Handle deleting a color
    const handleDelete = (color) => {
        setPopup({ show: true, type: 'delete', color });
    };

    // Confirm delete action
    const confirmDelete = (colorId) => {
        fetch(`http://localhost:8080/api/admin/colors/${colorId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    setColorList(colorList.filter((color) => color.id !== colorId));
                    alert('Color deleted successfully!');
                }
            })
            .catch((error) => console.error('Error deleting color:', error));
        setPopup({ show: false, type: '', color: null });
    };

    // Handle form submit for adding or editing a color
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('color', JSON.stringify({ name: currentColor.name }));

        try {
            let response;
            if (popup.type === 'edit') {
                // PUT request for editing a color
                response = await axios.put(
                    `http://localhost:8080/api/admin/colors/${currentColor.id}`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );
            } else {
                // POST request for adding a new color
                response = await axios.post('http://localhost:8080/api/admin/colors', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            if (response.status === 200) {
                alert(`Color ${popup.type === 'edit' ? 'updated' : 'added'} successfully!`);
                if (popup.type === 'edit') {
                    setColorList(colorList.map((color) => (color.id === currentColor.id ? response.data : color)));
                } else {
                    setColorList([...colorList, response.data]);
                }
                closeModal();
            }
        } catch (error) {
            setErrors(error.response?.data.errors || {});
        } finally {
            setLoading(false);
        }
    };

    // Open modal for adding a color
    const openAddModal = () => {
        setPopup({ show: true, type: 'add', color: null });
        setCurrentColor({ name: '' });
    };

    // Open modal for editing a color
    const openEditModal = (color) => {
        setPopup({ show: true, type: 'edit', color });
        setCurrentColor(color);
    };

    // Close modal and reset errors
    const closeModal = () => {
        setPopup({ show: false, type: '', color: null });
        setErrors({});
    };

    return (
        <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="be-content" style={{ width: '1100px' }}>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý màu sắc</h5>
                            <button
                                className="btn btn-success mb-3"
                                onClick={openAddModal}
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
                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                            >
                                <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>

                            </button>


                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>STT</th>
                                        <th style={{ textAlign: 'center' }}>Tên màu</th>
                                        <th style={{ width: '500px', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {colorList.length > 0 ? (
                                        colorList.map((color, index) => (
                                            <tr key={color.id}>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{color.id}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{color.name}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => openEditModal(color)}
                                                        style={{
                                                            backgroundColor: '#ffc107',
                                                            color: '#fff',
                                                            padding: '12px 30px',
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

                                                    <button
                                                        onClick={() => handleDelete(color)}
                                                        style={{
                                                            marginLeft: '60px',
                                                            backgroundColor: '#dc3545',
                                                            color: '#fff',
                                                            padding: '12px 30px',
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
                                                    >    <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                                                        <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                                                    </button>
                                                </td>
                                            </tr>

                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Popup for Add / Edit Color */}
                    {/* Popup for Add / Edit Color */}
                    {popup.show && (
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
                                <h3 style={{ marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                                    {popup.type === 'edit' ? 'Sửa màu sắc' : popup.type === 'delete' ? 'Xác nhận xóa' : 'Thêm màu sắc'}
                                </h3>

                                {/* Form for add/edit color */}
                                {popup.type !== 'delete' ? (
                                    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                        <div className="form-group">
                                            <label style={{ fontWeight: 600, fontSize: '20px' }} htmlFor="name">Tên màu sắc</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                value={currentColor.name}
                                                onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                                                required
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>

                                        {/* Buttons - Align Add and Close on the same line */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                                style={{
                                                    padding: '10px 20px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    boxShadow: 'rgba(0, 123, 255, 0.3) 0px 5px 10px',
                                                    transition: '0.3s',
                                                }}
                                            >
                                                {loading ? 'Đang xử lý...' : popup.type === 'edit' ? 'Cập nhật' : 'Thêm'}
                                            </button>

                                            <button
                                                className="btn btn-secondary"
                                                onClick={closeModal}
                                                style={{
                                                    padding: '10px 20px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    boxShadow: 'rgba(0, 123, 255, 0.3) 0px 5px 10px',
                                                    transition: '0.3s',
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                Đóng
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <p>Bạn có chắc chắn muốn xóa màu sắc này không?</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => confirmDelete(popup.color.id)}
                                                style={{
                                                    padding: '10px 20px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    boxShadow: 'rgba(0, 123, 255, 0.3) 0px 5px 10px',
                                                    transition: '0.3s',
                                                }}
                                            >
                                                Xóa
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={closeModal}
                                                style={{
                                                    padding: '10px 20px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    boxShadow: 'rgba(0, 123, 255, 0.3) 0px 5px 10px',
                                                    transition: '0.3s',
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ColorManagement;
