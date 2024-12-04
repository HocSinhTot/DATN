import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from './Notification';
const Account = () => {
  const [user, setUser] = useState(null); // State lưu trữ thông tin người dùng
  const [showPopup, setShowPopup] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Lấy thông tin người dùng từ API khi component được tải
  useEffect(() => {
    const username = sessionStorage.getItem("username"); // Lấy username từ localStorage
    if (username) {
      axios
        .get("http://localhost:8080/api/users/profile", {
          headers: { Username: username },
        })
        .then((response) => {
          if (response.data && response.data.id) {
            setUser(response.data); // Cập nhật state user nếu có dữ liệu
          } else {
            alert("Dữ liệu người dùng không hợp lệ.");
          }
        })
        .catch((error) => {
          console.error(
            "Lỗi khi tải thông tin người dùng:",
            error.response ? error.response.data : error.message
          );
        });
    } else {
      console.error("Không tìm thấy username trong localStorage.");
    }
  }, []);

  // Kiểm tra lỗi input trước khi gửi
  const validateInputs = () => {
    const errors = {};
    if (!user.name) errors.name = "Họ tên không được để trống";
    if (!user.email) {
      errors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!user.phone) errors.phone = "Số điện thoại không được để trống";
    if (!user.birthday) errors.birthday = "Ngày sinh không được để trống";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Hàm xử lý khi nhấn nút cập nhật
  const handleUpdate = () => {
    if (!validateInputs()) {
      return; // Dừng nếu dữ liệu nhập không hợp lệ
    }
    setShowPopup(true); // Hiển thị popup yêu cầu nhập mật khẩu
  };

  const handlePasswordConfirm = () => {
    const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify(user)], { type: 'application/json' }));
    formData.append("image", user.imageFile);  // Gửi hình ảnh nếu có

    axios
      .put("http://localhost:8080/api/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setNotificationMessage('Cập nhật thành công người dung');
        setNotificationType('success');
        setShowNotification(true);

        setTimeout(() => setShowNotification(false), 3000); // Ẩn sau 3 giây
        setShowPopup(false);
      })
      .catch((error) => {
        setNotificationMessage("Đã xảy ra lỗi khi cập nhật thông tin");
        setNotificationType("error");
        setShowNotification(true);

        setTimeout(() => setShowNotification(false), 3000); // Ẩn sau 3 giây
        alert("Đã xảy ra lỗi khi cập nhật thông tin");
      });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp từ input
    if (file) {
      // Cập nhật preview bằng URL tạm thời
      const previewURL = URL.createObjectURL(file);
      setUser({ ...user, previewImage: previewURL, imageFile: file });
    }
  };


  //
  ///thông báo
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const handlePurchase = () => {
    // Logic mua hàng
    setNotificationMessage('Cập nhật thành công');
    setNotificationType('success');
    setShowNotification(true);

    setTimeout(() => setShowNotification(false), 3000); // Ẩn sau 3 giây
  };


  // Nếu dữ liệu người dùng chưa được tải
  if (!user) {
    return <p>Đang tải dữ liệu người dùng...</p>;
  }

  return (
    <div
      className="container"
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <form
        id="userForm"
        encType="multipart/form-data"
        style={{
          backgroundColor: "#ffffff",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >    {/* Thông báo */}
        <Notification
          message={notificationMessage}
          type={notificationType}
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />

        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12" style={{ paddingTop: '70px' }}>
            <div className="card h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile">
                    <div className="user-avatar" style={{ paddingLeft: '42px' }}>
                      <img
                        src={user.previewImage || `http://localhost:8080/assets/images/${user.image}`}
                        alt="User Avatar"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #ddd",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </div>
                    <input style={{ marginTop: '15px' }}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      name="image"
                      onChange={(e) => handleImageChange(e)}
                    />
                    <input type="hidden" name="id" value={user.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div
            className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12"

          >
            {/* Nội dung bên trong */}
            <div className="card h-100" >
              <div className="card-body" >
                <div className="row gutters" style={{
                  border: "2px solid #007bff", // Đường viền màu xanh lam
                  borderRadius: "10px", // Bo góc
                  padding: "15px", // Khoảng cách bên trong
                  margin: "15px 0", // Khoảng cách bên ngoài
                }}>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h2 className="mb-2 text-primary" style={{ fontWeight: "bold" }}>
                      Thông tin người dùng
                    </h2>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group" style={{ border: '#ff0000 solid 2px;' }}>
                      <label htmlFor="fullName">Họ tên</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="name"
                        value={user.name || ""}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}

                        placeholder="Nhập tên"
                      />
                      {formErrors.name && <p style={{ color: 'red' }} className="error">{formErrors.name}</p>}
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="eMail">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="eMail"
                        name="email"
                        value={user.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Nhập email"
                      />
                      {formErrors.email && <p style={{ color: 'red' }} className="error">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={user.phone || ""}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        placeholder="Nhập số điện thoại"
                      />
                      {formErrors.phone && <p style={{ color: 'red' }} className="error">{formErrors.phone}</p>}

                    </div>
                  </div>



                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                      <label htmlFor="date">Ngày sinh</label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="birthday"
                        value={user.birthday || ""}
                        onChange={(e) => setUser({ ...user, birthday: e.target.value })}
                      />
                      {formErrors.birthday && <p style={{ color: 'red' }} className="error">{formErrors.birthday}</p>}

                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                      <label>Giới tính</label>
                      <br />
                      <br />
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="genderMale"
                          name="gender"
                          value="true"
                          checked={user.gender === true}
                          onChange={(e) => setUser({ ...user, gender: true })}
                        />
                        <label className="form-check-label" htmlFor="genderMale" style={{ paddingRight: '40px' }}>
                          Nam
                        </label>
                        <input
                          type="radio"
                          className="form-check-input"
                          id="genderFemale"
                          name="gender"
                          value="false"
                          checked={user.gender === false}
                          onChange={(e) => setUser({ ...user, gender: false })}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">
                          Nữ
                        </label>
                        {formErrors.gender && <p style={{ color: 'red' }} className="error">{formErrors.gender}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div
                      className="text-right"
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                      }}
                    >

                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="btn btn-success"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* Popup xác nhận mật khẩu */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeInBackdrop 0.3s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
              width: "380px",
              maxWidth: "90%",
              textAlign: "center",
              position: "relative",
              animation: "fadeInPopup 0.3s ease-out",
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              &times;
            </button>
            <h5
              style={{
                marginBottom: "20px",
                color: "#333",
                fontSize: "22px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Xác nhận mật khẩu
            </h5>
            <input
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
            />
            {errorMessage && (
              <p
                style={{
                  color: "#f44336",
                  fontSize: "14px",
                  marginTop: "-10px",
                  marginBottom: "20px",
                }}
              >
                {errorMessage}
              </p>
            )}
            <button
              onClick={handlePasswordConfirm}
              style={{
                padding: "12px 30px",
                margin: "10px 5px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                color: "#fff",
                backgroundColor: "#4CAF50",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              Xác nhận
            </button>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                padding: "12px 30px",
                margin: "10px 5px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                color: "#fff",
                backgroundColor: "#f44336",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e53935")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f44336")}
            >
              Hủy
            </button>
          </div>
        </div>
      )}




    </div>
  );
};

export default Account;
