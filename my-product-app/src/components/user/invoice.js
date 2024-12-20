import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Notification from './Notification';

const InvoicePage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState("1");

  const [errorMessage, setErrorMessage] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountAfterShipping, setTotalAmountAfterShipping] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

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

  useEffect(() => {
    fetch("http://localhost:8080/api/provinces")
      .then((res) => res.json())
      .then((data) => setProvinceList(data.data || []))
      .catch((error) => console.error("Lỗi khi lấy danh sách tỉnh: ", error));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistrictList([]);
    setWardList([]);

    fetch(`http://localhost:8080/api/districts?provinceId=${provinceId}`)
      .then((res) => res.json())
      .then((data) => setDistrictList(data.data || []))
      .catch((error) => console.error("Lỗi khi lấy danh sách quận: ", error));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard("");
    setWardList([]);

    fetch(`http://localhost:8080/api/wards?districtId=${districtId}`)
      .then((res) => res.json())
      .then((data) => setWardList(data.data || []))
      .catch((error) => console.error("Lỗi khi lấy danh sách phường: ", error));

    fetch(`http://localhost:8080/shipping/available-services?to_district=${districtId}`)
      .then((res) => res.json())
      .then((data) => setAvailableServices(data.data || []))
      .catch((error) => console.error("Lỗi khi lấy dịch vụ: ", error));
  };

  const handleWardChange = (e) => setSelectedWard(e.target.value);

  const handleCalculateShippingFee = () => {
    if (!selectedDistrict || !selectedWard || !selectedServiceId) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    fetch(
      `http://localhost:8080/shipping/calculate-fee?to_district=${parseInt(
        selectedDistrict
      )}&to_ward=${selectedWard}&service_id=${selectedServiceId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          const newShippingFee = data.data.total || 0;
          setShippingFee(newShippingFee);
          setTotalAmountAfterShipping(totalAmount + newShippingFee);
          handleAddressSubmit();
        } else {
          alert("Lỗi khi tính phí vận chuyển: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tính phí vận chuyển: ", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      });
  };

  const handleAddressSubmit = () => {
    // Tìm tên tỉnh thành từ provinceList dựa trên selectedProvince
    const selectedProvinceName = provinceList.find(
      (province) => province.ProvinceID === parseInt(selectedProvince)
    )?.ProvinceName || '';

    // Tìm tên quận từ districtList dựa trên selectedDistrict
    const selectedDistrictName = districtList.find(
      (district) => district.DistrictID === parseInt(selectedDistrict)
    )?.DistrictName || '';

    // Tìm tên phường từ wardList dựa trên selectedWard
    const selectedWardName = wardList.find(
      (ward) => ward.WardCode === selectedWard
    )?.WardName || '';

    // Tạo chuỗi địa chỉ từ các phần tử đã chọn
    setAddress(`${selectedProvinceName}, ${selectedDistrictName}, ${selectedWardName}, ${specificAddress}`);

    // Lưu địa chỉ dưới dạng chuỗi
    console.log("Địa chỉ người dùng: ", address);

    // Bạn có thể gửi chuỗi địa chỉ này tới server hoặc lưu vào state
  };

  ///thông báo
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const validateDiscountCode = async () => {
    if (!discountCode) {
      alert("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/vouchers/${discountCode}`);

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setDiscountAmount((data.discountPercentage || 0) * totalAmount);
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

    const totalAfterDiscount = totalAmountAfterShipping - discountAmount;

    if (payMethod === "2") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/payment/vnpay?amount=${totalAfterDiscount}&userId=${userId}&address=${address}`
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
        const response = await fetch("http://localhost:8080/api/cart/order/redirectPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        });

        // Logic mua hàng
        if (response.ok) {
          // Hiển thị thông báo từ bên phải
          setNotificationMessage('Thanh toán  thành công!');
          setNotificationType('success');
          setShowNotification(true);

          setTimeout(() => {
            setShowNotification(false); // Ẩn thông báo sau 3 giây
            navigate("/"); // Chuyển trang sau khi thông báo ẩn
          }, 3000); // Đợi 3 giây trước khi thực hiện các hành động tiếp theo
        }
        else {
          // Hiển thị thông báo từ bên phải
          setNotificationMessage('Thanh toán COD thất bại.');
          setNotificationType('error');
          setShowNotification(true);

          setTimeout(() => setShowNotification(false), 3000); // Ẩn sau 3 giây

          // Sau khi thông báo biến mất, sử dụng Swal
          setTimeout(() => {
            Swal.fire({
              title: 'Thanh toán COD thất bại.',
              icon: 'error',
              confirmButtonText: 'Thử lại'
            });
          }, 3000); // Đợi 3 giây trước khi hiển thị Swal
        }

      } catch (error) {
        alert("Đã xảy ra lỗi: " + error.message);
      }
    }
  };


  return (
    <div style={styles.container}>
      {/* Chi tiết giỏ hàng */}
      <div style={styles.cartContainer}>
        <h3 style={styles.header}>Chi tiết giỏ hàng</h3>
        <div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Sản phẩm</th>
                <th style={styles.tableHeader}>Ảnh</th>
                <th style={styles.tableHeader}>Màu sắc</th>
                <th style={styles.tableHeader}>Dung lượng</th>
                <th style={styles.tableHeader}>Giá</th>
                <th style={styles.tableHeader}>Số lượng</th>
                <th style={styles.tableHeader}>Thành tiền</th>
              </tr>
            </thead>

            {/* Thông báo */}
            <Notification
              message={notificationMessage}
              type={notificationType}
              show={showNotification}
              onClose={() => setShowNotification(false)}
            />


            <tbody>
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ ...styles.tableRow, fontSize: '16px' }}>{item.name}</td>
                    <td style={{ ...styles.tableRow, fontSize: '16px' }}>
                      <img
                        src={`/assets/images/${item.image}`}
                        alt={item.name}
                        style={styles.itemImage}
                      />
                    </td>
                    <td style={{ ...styles.tableRow, fontSize: '16px' }}>{item.color}</td>
                    <td style={{ ...styles.tableRow, fontSize: '16px' }}>{item.capacity}</td>
                    <td style={{ ...styles.tableRow, fontSize: '16px' }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </td>
                    <td style={{ ...styles.tableRow, fontSize: '16px' }}>{item.quantity}</td>
                    <td style={{ ...styles.tableRow, fontSize: '16px' }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * item.quantity)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ ...styles.noItemText, fontSize: '16px' }}>
                    Không có sản phẩm nào trong giỏ hàng.
                  </td>
                </tr>
              )}
            </tbody>

          </table>

          <div style={{ ...styles.summaryContainer, textAlign: 'right' }}>
            <p style={styles.totalAmount}>
              <span style={{ paddingRight: '65px' }}>Tổng cộng:</span>

              <span
                style={{
                  padding: '40px',
                  fontWeight: 'bold',
                }}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalAmount)}
              </span>

            </p>

            <hr style={{
              borderTop: '1px solid #ddd',
              margin: '20px 0',
              width: '35%',  // Điều chỉnh chiều rộng để nó nhỏ lại
              marginLeft: 'auto',  // Đẩy sang bên phải
              marginRight: '0'  // Đảm bảo không có khoảng cách bên phải
            }} />

            {discountAmount > 0 && (
              <p style={styles.discountAmount}>
                <span style={{ paddingRight: '75px' }}>Giảm giá:</span>

                <span
                  style={{
                    padding: '40px',
                    fontWeight: 'bold',
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(discountAmount)}
                </span>
                <hr style={{
                  borderTop: '1px solid #ddd',
                  margin: '20px 0',
                  width: '35%',  // Điều chỉnh chiều rộng để nó nhỏ lại
                  marginLeft: 'auto',  // Đẩy sang bên phải
                  marginRight: '0'  // Đảm bảo không có khoảng cách bên phải
                }} />

              </p>
            )}

            <p style={styles.shippingFee}>

              <span style={{ paddingRight: '103px' }}>Phí vận chuyển:</span>

              <span
                style={{
                  padding: '40px',
                  fontWeight: 'bold',
                }}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(shippingFee)}
              </span>
            </p>
            <hr style={{
              borderTop: '1px solid #ddd',
              margin: '20px 0',
              width: '35%',  // Điều chỉnh chiều rộng để nó nhỏ lại
              marginLeft: 'auto',  // Đẩy sang bên phải
              marginRight: '0'  // Đảm bảo không có khoảng cách bên phải
            }} />
            <p style={styles.finalAmount}>
              <strong>
                <span style={{ paddingRight: '30px' }}>Tổng tiền:</span>
                <span
                  style={{
                    padding: '40px',
                    fontWeight: 'bold',
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount - discountAmount + shippingFee)}
                </span>
              </strong>
            </p>

          </div>


          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </div>

      {/* Thông tin giao hàng */}
      <div style={styles.formContainer}>
        <h3 style={styles.header}>Thông tin giao hàng</h3>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: '14px' }} htmlFor="discountCode">Nhập mã giảm giá:</label>
          <input
            type="text"
            id="discountCode"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={styles.input}
          />
          <button onClick={validateDiscountCode} style={styles.discountButton}>
            Áp dụng mã giảm giá
          </button>
        </div>

        <div style={styles.inputContainer}>
          <label style={{ fontSize: '14px' }} >Tỉnh/Thành phố:</label>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            style={styles.input}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinceList.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label style={{ fontSize: '14px' }}>Quận/Huyện:</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            style={styles.input}
            disabled={!selectedProvince}
          >
            <option value="">Chọn quận/huyện</option>
            {districtList.map((district) => (
              <option key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label style={{ fontSize: '14px' }} >Phường/Xã:</label>
          <select
            value={selectedWard}
            onChange={handleWardChange}
            style={styles.input}
            disabled={!selectedDistrict}
          >
            <option value="">Chọn phường/xã</option>
            {wardList.map((ward) => (
              <option key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label style={{ fontSize: '14px' }} >Địa chỉ cụ thể:</label>
          <input
            type="text"
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
            style={styles.input}
            placeholder="Nhập địa chỉ cụ thể"
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={{ fontSize: '14px' }}>Dịch vụ vận chuyển:</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            style={styles.input}
            disabled={availableServices.length === 0}
          >
            <option value="">Chọn dịch vụ</option>
            {availableServices.map((service) => (
              <option key={service.service_id} value={service.service_id}>
                {service.short_name}
              </option>
            ))}
          </select>
        </div>



        <hr style={{ border: '1px solid #ddd', margin: '20px 0' }} />




        <button
          onClick={handleCalculateShippingFee}

          style={{
            padding: '15px 30px',
            color: '#000', // Màu chữ bên trong là màu đen
            backgroundColor: '#fff', // Màu nền bên trong là màu trắng
            border: '2px solid #000', // Viền ngoài màu đen
            cursor: 'pointer',
            fontSize: '1.2rem',
            borderRadius: '5px',
            display: 'flex',  // Đảm bảo các phần tử con nằm trên cùng một hàng
            alignItems: 'center',  // Căn chỉnh các phần tử theo chiều dọc
            justifyContent: 'center',  // Căn chỉnh nội dung
          }}
        >
          Lưu địa chỉ
          <div style={{ marginLeft: '10px' }}>  {/* Thêm khoảng cách giữa chữ và icon */}

          </div>
        </button>
        <hr style={{ border: '1px solid #ddd', margin: '20px 0' }} />

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: '16px' }} >Phương thức thanh toán</label>
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
        <hr style={{ border: '1px solid #ddd', margin: '20px 0' }} />

        <form onSubmit={handleSubmitPayment}>



          <button
            type="submit"

            style={{
              padding: '15px 30px',
              color: '#000', // Màu chữ bên trong là màu đen
              backgroundColor: '#fff', // Màu nền bên trong là màu trắng
              border: '2px solid #000', // Viền ngoài màu đen
              cursor: 'pointer',
              fontSize: '1.2rem',
              borderRadius: '5px',
              display: 'flex',  // Đảm bảo các phần tử con nằm trên cùng một hàng
              alignItems: 'center',  // Căn chỉnh các phần tử theo chiều dọc
              justifyContent: 'center',  // Căn chỉnh nội dung
            }}
          >
            Tiến hành thanh toán
            <div style={{ marginLeft: '10px' }}>  {/* Thêm khoảng cách giữa chữ và icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
              </svg>
            </div>
          </button>
        </form>
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
