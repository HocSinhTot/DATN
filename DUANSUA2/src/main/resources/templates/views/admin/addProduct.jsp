<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add User</title>
    <style>
        /* Reset CSS */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.9); /* Độ trong suốt */
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s, box-shadow 0.3s;
        }

        .container:hover {
            background-color: rgba(255, 255, 255, 1); /* Hiện màu trắng đầy đủ khi hover */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }

        .form-control,
        .select,
        .file-input {
            width: calc(100% - 20px);
            padding: 10px;
            margin: 0 auto;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-control:focus,
        .select:focus,
        .file-input:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); /* Hiển thị hiệu ứng đồng thời */
        }

        .btn,
        .btn-secondary {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 10px;
            margin-right: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
            text-decoration: none; /* Để nút Back là một liên kết */
            text-align: center;
        }

        .btn:hover,
        .btn-secondary:hover {
            background-color: #0056b3;
            transform: scale(1.05); /* Tăng kích thước nút khi hover */
        }

        .btn-secondary {
            background-color: #6c757d;
        }

        .btn-secondary:hover {
            background-color: #5a6268;
            transform: scale(1.05); /* Tăng kích thước nút khi hover */
        }

        /* Thêm hình ảnh làm nền */
body:before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image: url('/views/admin/img/hn1.jpg'); /* Thay đổi đường dẫn đến hình ảnh */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.5; /* Độ trong suốt */
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Thêm Sản Phẩm</h1>
    <form action="/add" method="post" enctype="multipart/form-data">
        <div class="form-group">
            <label for="name" class="form-label">Tên Sản Phẩm:</label>
            <input type="text" id="name" name="name" class="form-control">
        </div>
        <div class="form-group">
            <label for="describe" class="form-label">Mô Tả:</label>
            <input type="text" id="describe" name="describe" class="form-control">
        </div>
        <div class="form-group">
            <label for="price" class="form-label">Giá:</label>
            <input type="text" id="price" name="price" class="form-control">
        </div>
        <div class="form-group">
            <label for="quantity" class="form-label">Số Lượng:</label>
            <input type="text" id="quantity" name="quantity" class="form-control">
        </div>
        <div class="form-group">
            <label for="file" class="form-label">Ảnh:</label>
            <input type="file" id="file" name="file" class="file-input">
        </div>
        <div class="form-group">
            <label for="brandid" class="form-label">Thương Hiệu:</label>
            <select id="brandid" name="brandid" class="form-control">
                <c:forEach var="brand" items="${brands}">
                    <option value="${brand.id}">${brand.name}</option>
                </c:forEach>
            </select>
        </div>
        <div class="form-group">
            <label for="categoriid" class="form-label">Danh Mục:</label>
            <select id="categoriid" name="categoriid" class="form-control">
                <c:forEach var="category" items="${categories}">
                    <option value="${category.id}">${category.name}</option>
                </c:forEach>
            </select>
        </div>
        <div class="form-group">
    <label for="createDate" class="form-label">Ngày Tạo:</label>
    <input type="date" id="createDate" name="createDate" class="form-control" readonly>
</div>
        <div class="form-group">
            <button type="submit" class="btn">Thêm Sản Phẩm</button>
        </div>
    </form>
</div>
</body>
<script>
    // Lấy ngày hiện tại
    var today = new Date();

    // Định dạng ngày tháng để set giá trị cho input
    var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    // Đặt giá trị cho input
    document.getElementById('createDate').value = today;
</script>
</html>