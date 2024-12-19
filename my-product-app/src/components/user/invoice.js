import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const InvoicePage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState("1");
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [hoverDiscount, setHoverDiscount] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [totalAmountAfterShipping, setTotalAmountAfterShipping] = useState(totalAmount);
  const location = useLocation();
  const { invoiceData } = location.state || {};
  const navigate = useNavigate();
  useEffect(() => {
    if (invoiceData) {
      setUserId(invoiceData.userId);
      setCartItems(invoiceData.items);
      setTotalAmount(invoiceData.totalAmount);
    } else {
      setErrorMessage("Không có dữ liệu hóa đơn.");
    }
  }, [invoiceData]);
  const handleAddressChange = (event) => {
    const userAddress = event.target.value;
    setAddress(userAddress);

    // Định nghĩa phí vận chuyển cho từng tỉnh
    const shippingFeesByProvince = {
      "HCM": 5000,
      "TPHCM": 5000,
      "Cần Thơ": 10000,
      "Hà Nội": 50000,
      "Đà Nẵng": 15000,
      "Hải Phòng": 30000,
      "Nghệ An": 25000,
      "Thanh Hóa": 20000,
      "Huế": 20000,
      "Quảng Ninh": 35000,
      "Bình Dương": 15000,
      "Đồng Nai": 15000,
      "Bắc Ninh": 20000,
      "Nam Định": 25000,
      "Vĩnh Long": 20000,
      "An Giang": 25000,
      "Kiên Giang": 30000,
      "Lâm Đồng": 25000,
    };

    // Tìm phí vận chuyển tương ứng với tỉnh
    let shippingFee = 20000; // Mặc định cho các khu vực khác
    for (const [province, fee] of Object.entries(shippingFeesByProvince)) {
      if (userAddress.includes(province)) {
        shippingFee = fee;
        break;
      }
    }

    // Cập nhật phí vận chuyển
    setShippingFee(shippingFee);
  };

  const validateDiscountCode = async () => {
    if (!discountCode) {
      alert("Vui lòng nhập mã giảm giá.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/vouchers/${discountCode}`,
        { method: "GET" }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          const discountValue = (data.discountPercentage / 100) * totalAmount;
          setDiscountAmount(discountValue); // Tính giảm giá dựa trên phần trăm
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
    const totalAfterDiscount = totalAmount - discountAmount;
    const totalAmountWithShipping = totalAfterDiscount + shippingFee;
    if (payMethod === "2") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/payment/vnpay?amount=${totalAmountWithShipping}&userId=${userId}&address=${address}`,
          { method: "GET" }
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
      const paymentData = { userId, address, payMethod, totalAmount: totalAmountWithShipping };
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
          navigate("/");
        } else {
          alert("Thanh toán COD thất bại.");
        }
      } catch (error) {
        alert("Đã xảy ra lỗi: " + error.message);
      }
    }
  };
  useEffect(() => {
    // Kiểm tra nếu có giảm giá, ta tính lại tổng tiền sau khi trừ giảm giá và cộng phí vận chuyển
    const totalAfterDiscount = totalAmount - discountAmount; // Tổng sau khi trừ giảm giá
    const totalAmountWithShipping = totalAfterDiscount + shippingFee; // Tổng sau khi cộng phí vận chuyển
    setTotalAmountAfterShipping(totalAmountWithShipping); // Cập nhật tổng tiền sau khi tính phí vận chuyển và giảm giá
  }, [totalAmount, discountAmount, shippingFee]); // Đảm bảo useEffect sẽ được gọi khi các giá trị này thay đổi
  return (
    <div style={styles.container}>
      <div style={styles.cartContainer}>
        <h3 style={styles.header}>Giỏ hàng của bạn</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>Sản phẩm</th>
              <th>Ảnh</th>
              <th>Màu sắc</th>
              <th>Dung lượng</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.id} style={styles.tableRow}>
                  <td>{item.name}</td>
                  <td>
                    <img
                      src={`/assets/images/${item.image}`}
                      alt={item.name}
                      style={styles.itemImage}
                    />
                  </td>
                  <td>{item.color}</td>
                  <td>{item.capacity}</td>
                  <td>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={styles.noItemText}>
                  Không có sản phẩm nào trong giỏ hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={styles.summaryContainer}>
          <p style={styles.totalAmount}>
            Tổng cộng:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalAmount)}
          </p>
          {discountAmount > 0 && (
            <p style={styles.discountAmount}>
              Giảm giá:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(discountAmount)}
            </p>
          )}
          <p style={styles.shippingFee}>
            {shippingFee > 0
              ? `Phí vận chuyển: ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(shippingFee)}`
              : null}
          </p>
          <p style={styles.finalAmount}>
            <strong>
              Tổng tiền:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmountAfterShipping)}
            </strong>
          </p>
        </div>

      </div>
      <div style={styles.formContainer}>
        <h3 style={styles.header}>Thanh toán</h3>
        <div style={styles.form}>
          <h4>Thông tin thanh toán</h4>
          <div style={styles.discountContainer}>
            <label htmlFor="discountCode">Nhập mã giảm giá:</label>
            <input
              type="text"
              id="discountCode"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              style={styles.input}
            />
            <button
              onClick={validateDiscountCode}
              style={hoverDiscount ? { ...styles.discountButton, ...styles.discountButtonHover } : styles.discountButton}
              onMouseEnter={() => setHoverDiscount(true)}
              onMouseLeave={() => setHoverDiscount(false)}
            >
              Áp dụng mã giảm giá
            </button>
          </div>
          <form onSubmit={handleSubmitPayment}>
            <div style={styles.inputContainer}>
              <label>Địa chỉ</label>
              <textarea
                rows="3"
                value={address}
                onChange={handleAddressChange}
                style={styles.input}
              />
            </div>
            <div style={styles.radioContainer}>
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
            <div>
              <button
                type="submit"
                style={hoverSubmit ? { ...styles.submitButton, ...styles.submitButtonHover } : styles.submitButton}
                onMouseEnter={() => setHoverSubmit(true)}
                onMouseLeave={() => setHoverSubmit(false)}
              >
                Thanh toán
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
const styles = {
  // Container chính
  container: {
    display: "flex",
    justifyContent: "space-between",
    margin: "30px auto",
    maxWidth: "1600px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
  },

  // Phần tổng hợp thông tin thanh toán
  summaryContainer: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "20px 0",
    textAlign: "left",
  },

  // Các trường thông tin (tổng cộng, giảm giá, phí vận chuyển, tổng tiền)
  totalAmount: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  discountAmount: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#e53935",
    marginBottom: "10px",
  },
  shippingFee: {
    fontSize: "16px",
    fontWeight: "bold",
    color: 'blue',
    marginBottom: "10px",
  },
  finalAmount: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #ddd",
  },

  // Form container
  formContainer: {
    width: "32%",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  },

  // Giỏ hàng container
  cartContainer: {
    width: "65%",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  },

  // Header của giỏ hàng hoặc thông tin
  header: {
    backgroundColor: "#2d7bf4",
    color: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },

  // Bảng trong giỏ hàng
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#2d7bf4",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    padding: "15px",
  },
  tableRow: {
    textAlign: "center",
    padding: "10px",
  },

  // Hình ảnh sản phẩm
  itemImage: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "5px",
  },

  // Hiển thị khi không có sản phẩm
  noItemText: {
    textAlign: "center",
    color: "#999",
    padding: "20px",
    fontStyle: "italic",
  },

  // Input và container input
  inputContainer: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  // Button gửi và hover
  submitButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#218838",
  },

  // Button giảm giá và hover
  discountButton: {
    padding: "12px",
    backgroundColor: "#ff9800",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  discountButtonHover: {
    backgroundColor: "#f57c00",
  },

  // Container giảm giá
  discountContainer: {
    marginBottom: "20px",
  },

  // Radio button container
  radioContainer: {
    marginBottom: "25px",
  },
};

export default InvoicePage;