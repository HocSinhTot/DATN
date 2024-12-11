import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [popup, setPopup] = useState({ show: false, type: '', brand: null });

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/brands')
            .then((response) => response.json())
            .then((data) => setBrands(data))
            .catch((error) => console.error('Error fetching brand data:', error));
    }, []);

    const handleDelete = (id) => {
        setPopup({ show: true, type: 'delete', brand: { id } });
    };

    const confirmDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/admin/brands/${id}`);
            if (response.status === 200) {
                alert('Brand deleted successfully!');
                setBrands(brands.filter(brand => brand.id !== id));
            }
            closePopup();
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const closePopup = () => {
        setPopup({ show: false, type: '', brand: null });
    };

    return (
        <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="be-content" style={{ width: '1100px' }}>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý thương hiệu</h5>
                            <button
                                className="btn btn-success mb-3"
                                onClick={() => setPopup({ show: true, type: 'add', brand: null })}
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
                                        <th style={{ textAlign: 'center' }}>Tên thương hiệu</th>
                                        <th style={{ width: '500px', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.length > 0 ? (
                                        brands.map((brand, index) => (
                                            <tr key={brand.id}>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{brand.name}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => setPopup({ show: true, type: 'edit', brand })}
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
                                                        onClick={() => handleDelete(brand.id)}
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
                                                    >
                                                        <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>Không tìm thấy thương hiệu nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup for Add / Edit / Delete Brand */}
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
                            {popup.type === 'edit' ? 'Sửa thương hiệu' : popup.type === 'delete' ? 'Xác nhận xóa' : 'Thêm thương hiệu'}
                        </h3>

                        {popup.type !== 'delete' ? (
                            // Form for Add/Edit Brand
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData();
                                formData.append("brand", JSON.stringify({ name: popup.brand.name }));
                                const method = popup.type === 'edit' ? 'PUT' : 'POST';
                                const url = popup.type === 'edit'
                                    ? `http://localhost:8080/api/admin/brands/${popup.brand.id}`
                                    : 'http://localhost:8080/api/admin/brands';
                                await axios({ method, url, data: formData });
                                const response = await axios.get('http://localhost:8080/api/admin/brands');
                                setBrands(response.data);
                                closePopup();
                            }} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <div className="form-group">
                                    <label htmlFor="name" style={{ fontWeight: 600, fontSize: '20px' }}>Tên thương hiệu</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={popup.brand ? popup.brand.name : ''}
                                        onChange={(e) => setPopup({ ...popup, brand: { ...popup.brand, name: e.target.value } })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary">
                                        {popup.type === 'edit' ? 'Cập nhật' : 'Thêm'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={closePopup}>
                                        Đóng
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Delete Confirmation
                            <div>
                                <p>Bạn có chắc chắn muốn xóa thương hiệu này không?</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button className="btn btn-danger" onClick={() => confirmDelete(popup.brand.id)}>
                                        Xóa
                                    </button>
                                    <button className="btn btn-secondary" onClick={closePopup}>
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandManagement;
