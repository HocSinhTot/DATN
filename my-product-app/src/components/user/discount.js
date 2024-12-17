import React, { useState, useEffect } from 'react';

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
        setDiscount(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [userId]);

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

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
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
        <h2 style={{ textAlign: 'center', color: '#333', fontSize: '2.5rem' }}>
          Mã giảm giá
        </h2>
        {/* Kiểm tra xem dữ liệu có rỗng không */}
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
                    <strong>Mã giảm giá:</strong> {discount.code}
                  </p>
                  <p>
                    <strong>Giá trị giảm:</strong> {discount.value}
                  </p>
                  <p>
                    <strong>Ngày bắt đầu:</strong> {formatDate(discount.startDate)}
                  </p>
                  <p>
                    <strong>Ngày kết thúc:</strong> {formatDate(discount.endDate)}
                  </p>
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