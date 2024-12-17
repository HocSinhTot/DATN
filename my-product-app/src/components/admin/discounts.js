import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DiscountManagement = () => {
    const [discount, setDiscount] = useState([]);
    const [popup, setPopup] = useState({ show: false, type: '', discount: null });

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/discounts')
            .then((response) => response.json())
            .then((data) => setDiscount(data))
            .catch((error) => console.error('Lỗi khi lấy dữ liệu mã giảm giá:', error));
    }, []);

    const handleDelete = (id) => {
        setPopup({ show: true, type: 'delete', discount: { id } });
    };

    const confirmDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/admin/discounts/${id}`);
            if (response.status === 200) {
                alert('Xóa mã giảm giá thành công!');
                setDiscount(discount.filter((discount) => discount.id !== id));
            }
            closePopup();
        } catch (error) {
            console.error('Lỗi khi xóa mã giảm giá:', error);
        }
    };

    const closePopup = () => {
        setPopup({ show: false, type: '', discount: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Lấy ngày hiện tại
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Thiết lập giờ của ngày hiện tại là 00:00:00
    
        // Chuyển đổi ngày bắt đầu và ngày kết thúc từ chuỗi thành đối tượng Date
        const startDate = new Date(popup.discount.startDate);
        const endDate = new Date(popup.discount.endDate);
    
        // Kiểm tra ngày bắt đầu không được nhỏ hơn ngày hiện tại
        if (startDate < currentDate) {
            alert('Ngày bắt đầu không được nhỏ hơn ngày hiện tại.');
            return;
        }
    
        // Kiểm tra ngày kết thúc không được nhỏ hơn ngày bắt đầu
        if (endDate < startDate) {
            alert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu.');
            return;
        }
    
        try {
            const discountData = {
                code: popup.discount.code,
                value: popup.discount.value,
                startDate: popup.discount.startDate,
                endDate: popup.discount.endDate,
            };
    
            const method = popup.type === 'edit' ? 'PUT' : 'POST';
            const url =
                popup.type === 'edit'
                    ? `http://localhost:8080/api/admin/discounts/${popup.discount.id}`
                    : 'http://localhost:8080/api/admin/discounts';
    
            const response = await axios({
                method,
                url,
                data: JSON.stringify(discountData),  // Serialize the data to JSON
                headers: {
                    'Content-Type': 'application/json',  // Set the correct content type
                },
            });
    
            if (response.status === 200 || response.status === 201) {
                alert(popup.type === 'edit' ? 'Cập nhật mã giảm giá thành công!' : 'Thêm mã giảm giá thành công!');
            }
    
            const updatedData = await axios.get('http://localhost:8080/api/admin/discounts');
            setDiscount(updatedData.data);
            closePopup();
        } catch (error) {
            console.error(`Lỗi khi ${popup.type === 'edit' ? 'cập nhật' : 'thêm'} mã giảm giá:`, error);
        }
    };
    
    return (
        <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="be-content" style={{ width: '1100px' }}>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>
                                Quản lý mã giảm giá
                            </h5>
                            <button
                                className="btn btn-success mb-3"
                                onClick={() => setPopup({ show: true, type: 'add', discount: null })}
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
                                onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
                                onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
                            >
                                <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
                            </button>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>STT</th>
                                        <th style={{ textAlign: 'center' }}>Mã giảm giá</th>
                                        <th style={{ textAlign: 'center' }}>Giá trị</th>
                                        <th style={{ textAlign: 'center' }}>Ngày bắt đầu</th>
                                        <th style={{ textAlign: 'center' }}>Ngày kết thúc</th>
                                        <th style={{ width: '500px', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {discount.length > 0 ? (
                                        discount.map((discount, index) => (
                                            <tr key={discount.id}>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{discount.code}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{discount.value}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
    {new Date(discount.startDate).toLocaleDateString('vi-VN')}
</td>
<td style={{ padding: '15px', textAlign: 'center' }}>
    {new Date(discount.endDate).toLocaleDateString('vi-VN')}
</td>

                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => setPopup({ show: true, type: 'edit', discount })}
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
                                                        onClick={() => handleDelete(discount.id)}
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
                                            <td colSpan="3" style={{ textAlign: 'center' }}>Không tìm thấy mã giảm giá nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup for Add / Edit / Delete Discount */}
            {popup.show && (
                <div
                    style={{
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
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '30px 40px',
                            borderRadius: '16px',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                            textAlign: 'center',
                            width: '660px',
                            maxWidth: '90%',
                        }}
                    >
                        <h3 style={{ marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                            {popup.type === 'edit'
                                ? 'Sửa mã giảm giá'
                                : popup.type === 'delete'
                                ? 'Xác nhận xóa'
                                : 'Thêm mã giảm giá'}
                        </h3>

                        {popup.type !== 'delete' ? (
                            // Form for Add/Edit Discount
                            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <div className="form-group">
                                    <label htmlFor="name" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Mã giảm giá
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.code : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, code: e.target.value } })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="value" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Giá trị
                                    </label>
                                    <input
                                        type="number"
                                        id="value"
                                        name="value"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.value : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, value: e.target.value } })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="startDate" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Ngày bắt đầu
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.startDate : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, startDate: e.target.value } })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="endDate" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Ngày kết thúc
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.endDate : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, endDate: e.target.value } })
                                        }
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
                                <p>Bạn có chắc chắn muốn xóa mã giảm giá này không?</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button className="btn btn-danger" onClick={() => confirmDelete(popup.discount.id)}>
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

export default DiscountManagement;
