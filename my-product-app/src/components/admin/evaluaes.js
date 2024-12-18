import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EvaluateManagement = () => {
    const [evaluateList, setEvaluateList] = useState([]);

    // Lấy dữ liệu từ API khi component được render
    useEffect(() => {
        fetch('http://localhost:8080/api/admin/evaluaes')  // URL API của backend
            .then((response) => response.json())
            .then((data) => setEvaluateList(data))
            .catch((error) => console.error('Error fetching evaluate data:', error));
    }, []);

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý đánh giá</h5>
                                
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>STT</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Sao</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Hình ảnh</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Bình luận</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Tên sản phẩm</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Tên người dùng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evaluateList.length > 0 ? (
                                            evaluateList.map((evaluate, index) => (
                                                <tr key={evaluate.id}>
                                                    <td>{evaluate.id}</td>
                                                    <td>
                                                        {/* Hiển thị sao theo số sao */}
                                                        {Array.from({ length: evaluate.star }, (_, i) => (
                                                            <i key={i} className="fa fa-star"></i>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        <img
                                                            src={`/assets/images/${evaluate.img}`}
                                                            alt="Product Image"
                                                            width="100"
                                                            height="100"
                                                        />
                                                    </td>
                                                    <td>{evaluate.comment}</td>
                                                    <td>{evaluate.product.name}</td>
                                                    <td>{evaluate.user.name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                                    Không có đánh giá nào
                                                </td>
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

export default EvaluateManagement;
