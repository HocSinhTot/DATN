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
  const [rating, setRating] = useState(0); // State cho số sao
  const [reviewText, setReviewText] = useState(""); // State cho text review
  const [images, setImages] = useState([null, null, null]); // State cho hình ảnh

  // Xử lý click chọn sao
  const handleRating = (index) => {
    setRating(index + 1);
  };

  // Xử lý upload ảnh
  const handleImageChange = (index, e) => {
    const newImages = [...images];
    newImages[index] = URL.createObjectURL(e.target.files[0]);
    setImages(newImages);
  };



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
  const closeModalhuy = () => {

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
        <button onClick={handleOpenPopup}>Sửa sản phẩm</button>
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
                  width: "100%", // Chiều rộng nút phủ toàn bộ
                  padding: "12px", // Khoảng cách bên trong lớn hơn để nhìn cân đối
                  marginTop: "10px", // Khoảng cách phía trên
                  border: "none", // Xóa viền
                  borderRadius: "10px", // Bo góc mềm mại
                  backgroundColor: "#007bff", // Màu xanh lam ban đầu
                  color: "#fff", // Chữ trắng
                  cursor: "pointer", // Hiển thị con trỏ khi hover
                  fontWeight: "bold", // Chữ đậm
                  fontSize: "16px", // Cỡ chữ
                  boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)", // Hiệu ứng đổ bóng
                  transition: "all 0.3s ease", // Hiệu ứng chuyển đổi mượt mà
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0056b3"; // Màu nền khi hover (xanh đậm hơn)
                  e.target.style.boxShadow = "0 8px 15px rgba(0, 86, 179, 0.4)"; // Tăng đổ bóng khi hover
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#007bff"; // Trả về màu nền ban đầu
                  e.target.style.boxShadow = "0 5px 10px rgba(0, 123, 255, 0.3)"; // Trả về bóng ban đầu
                }}
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
                  <strong style={{ color: '#4a90e2' }}>Sản phẩm:</strong> {detail.product.product.name} <br/>
                  <strong style={{ color: '#4a90e2' }}>Màu sắc:</strong> {detail.product.color.name} <br/>
                  <strong style={{ color: '#4a90e2' }}>Dung lượng:</strong> {detail.product.capacity.name}
                  <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <img
                      src={`/assets/images/${detail.product.product.images[0].url}`}
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
                  padding: "12px 24px", // Khoảng cách bên trong lớn hơn
                  backgroundColor: "#6c757d", // Màu xám ban đầu (chuẩn Bootstrap)
                  border: "none", // Xóa viền
                  borderRadius: "10px", // Bo góc mềm mại
                  color: "#fff", // Chữ trắng
                  fontWeight: "bold", // Chữ đậm
                  cursor: "pointer", // Hiển thị con trỏ khi hover
                  fontSize: "16px", // Cỡ chữ
                  boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", // Hiệu ứng đổ bóng
                  transition: "all 0.3s ease", // Hiệu ứng chuyển đổi mượt mà
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#5a6268"; // Màu xám đậm hơn khi hover
                  e.target.style.boxShadow = "0 8px 15px rgba(90, 98, 104, 0.4)"; // Tăng đổ bóng khi hover
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6c757d"; // Trả về màu nền ban đầu
                  e.target.style.boxShadow = "0 5px 10px rgba(108, 117, 125, 0.3)"; // Trả về bóng ban đầu
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
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleCancelOrder}
                style={{
                  padding: "12px 24px", // Khoảng cách bên trong lớn hơn
                  backgroundColor: "#e74c3c", // Màu đỏ ban đầu
                  border: "none", // Xóa viền
                  borderRadius: "10px", // Bo góc mềm mại
                  color: "#fff", // Chữ trắng
                  fontWeight: "bold", // Chữ đậm
                  cursor: "pointer", // Hiển thị con trỏ khi hover
                  fontSize: "16px", // Cỡ chữ
                  boxShadow: "0 5px 10px rgba(231, 76, 60, 0.3)", // Hiệu ứng đổ bóng
                  transition: "all 0.3s ease", // Hiệu ứng mượt mà
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#c0392b"; // Màu đỏ đậm hơn khi hover
                  e.target.style.boxShadow = "0 8px 15px rgba(192, 57, 43, 0.4)"; // Tăng đổ bóng khi hover
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#e74c3c"; // Trả lại màu nền ban đầu
                  e.target.style.boxShadow = "0 5px 10px rgba(231, 76, 60, 0.3)"; // Trả về bóng ban đầu
                }}
              >
                Xác nhận hủy
              </button>
              <button
                onClick={closeModalhuy}
                style={{
                  marginLeft: "10px", // Khoảng cách giữa hai nút
                  padding: "12px 24px", // Khoảng cách bên trong lớn hơn
                  backgroundColor: "#6c757d", // Màu xám ban đầu (chuẩn Bootstrap)
                  border: "none", // Xóa viền
                  borderRadius: "10px", // Bo góc mềm mại
                  color: "#fff", // Chữ trắng
                  fontWeight: "bold", // Chữ đậm
                  cursor: "pointer", // Hiển thị con trỏ khi hover
                  fontSize: "16px", // Cỡ chữ
                  boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", // Hiệu ứng đổ bóng
                  transition: "all 0.3s ease", // Hiệu ứng mượt mà
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#5a6268"; // Màu xám đậm hơn khi hover
                  e.target.style.boxShadow = "0 8px 15px rgba(90, 98, 104, 0.4)"; // Tăng đổ bóng khi hover
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6c757d"; // Trả lại màu nền ban đầu
                  e.target.style.boxShadow = "0 5px 10px rgba(108, 117, 125, 0.3)"; // Trả về bóng ban đầu
                }}
              >
                Hủy
              </button>
            </div>


          </div>
        )}
      </div>



      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  width: "500px",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  textAlign: "center",
                }}
              >
                <h2>ĐÁNH GIÁ SẢN PHẨM</h2>

                {/* Thông tin sản phẩm */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", justifyContent: "center" }}>
                  <img
                    src="https://via.placeholder.com/60"
                    alt="Converse 03"
                    style={{ width: "60px", height: "60px", marginRight: "10px" }}
                  />
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>Converse 03</span>
                </div>

                {/* Star Rating */}
                <div style={{ margin: "10px 0" }}>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      onClick={() => handleRating(index)}
                      style={{
                        fontSize: "30px",
                        cursor: "pointer",
                        color: index < rating ? "orange" : "lightgray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  placeholder="Hãy chia sẻ những trải nghiệm của bạn về sản phẩm này"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  style={{
                    width: "100%",
                    height: "80px",
                    marginTop: "10px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    resize: "none",
                  }}
                />

                {/* Upload hình ảnh */}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0" }}>
                  {images.map((image, index) => (
                    <label
                      key={index}
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "1px dashed #ccc",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageChange(index, e)}
                      />
                      {image ? (
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "4px" }}
                        />
                      ) : (
                        <span>Thêm ảnh {index + 1}</span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Button */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button
                    style={{
                      padding: "10px 20px",
                      background: "#ccc",
                      color: "#333",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Trở lại
                  </button>
                  <button
                    style={{
                      padding: "10px 20px",
                      background: "#e53935",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Hoàn thành
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;