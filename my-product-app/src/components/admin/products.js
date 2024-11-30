import React, { useState, useEffect } from 'react';  
import { Link } from 'react-router-dom';

const ProductManagement = () => {
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        // Fetch product data from API
        fetch('http://localhost:8080/api/products')  // API endpoint
            .then(response => response.json())
            .then(data => setProductList(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        alert('Product deleted successfully!');
                        setProductList(productList.filter(product => product.id !== id));  // Remove deleted product from list
                    }
                })
                .catch(error => console.error('Error deleting product:', error));
        }
    };

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý sản phẩm</h5>
                                <Link to="/products/add" className="btn btn-light">Thêm mới</Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Mô tả</th>
                                            <th>Giá</th>
                                            <th>Số lượng</th>
                                            <th>Danh mục</th>
                                            <th>Thương hiệu</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productList.length > 0 ? (
                                            productList.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.price}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.category ? product.category.name : 'N/A'}</td>
                                                    <td>{product.brand ? product.brand.name : 'N/A'}</td>
                                                    <td>
                                                        <Link to={`/products/edit/${product.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                                                        <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">Xóa</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center' }}>Không có sản phẩm nào</td>
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

export default ProductManagement;
