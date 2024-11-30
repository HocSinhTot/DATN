<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thay Đổi Mật Khẩu</title>
    <style>
body {
    font-family: Arial, sans-serif;
    background-color: #f7f7f7;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    animation: fadeIn 1.5s ease-in-out;
    background: url('img/lg1.jpg') no-repeat center center fixed;
    background-size: cover;
}

.container {
    width: 100%;
    max-width: 400px;
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
input[type="password"] {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border 0.3s, box-shadow 0.3s, transform 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
}

input[type="text"]:hover,
input[type="password"]:hover {
    transform: scale(1.02);
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

.back-to-login {
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

    </style>
</head>
<body>
    <div class="container">
        <h1>Thay Đổi Mật Khẩu</h1>
        <form action="/change-password" method="post">
            <label for="currentPassword">Mật Khẩu Hiện Tại:</label>
            <input type="password" id="currentPassword" name="currentPassword" required>
            <label for="newPassword">Mật Khẩu Mới:</label>
            <input type="password" id="newPassword" name="newPassword" required>
            <label for="confirmPassword">Xác Nhận Mật Khẩu Mới:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required>
            <div class="error-message">
                <% if (request.getAttribute("error") != null) { %>
                    <%= request.getAttribute("error") %>
                <% } %>
            </div>
            <button type="submit">Thay Đổi Mật Khẩu</button>
        </form>
    </div>
</body>
</html>
