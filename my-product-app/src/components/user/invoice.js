import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InvoicePage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState("1");
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");  // Mã giảm giá từ người dùng
  const [discountAmount, setDiscountAmount] = useState(0);  // Giá trị giảm giá

  const location = useLocation();
  const { invoiceData } = location.state || {};

  // Khởi tạo navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (invoiceData) {
      setUserId(invoiceData.userId);
      setCartItems(invoiceData.cartItems);
      setTotalAmount(invoiceData.totalAmount);
    } else {
      setErrorMessage("Không có dữ liệu hóa đơn.");
    }
  }, [invoiceData]);

  // Kiểm tra tính hợp lệ của mã giảm giá (gọi từ backend)
  const validateDiscountCode = async () => {
    if (!discountCode) {
      alert("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/vouchers/${discountCode}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Kiểm tra nếu mã giảm giá hợp lệ
        if (data.valid) {
          setDiscountAmount(data.discountPercentage * totalAmount);  // Cập nhật giá trị giảm giá theo phần trăm
          alert("Mã giảm giá hợp lệ và đã được áp dụng.");
        } else {
          alert("Mã giảm giá đã hết hạn hoặc không hợp lệ.");
        }
      } else {
        alert("Không thể kiểm tra mã giảm giá.");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi: " + error.message);
    }
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    if (!address) {
      alert("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    // Tính tổng tiền sau khi áp dụng mã giảm giá
    const totalAfterDiscount = totalAmount - discountAmount;

    if (payMethod === "2") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/payment/vnpay?amount=${totalAfterDiscount}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.code === "00" && data.data) {
            window.location.href = data.data;
          } else {
            alert("Không thể tạo URL thanh toán VNPay.");
          }
        } else {
          alert("Lỗi kết nối đến server.");
        }
      } catch (error) {
        alert("Đã xảy ra lỗi: " + error.message);
      }
    } else {
      const paymentData = { userId, address, payMethod, totalAmount: totalAfterDiscount };
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

          // Chuyển hướng về trang index (trang chủ)
          navigate("/");  // Điều hướng về trang chủ

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
            <label htmlFor="discountCode">Nhập mã giảm giá:</label>
            <input
              type="text"
              id="discountCode"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              style={{ display: "block", width: "100%", padding: "5px", marginBottom: "10px" }}
            />
            <button
              onClick={validateDiscountCode}
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
            {discountAmount > 0 && <p>Giảm giá: {discountAmount} VND</p>}
            <p><strong>Tổng tiền sau giảm giá: {totalAmount - discountAmount} VND</strong></p>
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
                  Thanh toán VNPay
                </label>
              </div>
            </div>

            <button type="submit" style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer" }}>
              Xác nhận thanh toán
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
