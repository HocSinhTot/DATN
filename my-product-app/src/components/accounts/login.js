import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [stars, setStars] = useState([]);
  const navigate = useNavigate();

  // Function to get cookie value
  const getCookie = (name) => {
    const value = document.cookie;
    const parts = value.split("; ").find(row => row.startsWith(name + "="));
    return parts ? parts.split("=")[1] : null;
  };

  useEffect(() => {
    // Kiểm tra và lấy tên đăng nhập từ sessionStorage nếu có
    const savedUsername = sessionStorage.getItem("username");
    const savedRememberMe = sessionStorage.getItem("rememberMe") === "on";
    if (savedUsername) setUsername(savedUsername);
    if (savedRememberMe) setRememberMe(savedRememberMe);

    const savedPassword = getCookie("password");
    if (savedPassword && savedRememberMe) setPassword(savedPassword);

    // Generate random stars for the background
    const newStars = Array.from({ length: 7 }).map((_, index) => ({
      id: index,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
          username,
          password,
          rememberMe: rememberMe ? "on" : "off",
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Xóa thông báo lỗi trước đó
        setError(""); 

        // Lưu thông tin vào sessionStorage nếu đăng nhập thành công
        if (response.data.success) {
          sessionStorage.setItem("token", response.data.token);  // Lưu token vào localStorage

          sessionStorage.setItem("username", username); // Lưu tên đăng nhập vào sessionStorage
          sessionStorage.setItem("rememberMe", rememberMe ? "on" : "off");
          sessionStorage.setItem("userId", response.data.userId); // Lưu idUser vào sessionStorage
          // Điều hướng đến trang chính sau khi đăng nhập
          navigate("/"); 
        } else {
          setError(response.data.message || "Đăng nhập thất bại.");
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || "An error occurred.");
        } else {
          setError("An error occurred while logging in.");
        }
      }
    } else {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
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
    rememberMe: {
      display: "flex",
      alignItems: "center",
    },
    errorMessage: {
      color: "red",
      fontSize: "14px",
      marginTop: "10px",
    },
    backToLogin: {
      textDecoration: "none",
      color: "#fff",
      fontSize: "14px",
      marginTop: "10px",
      display: "inline-block",
    },
    backToLoginLeft: {
      float: "left",
    },
    backToLoginRight: {
      float: "right",
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
              animationDuration: "2s",
            }}
          />
        ))}
      </div>
      <div style={styles.container}>
        <h1 style={styles.h1}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.formLabel}>
              Tên đăng nhập:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.formControl}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.formLabel}>
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.formControl}
              required
            />
          </div>
          <div style={styles.rememberMe}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label  style={{  marginBottom: '0px' }} htmlFor="rememberMe">Lưu mật khẩu</label>
          </div>
          {error && <div style={styles.errorMessage}>{error}</div>}
          <button type="submit" style={styles.btn}>
            Login
          </button>
          <div style={{ paddingTop: "20px" }}>
            <a href="/Forgot" style={{ ...styles.backToLogin, ...styles.backToLoginLeft }}>
              Quên mật khẩu
            </a>
            <a href="/register" style={{ ...styles.backToLogin, ...styles.backToLoginRight }}>
              Đăng Ký
            </a>
          </div>
        </form>
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

export default LoginPage;