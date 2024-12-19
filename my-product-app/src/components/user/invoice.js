import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

    const totalAfterDiscount = totalAmountAfterShipping - discountAmount ;

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
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Màu sắc</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Dung lượng</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Giá</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Số lượng</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
            {cartItems && cartItems.length > 0 ? (
  cartItems.map((item) => (
    <tr key={item.id}>
      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.name}</td>
      <td style={{ border: "1px solid #ddd", padding: "10px" }}>
        <img src={`/assets/images/${item.image}`} alt={item.name} style={{ maxWidth: "100px" }} />
      </td>
      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.color}</td>
      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.capacity}</td>
      <td style={{ border: "1px solid #ddd", padding: "10px" }}>  {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(item.price)}</td>
      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.quantity}</td>
      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(item.price * item.quantity)}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
      Không có sản phẩm nào trong giỏ hàng.
    </td>
  </tr>
)}

            </tbody>
          </table>

        <div>
            <p>Tổng cộng: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(totalAmount)} </p>
            {discountAmount > 0 && <p>Giảm giá:{new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(discountAmount)} </p>}
                          <p>Phí vận chuyển: {shippingFee}</p>

            <p><strong>Tổng tiền: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(totalAmountAfterShipping - discountAmount)}</strong></p>
          </div>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <div style={styles.formContainer}>
        <h3 style={styles.header}>Thông tin giao hàng</h3>
        <div style={styles.inputContainer}>
          <label>Tỉnh/Thành phố:</label>
          <select value={selectedProvince} onChange={handleProvinceChange} style={styles.input}>
            <option value="">Chọn tỉnh/thành phố</option>
            {provinceList.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.inputContainer}>
          <label>Quận/Huyện:</label>
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
          <label>Phường/Xã:</label>
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
          <label>Địa chỉ cụ thể:</label>
          <input
            type="text"
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
            style={styles.input}
            placeholder="Nhập địa chỉ cụ thể"
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Dịch vụ vận chuyển:</label>
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
        <button onClick={handleCalculateShippingFee} style={styles.button}>
         Lưu địa chỉ 
        </button>
 
      </div>
      </div>
      <form onSubmit={handleSubmitPayment}>

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
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  cartContainer: {
    width: "65%",
  },
  formContainer: {
    width: "30%",
  },
  header: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  inputContainer: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "8px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
export default InvoicePage;
