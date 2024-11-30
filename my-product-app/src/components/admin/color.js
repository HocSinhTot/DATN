import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ColorManagement = () => {
    const [colorList, setColorList] = useState([]);

    // Fetch color data when the component mounts
    useEffect(() => {
        fetch('http://localhost:8080/api/colors')  // API endpoint to fetch colors
            .then((response) => response.json())
            .then((data) => setColorList(data))
            .catch((error) => console.error('Error fetching color data:', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this color?')) {
            fetch(`http://localhost:8080/api/colors/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Color deleted successfully!');
                        setColorList(colorList.filter(color => color.id !== id));  // Remove color from list
                    }
                })
                .catch((error) => console.error('Error deleting color:', error));
        }
    };

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý màu sắc</h5>
                                <Link to="/color/add" className="btn btn-light">Thêm mới</Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên màu</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {colorList.length > 0 ? (
                                            colorList.map((color, index) => (
                                                <tr key={color.id}>
                                                    <td>{color.id}</td>
                                                    <td>{color.name}</td>
                                                    <td>
                                                        <Link to={`/color/edit/${color.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                                                        <button onClick={() => handleDelete(color.id)} className="btn btn-danger btn-sm">Xóa</button>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorManagement;
