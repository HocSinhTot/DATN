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

.btn:hover {
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
    <h2>Add User</h2>
    <form action="/nguoidung/create" method="post" enctype="multipart/form-data">
        <div class="form-group">
            <label for="usename" class="form-label">Username</label>
            <input type="text" class="form-control" id="usename" name="usename" value="${user.usename}">
            <c:if test="${not empty errors['usename']}">
                <span style="color:red">${errors['usename'].defaultMessage}</span>
            </c:if>
        </div>

        <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" name="password" value="${user.password}">
            <c:if test="${not empty errors['password']}">
                <span style="color:red">${errors['password'].defaultMessage}</span>
            </c:if>
        </div>

        <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" value="${user.email}">
            <c:if test="${not empty errors['email']}">
                <span style="color:red">${errors['email'].defaultMessage}</span>
            </c:if>
        </div>

        <div class="form-group">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" value="${user.name}">
            <c:if test="${not empty errors['name']}">
                <span style="color:red">${errors['name'].defaultMessage}</span>
            </c:if>
        </div>

        <div class="form-group">
            <label for="birthday" class="form-label">Birthday</label>
            <input type="date" class="form-control" id="birthday" name="birthday" value="${user.birthday}">
            <c:if test="${not empty errors['birthday']}">
                <span style="color:red">${errors['birthday'].defaultMessage}</span>
            </c:if>
        </div>



        <div class="form-group">
            <label for="phone" class="form-label">Phone</label>
            <input type="text" class="form-control" id="phone" name="phone" value="${user.phone}">
            <c:if test="${not empty errors['phone']}">
                <span style="color:red">${errors['phone'].defaultMessage}</span>
            </c:if>
        </div>

        <div class="form-group">
            <label for="role" class="form-label">Role</label>
            <select class="select" id="role" name="role">
                <option value="true" ${user.role ? 'selected' : ''}>Admin</option>
                <option value="false" ${!user.role ? 'selected' : ''}>User</option>
            </select>
        </div>

        <div class="form-group">
            <label for="file" class="form-label">Image</label>
            <input type="file" class="file-input" id="file" name="file">
        </div>

        <button type="submit" class="btn">Submit</button>
    </form>
</div>
</body>
</html>
