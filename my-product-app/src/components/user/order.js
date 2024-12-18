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
  const [loadingCancel, setLoadingCancel] = useState(false);

  const userId = sessionStorage.getItem('userId');
  const [rating, setRating] = useState(0); // State cho số sao
  const [reviewText, setReviewText] = useState(""); // State cho text review
  const [image, setImage] = useState(null); // State cho hình ảnh

  // Xử lý click chọn sao
  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleImageChange = (e) => {
    if (e.target) {
      const file = e.target.files[0]; // Lấy ảnh đầu tiên từ files
      if (file) {
        const imageUrl = URL.createObjectURL(file); // Tạo URL cho ảnh
        setImage(imageUrl); // Cập nhật trạng thái với ảnh
      }
    } else {
      console.error('Sự kiện không có target!');
    }
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

    if (!orderIdToCancel) {
      alert('Không có đơn hàng để hủy!');
      return;
    }

    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
    if (!confirmCancel) return;

    setLoadingCancel(true);

    try {
      const response = await fetch(`http://localhost:8080/api/history/cancel/${orderIdToCancel}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelReason,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Hủy đơn hàng thất bại: ${errorDetails.message || 'Không rõ lý do'}`);
      }

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderIdToCancel));
      alert('Hủy đơn hàng thành công');
      closeModal();
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoadingCancel(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
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

  const handleSubmitReview = async () => {
    const userId = sessionStorage.getItem('userId');
    // Kiểm tra nếu userId là null hoặc không hợp lệ
    if (!userId || userId === 'null') {
        alert('Bạn cần đăng nhập để gửi đánh giá.');
        return;
    }

    // Kiểm tra xem reviewText có hợp lệ không
    if (!reviewText || reviewText.trim() === "") {
        alert('Vui lòng nhập nội dung đánh giá.');
        return;
    }

    const productId = null; // Cấp giá trị thích hợp cho productId nếu có
    const orderDetailId = null; // Cấp giá trị thích hợp cho orderDetailId nếu cần

    // Gửi đối tượng user thay vì chỉ user_id
    const user = { id: parseInt(userId, 10) }; // Tạo đối tượng user với userId hợp lệ

    const evaluationData = {
        star: rating,
        image: image, // Nếu cần lưu trữ nhiều hình ảnh, bạn cần chuyển đổi chúng thành chuỗi hoặc lưu trữ theo cách bạn quản lý
        comment: reviewText, // Đảm bảo reviewText không phải là null hay chuỗi rỗng
        status: true, // Tạm thời bạn có thể để true
        user: user, // Truyền đối tượng user
        product_id: productId, // Truyền giá trị hợp lệ cho productId (có thể null nếu cần)
        order_detail_id: orderDetailId // Truyền giá trị hợp lệ cho orderDetailId (có thể null nếu cần)
    };

    console.log('Evaluation Data:', evaluationData);

    try {
        const response = await fetch('http://localhost:8080/api/history/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(evaluationData), // Truyền trực tiếp data mà không cần thêm dấu {} quanh nó
        });

        if (!response.ok) {
            throw new Error('Failed to submit review');
        }

        alert('Đánh giá của bạn đã được gửi thành công!');
        handleClosePopup(); // Đóng popup sau khi gửi thành công
    } catch (error) {
        alert(`Lỗi: ${error.message}`);
    }
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
                  <strong>Phương thức thanh toán:</strong> {order.paymentMethod.methods}
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
                  width: "100%", 
                  padding: "12px", 
                  marginTop: "10px", 
                  border: "none", 
                  borderRadius: "10px", 
                  backgroundColor: "#007bff", 
                  color: "#fff", 
                  cursor: "pointer", 
                  fontWeight: "bold", 
                  fontSize: "16px", 
                  boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)", 
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0056b3"; 
                  e.target.style.boxShadow = "0 8px 15px rgba(0, 86, 179, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#007bff"; 
                  e.target.style.boxShadow = "0 5px 10px rgba(0, 123, 255, 0.3)";
                }}
              >
                Xem chi tiết
              </button>
              <button onClick={() => openCancelModal(order.id)} style={{ width: "100%", padding: "12px", marginTop: "10px", border: "none", borderRadius: "10px", backgroundColor: "#ff6b6b", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>Hủy đơn hàng</button>
              <button onClick={handleOpenPopup} style={{ width: "100%", padding: "12px", marginTop: "10px", border: "none", borderRadius: "10px", backgroundColor: "#28a745", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>Đánh giá</button>
            </div>
          ))}
        </div>

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
                    e.currentTarget.style.backgroundColor = '#e6f0fa'; 
                    e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)'; 
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f4f8fb'; 
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)'; 
                  }}
                >
                  <strong style={{ color: '#4a90e2' }}>Sản phẩm:</strong> {detail.product.product.name} <br />
                  <strong style={{ color: '#4a90e2' }}>Màu sắc:</strong> {detail.product.color.name} <br />
                  <strong style={{ color: '#4a90e2' }}>Dung lượng:</strong> {detail.product.productPrice.capacity.name}
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
                  padding: "12px 24px", 
                  backgroundColor: "#6c757d", 
                  border: "none", 
                  borderRadius: "10px", 
                  color: "#fff", 
                  fontWeight: "bold", 
                  cursor: "pointer", 
                  fontSize: "16px", 
                  boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", 
                  transition: "all 0.3s ease", 
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#5a6268"; 
                  e.target.style.boxShadow = "0 8px 15px rgba(90, 98, 104, 0.4)"; 
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6c757d"; 
                  e.target.style.boxShadow = "0 5px 10px rgba(108, 117, 125, 0.3)"; 
                }}
              >
                Đóng
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
                  padding: "12px 24px", 
                  backgroundColor: "#e74c3c", 
                  border: "none", 
                  borderRadius: "10px", 
                  color: "#fff", 
                  fontWeight: "bold", 
                  cursor: "pointer", 
                  fontSize: "16px", 
                  boxShadow: "0 5px 10px rgba(231, 76, 60, 0.3)", 
                  transition: "all 0.3s ease", 
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#c0392b"; 
                  e.target.style.boxShadow = "0 8px 15px rgba(192, 57, 43, 0.4)"; 
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#e74c3c"; 
                  e.target.style.boxShadow = "0 5px 10px rgba(231, 76, 60, 0.3)"; 
                }}
              >
                Xác nhận hủy
              </button>
              <button
                onClick={closeModalhuy}
                style={{
                  marginLeft: "10px", 
                  padding: "12px 24px", 
                  backgroundColor: "#6c757d", 
                  border: "none", 
                  borderRadius: "10px", 
                  color: "#fff", 
                  fontWeight: "bold", 
                  cursor: "pointer", 
                  fontSize: "16px", 
                  boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", 
                  transition: "all 0.3s ease", 
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#5a6268"; 
                  e.target.style.boxShadow = "0 8px 15px rgba(90, 98, 104, 0.4)"; 
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6c757d"; 
                  e.target.style.boxShadow = "0 5px 10px rgba(108, 117, 125, 0.3)"; 
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
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
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
<div style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}>
<label
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
    onChange={handleImageChange} // Gọi trực tiếp handleImageChange
  />
  {image ? (
    <img
      src={image}
      alt="Upload"
      style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "4px" }}
    />
  ) : (
    <span>Thêm ảnh</span>
  )}
</label>

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
                    onClick={handleSubmitReview} // Gọi hàm gửi đánh giá
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