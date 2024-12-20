import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Popup from './Popup';

const EvaluateManagement = () => {
    const [evaluateList, setEvaluateList] = useState([]);
    const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });

    // Lấy dữ liệu từ API khi component được render
    useEffect(() => {
        fetch('http://localhost:8080/api/admin/evaluaes')  // URL API của backend
            .then((response) => response.json())
            .then((data) => setEvaluateList(data))
            .catch((error) => console.error('Error fetching evaluate data:', error));
    }, []);

    const openPopup = (message, onConfirm) => {
        setPopup({ show: true, message, onConfirm });
    };
    const handleBlock = (id) => {
        openPopup('Bạn có chắc chắn đóng đánh giá này không?', () => {
            fetch(`http://localhost:8080/api/admin/evaluaes/${id}/block`, {
                method: 'PUT',
            })
                .then((response) => {
                    console.log('Response Status:', response.status);  // Log trạng thái HTTP trả về
                    if (response.ok) {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Khóa đánh giá thành công',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000,
                            timerProgressBar: true,
                        });

                        // Cập nhật danh sách trạng thái đánh giá
                        setEvaluateList((prevList) =>
                            prevList.map((evaluate) =>
                                evaluate.id === id ? { ...evaluate, status: false } : evaluate
                            )
                        );
                    } else {
                        console.error('Error: Response not OK');  // Log khi phản hồi không thành công
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Có lỗi xảy ra khi khóa đánh giá',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error blocking evaluation:', error);  // Log lỗi từ catch
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi khóa đánh giá',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                })
                .finally(() => setPopup({ show: false, message: '', onConfirm: null }));
        });
    };

    const handleUnblock = (id) => {
        openPopup('Bạn có chắc chắn muốn duyệt đánh giá này không?', () => {
            fetch(`http://localhost:8080/api/admin/evaluaes/${id}/unblock`, {
                method: 'PUT',
            })
                .then((response) => {
                    console.log('Response Status:', response.status);  // Log trạng thái HTTP trả về
                    if (response.ok) {
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Duyệt đánh giá thành công',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000,
                            timerProgressBar: true,
                        });

                        // Cập nhật danh sách trạng thái đánh giá
                        setEvaluateList((prevList) =>
                            prevList.map((evaluate) =>
                                evaluate.id === id ? { ...evaluate, status: true } : evaluate
                            )
                        );
                    } else {
                        console.error('Error: Response not OK');  // Log khi phản hồi không thành công
                        Swal.fire({
                            title: 'Lỗi!',
                            text: 'Có lỗi xảy ra khi mở khóa đánh giá',
                            icon: 'error',
                            confirmButtonText: 'OK',
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error unblocking evaluation:', error);  // Log lỗi từ catch
                    Swal.fire({
                        title: 'Lỗi!',
                        text: 'Có lỗi xảy ra khi mở khóa đánh giá',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                })
                .finally(() => setPopup({ show: false, message: '', onConfirm: null }));
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
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Trạng thái</th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Thao tác</th>
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
                                                                src={`${evaluate.img}`}
                                                                alt="Product Image"
                                                                width="100"
                                                                height="100"
                                                            />
                                                        </td>
                                                        <td>{evaluate.comment}</td>
                                                        <td>{evaluate.product.name}</td>
                                                        <td>{evaluate.user.name}</td>
                                                        <td>{evaluate.status ? 'Mở' : 'Khóa'}</td>
                                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                                            {evaluate.status ? (


                                                                <button onClick={() => handleBlock(evaluate.id)}
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


                                                                <button onClick={() => handleUnblock(evaluate.id)}
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
        </>
    );
};

export default EvaluateManagement;