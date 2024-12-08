import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [orderIdToCancel, setOrderIdToCancel] = useState(null);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setDetailsLoading(true);
      setOrderDetails(null);
      const response = await fetch(`http://localhost:8080/api/history/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setOrderDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setOrderDetails(null);
    setIsCancelModalOpen(false);
    setCancelReason('');
  };

  const openCancelModal = (orderId) => {
    setOrderIdToCancel(orderId);
    setIsCancelModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      alert('Vui lòng nhập lý do hủy!');
      return;
    }

    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
    if (!confirmCancel) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cancel/${orderIdToCancel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (!response.ok) throw new Error('Hủy đơn hàng thất bại');

      alert('Hủy đơn hàng thành công');
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderIdToCancel));
      closeModal();
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatCurrency = (amount) =>
    amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div className="spinner" />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="order-page"
      style={{
        maxWidth: '1350px',
        margin: '20px auto',
        padding: '20px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '20px auto', padding: '10px' }}>
        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '2.5rem' }}>
          Đơn hàng của bạn
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                width: '300px',
                backgroundColor: '#fff',
                borderRadius: '15px',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                padding: '20px',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              <div>
                <p>
                  <strong>Ngày mua:</strong> {formatDate(order.date)}
                </p>
                <p>
                  <strong>Tổng tiền:</strong> {formatCurrency(order.total)}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {order.address}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  <span
                    style={{
                      color:
                        order.orderStatus.status === 'Hoàn thành'
                          ? 'green'
                          : order.orderStatus.status === 'Đang xử lý'
                            ? 'orange'
                            : 'red',
                    }}
                  >
                    {order.orderStatus.status}
                  </span>
                </p>
              </div>
              <button
                onClick={() => fetchOrderDetails(order.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>

        {/* Modal hiển thị chi tiết đơn hàng */}
        {/* Modal hiển thị chi tiết đơn hàng */}
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
              maxWidth: '1000px',
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
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e6f0fa'; // Màu nền khi hover
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)'; // Thêm bóng đổ khi hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f4f8fb'; // Quay lại màu nền ban đầu
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)'; // Quay lại bóng đổ ban đầu
                  }}
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
                  <strong style={{ color: '#4a90e2' }}>Giá:</strong> {formatCurrency(detail.product.price)} <br />
                </li>
              ))}
            </ul>

            <div style={{ textAlign: 'right', marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ccc',
                  border: 'none',
                  borderRadius: '5px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              >
                Đóng
              </button>
              <button
                onClick={() => openCancelModal(orderDetails[0].orderId)} // Lấy orderId từ chi tiết đơn hàng
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ff6b6b',
                  border: 'none',
                  borderRadius: '5px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#d9534f')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ff6b6b')}
              >
                Hủy đơn hàng
              </button>
            </div>


          </div>
        )}

        {/* Modal hủy đơn hàng */}
        {isCancelModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '25px 40px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              zIndex: '1000',
              width: '90%',
              maxWidth: '700px',
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <h3
              style={{
                marginBottom: '20px',
                fontSize: '24px',
                fontWeight: '700',
                textAlign: 'center',
                color: '#e74c3c',
              }}
            >
              Hủy đơn hàng
            </h3>
            <textarea
              placeholder="Lý do hủy đơn hàng"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{
                width: '100%',
                height: '100px',
                borderRadius: '5px',
                padding: '10px',
                border: '1px solid #ccc',
                marginBottom: '20px',
                fontSize: '16px',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleCancelOrder}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  border: 'none',
                  borderRadius: '5px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              >
                Xác nhận hủy
              </button>
              <button
                onClick={closeModal}
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ccc',
                  border: 'none',
                  borderRadius: '5px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
