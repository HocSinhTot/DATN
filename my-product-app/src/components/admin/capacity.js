import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CapacityManagement = () => {
    const [capacityList, setCapacityList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/capacity')  // API URL for fetching capacity data
            .then((response) => response.json())
            .then((data) => setCapacityList(data))
            .catch((error) => console.error('Error fetching capacity data:', error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this capacity?')) {
            fetch(`http://localhost:8080/api/admin/capacity/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Capacity deleted successfully!');
                        setCapacityList(capacityList.filter(capacity => capacity.id !== id));  // Remove deleted capacity from list
                    }
                })
                .catch((error) => console.error('Error deleting capacity:', error));
        }
    };

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý dung lượng</h5>
                                <Link to="/capacity/create" className="btn btn-light">
                                    Thêm mới
                                </Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Loại dung lượng</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {capacityList.length > 0 ? (
                                            capacityList.map((capacity, index) => (
                                                <tr key={capacity.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{capacity.name}</td>
                                                    <td>
                                                        <Link to={`/capacity/edit/${capacity.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                                                        <button onClick={() => handleDelete(capacity.id)} className="btn btn-danger btn-sm">Xóa</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center' }}>Không tìm thấy dung lượng nào</td>
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

export default CapacityManagement;
