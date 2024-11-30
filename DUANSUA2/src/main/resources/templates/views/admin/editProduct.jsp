<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit User</title>
    <style >
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
            margin: 0 auto;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.9); /* Độ trong suốt */
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s;
        }

        .container:hover {
            background-color: rgba(255, 255, 255, 1); /* Hiện màu trắng đầy đủ khi hover */
        }

        h2 {
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
            transition: border-color 0.3s;
        }

        .form-control:focus,
        .select:focus,
        .file-input:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); /* Hiển thị hiệu ứng đồng thời */
        }

        .form-control:hover,
        .select:hover,
        .file-input:hover {
            border-color: #555;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 5px 0;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        .btn-secondary {
            display: inline-block;
            padding: 10px 20px;
            margin: 5px 0;
            font-size: 16px;
            color: #fff;
            background-color: #6c757d;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }

        .btn-secondary:hover {
            background-color: #5a6268;
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
            background-image: url('/views/admin/img/anh1.jpg'); /* Thay đổi đường dẫn đến hình ảnh */
            background-size: cover;
        }

    </style>
</head>
<body>
<div class="container mt-5">
    <h2>Sửa danh sách sản phẩm</h2>
    <form action="/update/${product.id}" method="post" enctype="multipart/form-data">
        <input type="hidden" name="id" value="${product.id}">
        <div class="form-group">
            <label for="name" class="form-label">Name:</label>
            <input type="text" class="form-control" id="name" name="name" value="${product.name}" placeholder="Enter product name" required>
        </div>
        <div class="form-group">
            <label for="describe" class="form-label">Description:</label>
            <input type="text" class="form-control" id="describe" name="describe" value="${product.describe}" placeholder="Enter product description" required>
        </div>
        <div class="form-group">
            <label for="price" class="form-label">Price:</label>
            <input type="number" class="form-control" id="price" name="price" value="${product.price}" placeholder="Enter product price" required>
        </div>
        <div class="form-group">
            <label for="quantity" class="form-label">Quantity:</label>
            <input type="number" class="form-control" id="quantity" name="quantity" value="${product.quantity}" placeholder="Enter product quantity" required>
        </div>
        <div class="form-group">
            <label for="file" class="form-label">Image:</label>
            <input type="file" class="file-input" id="file" name="file">
            <!-- Display current image if exists -->
            <c:if test="${not empty product.image}">
                <img src="/views/admin/images/${product.image}" alt="${product.name}" width="100">
            </c:if>
        </div>
        <div class="form-group">
            <label for="brandid" class="form-label">Brand:</label>
            <select class="form-control" id="brandid" name="brandid">
                <c:forEach var="brand" items="${brands}">
                    <option value="${brand.id}" ${brand.id eq product.brand.id ? 'selected' : ''}>${brand.name}</option>
                </c:forEach>
            </select>
        </div>
        <div class="form-group">
            <label for="categoriid" class="form-label">Category:</label>
            <select class="form-control" id="categoriid" name="categoriid">
                <c:forEach var="category" items="${categories}">
                    <option value="${category.id}" ${category.id eq product.category.id ? 'selected' : ''}>${category.name}</option>
                </c:forEach>
            </select>
        </div>
        <div class="form-group">
            <label for="createDate" class="form-label">Create Date:</label>
<input type="date" class="form-control" id="createDate" name="createDate" value="${product.createDate}" readonly>
        </div>
        <div class="form-group">
           
<button type="submit" class="btn">Save Changes</button>
        </div>
    </form>
</div>
</body>
</html>