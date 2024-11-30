	<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	    <title>Forgot Password</title>
	    <style>
	        @keyframes fadeIn {
	            from { opacity: 0; }
	            to { opacity: 1; }
	        }
	        @keyframes slideIn {
	            from { transform: translateY(20px); opacity: 0; }
	            to { transform: translateY(0); opacity: 1; }
	        }
	        body {
	            font-family: 'Roboto', sans-serif;
	            background: url('/img/lg3.jpg') no-repeat center center fixed;
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
	        h1 {
	            margin-bottom: 20px;
	            font-size: 24px;
	            color: #333;
	        }
	        form {
	            margin-top: 20px;
	        }
	        label {
	            display: block;
	            text-align: left;
	            margin-bottom: 8px;
	            color: #555;
	        }
	        input[type="text"] {
	            width: 100%;
	            padding: 12px;
	            margin-bottom: 15px;
	            border: 1px solid #ddd;
	            border-radius: 8px;
	            box-sizing: border-box;
	            transition: border 0.3s, box-shadow 0.3s, transform 0.3s;
	        }
	        input[type="text"]:focus {
	            border-color: #007bff;
	            box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
	        }
	        input[type="text"]:hover {
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
	    </style>
	</head>
	<body>
	    <div class="container">
	        <h1>Quên mật khẩu</h1>
	        <form action="/Forgot/otp" method="post">
	            <label for="email">Vui lòng nhập email của bạn</label>
	            <input type="text" id="email" name="email" required>
	            <div class="error-message">
	                <% if (request.getAttribute("error") != null) { %>
	                    <%= request.getAttribute("error") %>
	                <% } %>
	            </div>
	            <button type="submit">Xác nhận</button>
	        </form>
	    </div>
	</body>
	</html>
