import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories from your API
        fetch('http://localhost:8080/api/categories')  // Replace with your API URL
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            fetch(`http://localhost:8080/api/admin/category/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Category deleted successfully!');
                        setCategories(categories.filter(category => category.id !== id));
                    }
                })
                .catch((error) => console.error('Error deleting category:', error));
        }
    };

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý danh mục</h5>
                                <Link to="/category/add" className="btn btn-light">
                                    Thêm mới
                                </Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên danh mục</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.length > 0 ? (
                                            categories.map((category, index) => (
                                                <tr key={category.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{category.name}</td>
                                                    <td>
                                                        <Link to={`/category/edit/${category.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                                                        <button onClick={() => handleDelete(category.id)} className="btn btn-danger btn-sm">Xóa</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center' }}>Không tìm thấy danh mục nào</td>
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

export default CategoryManagement;
