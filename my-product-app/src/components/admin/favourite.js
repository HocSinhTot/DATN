import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [favouriteList, setFavouriteList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/favourite') // API URL for fetching favourite list
            .then((response) => response.json())
            .then((data) => setFavouriteList(data))
            .catch((error) => console.error('Error fetching favourite data:', error));
    }, []);

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý yêu thích</h5>
                               
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>STT</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Tên người dùng</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Tên sản phẩm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {favouriteList.length > 0 ? (
                                            favouriteList.map((favourite, index) => (
                                                <tr key={favourite.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{favourite.user.name}</td>
                                                    <td>{favourite.product.name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center' }}>Không tìm thấy yêu thích nào</td>
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

export default UserManagement;
