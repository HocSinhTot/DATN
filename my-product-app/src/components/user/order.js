import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [orderDetails, setOrderDetails] = useState(null); // State to store order details for modal
  const userId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/history', {
          method: 'POST', // Sử dụng POST
          headers: {
            'Content-Type': 'application/json', // Đảm bảo gửi dữ liệu JSON
          },
          body: JSON.stringify({ userId: userId }), // Gửi userId trong body
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data); // Lưu dữ liệu đơn hàng vào state
      } catch (err) {
        setError(err.message); // Xử lý lỗi
      } finally {
        setLoading(false); // Đặt loading thành false
      }
    };

    fetchOrders(); // Gọi hàm khi component render
  }, []); // useEffect chỉ chạy một lần khi component được mount

  // Fetch order details by orderId
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/history/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrderDetails(data); // Lưu chi tiết đơn hàng vào state
    } catch (err) {
      setError(err.message); // Xử lý lỗi
    }
  };

  // Close the modal (reset order details)
  const closeModal = () => {
    setOrderDetails(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there is an issue
  }

  const tableStyle = {
    width: '100%',
    backgroundColor: '#fff',
    borderCollapse: 'collapse',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '20px',
  };

  const thTdStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const tdStyle = {
    fontWeight: 'normal',
  };

  const tbodyRowHoverStyle = {
    backgroundColor: '#f5f5f5',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', backgroundColor: '#f0f0f0' }}>
      <div className="breadcrumb">
        <div className="container">
          <div className="breadcrumb-inner"></div>
        </div>
      </div>

      <div className="body-content">
        <div className="container">
          <div className="my-wishlist-page">
            <div className="row">
              <div className="col-md-12 my-wishlist">
                <div className="table-responsive">
                  <table className="table" style={tableStyle}>
                    <thead>
                      <tr>
                        <th scope="col" style={thTdStyle}>STT</th>
                        <th scope="col" style={thTdStyle}>Ngày mua hàng</th>
                        <th scope="col" style={thTdStyle}>Tổng tiền</th>
                        <th scope="col" style={thTdStyle}>Địa chỉ</th>
                        <th scope="col" style={thTdStyle}>Trạng thái</th>
                        <th scope="col" style={thTdStyle}>Hành động</th> {/* Cột hành động */}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index} style={index % 2 === 0 ? { ...tbodyRowHoverStyle } : {}}>
                          <th scope="row" style={thTdStyle}>{index + 1}</th>
                          <td style={tdStyle}>{order.date}</td>
                          <td style={tdStyle}>{order.total}</td>
                          <td style={tdStyle}>{order.address}</td>
                          <td style={tdStyle}>{order.orderStatus.status}</td>
                          <td style={tdStyle}>
                            <button 
                              onClick={() => fetchOrderDetails(order.id)} 
                              className="btn btn-info">Xem chi tiết</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal hiển thị chi tiết đơn hàng */}
      {orderDetails && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', zIndex: '1000' }}>
          <h4>Chi tiết đơn hàng</h4>
          <ul>
            {orderDetails.map((detail, idx) => (
              <li key={idx}>
                Sản phẩm: {detail.product.name} | Số lượng: {detail.totalQuantity} | Tổng tiền: {detail.totalPrice}
              </li>
            ))}
          </ul>
          <button onClick={closeModal} style={{ backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>Đóng</button>
        </div>
      )}

      {/* Overlay when modal is open */}
      {orderDetails && (
        <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' }}></div>
      )}
    </div>
  );
};

export default OrderHistory;
