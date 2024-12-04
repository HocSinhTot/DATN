import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const InvoicePage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState("1");
  const [totalAmount, setTotalAmount] = useState(0);

  // Lấy dữ liệu từ location state
  const location = useLocation();
  const { invoiceData } = location.state || {};

  useEffect(() => {
    if (invoiceData) {
      console.log("User ID: ", invoiceData.userId);
      console.log("Total Amount: ", invoiceData.totalAmount);
      setUserId(invoiceData.userId);
      setCartItems(invoiceData.cartItems);
      setTotalAmount(invoiceData.totalAmount);
    } else {
      setErrorMessage("Không có dữ liệu hóa đơn.");
    }
  }, [invoiceData]);

  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    if (!address) {
      alert("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    if (payMethod === "2") {
      // Gửi yêu cầu thanh toán qua VNPay
      try {
        const response = await fetch(
          `http://localhost:8080/api/payment/vnpay?amount=${totalAmount}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.code === "00" && data.data) {
            // Chuyển hướng người dùng đến URL thanh toán VNPay
            window.location.href = data.data;
          } else {
            alert("Không thể tạo URL thanh toán VNPay: " + data.message);
          }
        } else {
          alert("Lỗi kết nối đến server.");
        }
      } catch (error) {
        alert("Đã xảy ra lỗi: " + error.message);
      }
    } else {
      // Xử lý thanh toán COD
      const paymentData = { userId, address, payMethod, totalAmount };
      try {
        const response = await fetch(
          "http://localhost:8080/api/cart/order/redirectPayment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          }
        );

        if (response.ok) {
          alert("Thanh toán COD thành công!");
        } else {
          alert("Thanh toán COD thất bại.");
        }
      } catch (error) {
        alert("Đã xảy ra lỗi: " + error.message);
      }
    }
  };

  
  return (
    <div style={{ margin: "20px" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "20px" }}>
        <h3 style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px", borderRadius: "5px" }}>
          Chi tiết giỏ hàng
        </h3>
        <div>
          <h4>Giỏ hàng của bạn</h4>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="discountCode">Chọn mã giảm giá:</label>
            <select
              id="discountCode"
              style={{ display: "block", width: "100%", marginBottom: "10px", padding: "5px" }}
            
            >
              <option value="">Chọn mã</option>
           
            </select>
            <button
              style={{ backgroundColor: "#28a745", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer" }}
             
            >
              Áp dụng mã giảm giá
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Sản phẩm</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Ảnh</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Giá</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Số lượng</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <img src={`/assets/images/${item.image}`} alt={item.name} style={{ maxWidth: "100px" }} />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.price}</td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <p>Tổng cộng: {totalAmount} VND</p>
            {/* <p>Giảm giá: {discountAmount} VND</p> */}
            <p>
              {/* <strong>Tổng tiền sau giảm giá: {finalTotalAmount} VND</strong> */}
            </p>
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <form onSubmit={handleSubmitPayment}>
            <div style={{ marginBottom: "10px" }}>
              <label>Địa chỉ</label>
              <input
                type="text"
                style={{ display: "block", width: "100%", padding: "10px", marginBottom: "10px" }}
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Phương thức thanh toán</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="payMethod"
                    value="1"
                    checked={payMethod === "1"}
                    onChange={() => setPayMethod("1")}
                  />
                  Thanh toán khi nhận hàng
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="payMethod"
                    value="2"
                    checked={payMethod === "2"}
                    onChange={() => setPayMethod("2")}
                  />
                  Thanh toán qua VNPay
                </label>
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Thanh toán
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
