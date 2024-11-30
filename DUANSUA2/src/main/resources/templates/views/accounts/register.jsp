<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <style>
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes slideIn {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @keyframes rainbowFlash {
            0%, 100% {
                transform: translateX(-100%);
                background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
            }
            50% {
                transform: translateX(100%);
                background: linear-gradient(90deg, violet, indigo, blue, green, yellow, orange, red);
            }
        }

        @keyframes rainbowOrbit {
            0% {
                top: -10px;
                left: -10px;
                background: red;
            }
            25% {
                top: -10px;
                left: calc(100% - 10px);
                background: orange;
            }
            50% {
                top: calc(100% - 10px);
                left: calc(100% - 10px);
                background: yellow;
            }
            75% {
                top: calc(100% - 10px);
                left: -10px;
                background: green;
            }
            100% {
                top: -10px;
                left: -10px;
                background: blue;
            }
        }

        body {
            font-family: 'Roboto', sans-serif;
            background: url('img/lg2.jpg') no-repeat center center fixed;
            background-size: cover;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            animation: fadeIn 1.5s ease-in-out;
        }

        .container {
            margin-top:200px;
            width: 90%;
            max-width: 500px;
            padding: 30px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            animation: slideIn 1s ease-in-out;
            position: relative;
            overflow: hidden;
        }

        .rainbow-flash {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
            animation: rainbowFlash 3s infinite;
            z-index: 1;
        }

        .rainbow-orbit {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
            animation: rainbowOrbit 5s linear infinite;
            z-index: 1;
        }

        h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
            animation: fadeIn 1.5s ease-in-out;
        }

        form {
            margin-top: 20px;
            animation: slideIn 1s ease-in-out;
        }

        label {
            display: block;
            text-align: left;
            margin-bottom: 8px;
            color: #555;
        }

        input[type="text"],
        input[type="password"],
        input[type="email"],
        input[type="tel"],
        select {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-sizing: border-box;
            transition: border 0.3s, box-shadow 0.3s, transform 0.3s;
        }

        input[type="text"]:focus,
        input[type="password"]:focus,
        input[type="email"]:focus,
        input[type="tel"]:focus,
        select:focus {
            border-color: #007bff;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
        }

        input[type="text"]:hover,
        input[type="password"]:hover,
        input[type="email"]:hover,
        input[type="tel"]:hover,
        select:hover {
            transform: scale(1.02);
        }

        input[type="checkbox"] {
            margin-right: 5px;
        }

        button[type="submit"] {
            width: 100%;
            padding: 12px;
            border: none;
            background-color: #007bff;
            color: #fff;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }

        button[type="submit"]:hover {
            background-color: #0056b3;
            transform: scale(1.05);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .error-message {
            color: red;
            margin-top: -10px;
            margin-bottom: 10px;
        }

        .success-message {
            color: green;
            margin-top: -10px;
            margin-bottom: 10px;
        }

        .back-to-login {
            display: block;
            text-align: right;
            text-decoration: none;
            color: #007bff;
            font-size: 14px;
            margin-top: 10px;
            transition: color 0.3s;
        }

        .back-to-login:hover {
            color: #0056b3;
        }

        .remember-me {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        @media (max-width: 400px) {
            .container {
                padding: 20px;
            }

            h1 {
                font-size: 20px;
            }

            button[type="submit"] {
                font-size: 14px;
                padding: 10px;
            }

            .back-to-login {
                font-size: 12px;
            }
        }

        .large-date-input {
            width: 100%;
            height: 40px;
            border-radius: 7px;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Đăng ký</h1>
    <form action="/register" method="post">
        <% if (request.getAttribute("success") != null) { %>
        <div class="success-message">
            <%= request.getAttribute("success") %>
        </div>
        <% } else if (request.getAttribute("error") != null) { %>
        <div class="error-message">
            <%= request.getAttribute("error") %>
        </div>
        <% } %>
        
        <label for="username">Tên người dùng:</label>
        <input type="text" id="username" name="username" required><br><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>
                <label for="address">Địa chỉ:</label>
        <input type="text" id="address" name="address" required><br><br>
        <label for="phone">Số điện thoại:</label>
        <input type="tel" id="phone" name="phone" required><br><br>
        

        
        <label for="gender">Giới tính:</label>
        <select id="gender" name="gender">
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
        </select><br><br>
        
        <label for="dob">Ngày sinh:</label>
        <input type="date" id="dob" name="dob" class="large-date-input" required><br><br>
        
        <label for="password">Mật khẩu:</label>
        <input type="password" id="password" name="password" required><br><br>
        
        <label for="confirm-password">Xác nhận mật khẩu:</label>
        <input type="password" id="confirm-password" name="confirm-password" required><br><br>
        
        <button type="submit">Đăng ký</button>
        <a href="/login" class="back-to-login">Quay lại đăng nhập</a>
    </form>
</div>
</body>
</html>
