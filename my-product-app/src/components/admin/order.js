import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
    const [orderList, setOrderList] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const token = sessionStorage.getItem('token'); // Lấy token từ sessionStorage

    // Cấu hình fetch với header Authorization
    const fetchOptions = (method, body = null) => ({
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Thêm header Authorization
        },
        body: body ? JSON.stringify(body) : null,
    });

    useEffect(() => {
        // Fetch all orders from the API
        fetch('http://localhost:8080/api/admin/orders', fetchOptions('GET'))
            .then((response) => response.json())
            .then((data) => setOrderList(data))
            .catch((error) => console.error('Error fetching orders:', error));

        // Fetch all order statuses
        fetch('http://localhost:8080/api/admin/orderStatuses', fetchOptions('GET'))
            .then((response) => response.json())
            .then((data) => {
                // Ensure the fetched data is an array
                if (Array.isArray(data)) {
                    setStatuses(data);
                } else {
                    console.error('Expected an array for statuses');
                }
            })
            .catch((error) => console.error('Error fetching order statuses:', error));
    }, []);

    const handleUpdateStatus = (orderId, statusId) => {
        // Call API to update order status
        fetch(`http://localhost:8080/api/admin/orders/${orderId}/updateStatus`, fetchOptions('POST', { statusId }))
            .then((response) => {
                if (response.ok) {
                    alert('Order status updated successfully!');
                    setOrderList(orderList.map(order =>
                        order.id === orderId ? { ...order, orderStatus: { id: statusId } } : order
                    ));
                }
            })
            .catch((error) => console.error('Error updating order status:', error));
    };
    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý đơn hàng</h5>
                                <Link to="/order/add" className="btn btn-light">
                                    Thêm mới
                                </Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên người dùng</th>
                                            <th>Ngày đặt</th>
                                            <th>Tổng tiền</th>
                                            <th>Địa chỉ</th>
                                            <th>Phương thức thanh toán</th>
                                            <th>Trạng thái</th>
                                            <th>Chi tiết</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderList.length > 0 ? (
                                            orderList.map((order, index) => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.user.name}</td>
                                                    <td>{order.date}</td>
                                                    <td>{order.total}</td>
                                                    <td>{order.address}</td>
                                                    <td>{order.paymentMethod.methods}</td>
                                                    <td>
                                                        <select
                                                            value={order.orderStatus.id}
                                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                            className="form-control"
                                                        >
                                                            {Array.isArray(statuses) && statuses.length > 0 ? (
                                                                statuses.map(status => (
                                                                    <option key={status.id} value={status.id}>
                                                                        {status.status}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option value="">No statuses available</option>
                                                            )}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <Link to={`/order/${order.id}/details`} className="btn btn-info">
                                                            Xem chi tiết
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy đơn hàng nào</td>
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

export default OrderManagement;
