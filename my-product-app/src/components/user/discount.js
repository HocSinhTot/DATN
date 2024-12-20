import React, { useState, useEffect } from 'react';
import Notification from './Notification';

const Discount = () => {
  const [discount, setDiscount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountDetails, setDiscountDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const userId = sessionStorage.getItem('userId');
  const [rating, setRating] = useState(0); // State cho số sao
  const [reviewText, setReviewText] = useState(""); // State cho text review
  const [images, setImages] = useState([null, null, null]); // State cho hình ảnh


  const [isOpen, setIsOpen] = useState(false);

  // Mở Popup
  const handleOpenPopup = () => {
    setIsOpen(true);
  };

  // Đóng Popup
  const handleClosePopup = () => {
    setIsOpen(false);
  };

  // Format ngày
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/discount', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        console.log(data); // Kiểm tra dữ liệu nhận được từ API

        // Lọc mã giảm giá chưa hết hạn
        const filteredDiscounts = data.filter((discount) => {
          const currentDate = new Date();
          const endDate = new Date(discount.endDate);
          return endDate >= currentDate; // Lọc những mã giảm giá có ngày kết thúc lớn hơn hoặc bằng ngày hiện tại
        });

        setDiscount(filteredDiscounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);


  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success')
  const handleCopy = (code) => {
    // Sử dụng Clipboard API để sao chép mã giảm giá vào clipboard
    navigator.clipboard.writeText(code).then(() => {
      setNotificationMessage(`Mã giảm giá ${code} đã được lấy!`);
      setNotificationType('success');
      setShowNotification(true);

      // Ẩn thông báo sau 3 giây
      setTimeout(() => setShowNotification(false), 3000);
    }).catch(err => {
      setNotificationMessage('Không thể sao chép mã giảm giá.');
      setNotificationType('error');
      setShowNotification(true);

      // Ẩn thông báo sau 3 giây
      setTimeout(() => setShowNotification(false), 3000);
    });
  };
  const fetchOrderDetails = async (discountId) => {
    try {
      setDetailsLoading(true);
      setDiscountDetails(null);
      const response = await fetch(`http://localhost:8080/api/discount`);
      if (!response.ok) throw new Error('Failed to fetch order details');

      const data = await response.json();
      setDiscountDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setDiscountDetails(null);
    setIsCancelModalOpen(false);
  };

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
        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          Mã giảm giá
        </h2>

        {/* Thông báo */}
        <Notification
          message={notificationMessage}
          type={notificationType}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />

        {/* Kiểm tra dữ liệu */}
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>Lỗi: {error}</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {discount.map((discount) => (
              <div
                key={discount.id}
                style={{
                  width: '300px', // Điều chỉnh lại chiều rộng mỗi mã giảm giá
                  backgroundColor: '#fff',
                  borderRadius: '15px',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                  padding: '20px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  display: 'flex',
                  flexDirection: 'column', // Xếp các phần tử theo chiều dọc
                  gap: '16px', // Khoảng cách giữa các phần tử
                  alignItems: 'center', // Căn giữa các phần tử
                  justifyContent: 'space-between',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px', // Tăng kích thước icon
                    fontWeight: 'bold',
                  }}
                >
                  <span>🌟</span>
                </div>

                {/* Thông tin mã giảm giá */}
                <div style={{ fontSize: '14px', textAlign: 'center' }}>
                  <p style={{ marginRight: '-10px' }} >
                    <strong style={{ marginRight: '28px' }}>Mã giảm giá:</strong> {discount.code}
                  </p>
                  <p style={{ marginRight: '48px' }}>
                    <strong style={{ marginRight: '48px' }} >Giảm giá:</strong> {discount.value}%
                  </p>
                  <p style={{ marginRight: '8px' }} >
                    <strong style={{ marginRight: '18px' }} >Ngày bắt đầu:</strong> {formatDate(discount.startDate)}
                  </p>
                  <p style={{ marginRight: '6px' }} >
                    <strong style={{ marginRight: '17px' }}  >Ngày kết thúc:</strong> {formatDate(discount.endDate)}
                  </p>
                </div>

                {/* Nút hành động */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleCopy(discount.code)}
                    style={{
                      backgroundColor: '#FF5722',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '12px 25px', // Tăng kích thước padding
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      width: '100%',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#E64A19';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF5722';
                    }}
                  >
                    Lấy mã
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

};

export default Discount;
