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

  const closeModal = () => {
    setOrderDetails(null);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'Không xác định'; // Trả về thông báo nếu giá trị không hợp lệ
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there is an issue
  }

  return (
    <div style={{ maxWidth: '1350px', margin: '20px auto', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '2.5rem', textAlign: 'center', color: '#333', marginBottom: '20px' }}>Lịch sử đơn hàng</h2>

      <div className="table-responsive">
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '1.2rem', height: 'auto' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: '#fff' }}>STT</th>
              <th style={{ border: '1px solid #ddd', padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: '#fff' }}>Ngày mua hàng</th>
              <th style={{ border: '1px solid #ddd', padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: '#fff' }}>Tổng tiền</th>
              <th style={{ border: '1px solid #ddd', padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: '#fff' }}>Địa chỉ</th>
              <th style={{ border: '1px solid #ddd', padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: '#fff' }}>Trạng thái</th>
              <th style={{ border: '1px solid #ddd', padding: '12px 15px', textAlign: 'left', backgroundColor: '#007bff', color: '#fff' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} style={index % 2 === 0 ? { backgroundColor: '#f9f9f9' } : {}}>
                <td style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px' }}>{index + 1}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px' }}>{formatDate(order.date)}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px' }}>{formatCurrency(order.total)}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px' }}>{order.address}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px' }}>{order.orderStatus.status}</td>
                <td style={{ padding: '12px 15px', textAlign: 'left', fontSize: '14px' }}>
                  <button
                    onClick={() => fetchOrderDetails(order.id)}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#17a2b8',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {orderDetails && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#ffffff',
              padding: '25px 40px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              zIndex: '1000',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <h3
              style={{
                marginBottom: '20px',
                fontSize: '24px',
                fontWeight: '700',
                textAlign: 'center',
                color: '#4a90e2',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '10px',
              }}
            >
              Chi tiết đơn hàng
            </h3>
            <ul style={{ padding: '0', margin: '0', listStyleType: 'none' }}>
              {orderDetails.map((detail, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#f4f8fb',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    fontSize: '16px',
                    color: '#333',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <strong style={{ color: '#4a90e2' }}>Sản phẩm:</strong> {detail.product.name}
                  <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <img
                      src={`/assets/images/${detail.product.productsImages[0].image.url}`}
                      alt={detail.product.name}
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '10px',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
                      }}
                    />




                  </div>
                  <strong style={{ color: '#4a90e2' }}>Số lượng:</strong> {detail.totalQuantity} <br />
                  <strong style={{ color: '#4a90e2' }}>Tổng tiền:</strong> {detail.totalPrice} VND
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              style={{
                display: 'block',
                margin: '30px auto 0',
                backgroundColor: '#4a90e2',
                color: '#fff',
                padding: '12px 25px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#357abd';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#4a90e2';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Đóng
            </button>
          </div>
        )}
      </ul>




      {/* Modal hiển thị chi tiết đơn hàng */}





      {orderDetails && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '999',
          }}
        ></div>
      )}
    </div>
  );
};

export default OrderHistory;
