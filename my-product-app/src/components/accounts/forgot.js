import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Gửi OTP, 2: Xác nhận OTP, 3: Đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stars, setStars] = useState([]);
  const navigate = useNavigate();

  // Generate stars for background animation
  useEffect(() => {
    const newStars = Array.from({ length: 7 }).map((_, index) => ({
      id: index,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/forgot/send-otp", {
        email: email,  // Sử dụng email đã lưu trữ
      });
  
      if (response.data.success) {
        setStep(2); // Chuyển sang bước 2 xác nhận OTP
        setError("");
        setSuccess("OTP đã được gửi đến email của bạn.");
      } else {
        setError(response.data.message || "Không thể gửi OTP. Vui lòng thử lại.");
        setSuccess("");
      }
    } catch (err) {
      setError("Không thể gửi OTP. Vui lòng thử lại.");
      setSuccess("");
    }
  };
  

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/forgot/verify-otp", {
        email: email,  // Sử dụng email đã lưu trữ
        otp: otp,
      });
  
      if (response.data.success) {
        setStep(3); // Chuyển sang bước 3 để đặt lại mật khẩu
        setError("");
        setSuccess("OTP xác nhận thành công. Vui lòng đặt lại mật khẩu.");
      } else {
        setError(response.data.message || "OTP không hợp lệ.");
        setSuccess("");
      }
    } catch (err) {
      setError("Không thể xác nhận OTP. Vui lòng thử lại.");
      setSuccess("");
    }
  };
  

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      setSuccess("");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/forgot/reset-password", {
        email: email,  // Sử dụng email đã lưu trữ
        newPassword: newPassword,
        confirmPassword: confirmPassword

      });
  
      if (response.data.success) {
        setError("");
        setSuccess("Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập.");
        navigate("/login"); // Điều hướng tới trang đăng nhập
      } else {
        setError(response.data.message || "Không thể đặt lại mật khẩu.");
        setSuccess("");
      }
    } catch (err) {
      setError("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      setSuccess("");
    }
  };
  

  const styles = {
    body: {
      background: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)",
      height: "100vh",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      margin: 0,
    },
    night: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    shootingStar: {
      position: "absolute",
      width: "3px",
      height: "6px",
      background: "rgba(0, 191, 255, 0.9)",
      boxShadow: "0 0 12px rgba(0, 191, 255, 1)",
      borderRadius: "50%",
      animation: "shoot 2s linear infinite",
    },
    container: {
      position: "relative",
      background: "rgba(255, 255, 255, 0.1)",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      maxWidth: "500px",
      width: "100%",
      zIndex: 10,
    },
    h1: {
      textAlign: "center",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    formLabel: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    formControl: {
      color: "black",
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      marginBottom: "10px",
    },
    btn: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
    errorMessage: {
      color: "red",
      fontSize: "14px",
      marginTop: "10px",
    },
    successMessage: {
      color: "green",
      fontSize: "14px",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.night}>
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              ...styles.shootingStar,
              top: star.top,
              left: star.left,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
      <div style={styles.container}>
        <h1 style={styles.h1}>Quên Mật Khẩu</h1>
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}

        {step === 1 && (
          <>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.formLabel}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.formControl}
                required
              />
            </div>
            <button onClick={handleSendOtp} style={styles.btn}>
              Gửi OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={styles.formGroup}>
              <label htmlFor="otp" style={styles.formLabel}>
                OTP:
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.formControl}
                required
              />
            </div>
            <button onClick={handleVerifyOtp} style={styles.btn}>
              Xác nhận OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div style={styles.formGroup}>
              <label htmlFor="newPassword" style={styles.formLabel}>
                Mật khẩu mới:
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.formControl}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.formLabel}>
                Xác nhận mật khẩu:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.formControl}
                required
              />
            </div>
            <button onClick={handleResetPassword} style={styles.btn}>
              Đặt lại mật khẩu
            </button>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes shoot {
            0% {
              transform: translateY(-100px) translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) translateX(50px);
              opacity: 0;
            }
          } 
        `}
      </style>
    </div>
  );
};

export default ForgotPassword;
