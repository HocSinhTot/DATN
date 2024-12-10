import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/brands')  // Replace with your backend API URL
            .then((response) => response.json())
            .then((data) => setBrands(data))
            .catch((error) => console.error('Error fetching brand data:', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            fetch(`http://localhost:8080/api/admin/brands/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Brand deleted successfully!');
                        setBrands(brands.filter(brand => brand.id !== id));  // Remove brand from the list
                    }
                })
                .catch((error) => console.error('Error deleting brand:', error));
        }
    };

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý thương hiệu</h5>
                                <Link to="/brands/add" className="btn btn-light">Thêm mới</Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên thương hiệu</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brands.length > 0 ? (
                                            brands.map((brand, index) => (
                                                <tr key={brand.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{brand.name}</td>
                                                    <td>
                                                        <Link to={`/brands/edit/${brand.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                                                        <button onClick={() => handleDelete(brand.id)} className="btn btn-danger btn-sm">Xóa</button>
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
            </div>
        </div>
    );
};

export default BrandManagement;
