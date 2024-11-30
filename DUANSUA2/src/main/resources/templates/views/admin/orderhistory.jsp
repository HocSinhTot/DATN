<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<link rel="shortcut icon" href="assets/img/logo-fav.png">
<title>Beagle</title>
<link rel="stylesheet" type="text/css"
	href="assets/lib/perfect-scrollbar/css/perfect-scrollbar.css">
<link rel="stylesheet" type="text/css"
	href="assets/lib/material-design-icons/css/material-design-iconic-font.min.css">
<link rel="stylesheet" type="text/css"
	href="assets/lib/jquery.vectormap/jquery-jvectormap-1.2.2.css">
<link rel="stylesheet" type="text/css"
	href="assets/lib/jqvmap/jqvmap.min.css">
<link rel="stylesheet" type="text/css"
	href="assets/lib/datetimepicker/css/bootstrap-datetimepicker.min.css">
<link rel="stylesheet" href="assets/css/app.css" type="text/css">
<style>
    /* Custom CSS */
    body {
        background-color: #f8f9fa; /* Màu nền */
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }

    .container {
        display: flex;
        flex-direction: row;
    }

    .sidebar {
        width: 250px;
        background-color: #343a40;
        padding-top: 60px;
        color: #fff;
        transition: width 0.3s;
    }

    .sidebar a {
        padding: 10px 20px;
        display: block;
        color: #fff;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .sidebar a:hover {
        background-color: #495057;
    }

    .content {
        flex-grow: 1;
        padding: 20px;
        transition: margin-left 0.3s;
    }

    .card {
        margin-bottom: 30px;
        border: none;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        background-color: #007bff;
        color: #fff;
        border-radius: 10px 10px 0 0;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-body {
        padding: 20px;
    }

    .btn-primary, .btn-warning, .btn-danger {
        border-radius: 5px;
        transition: all 0.3s ease;
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
    }

    .btn-primary:hover, .btn-warning:hover, .btn-danger:hover {
        filter: brightness(90%);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #007bff;
        color: #fff;
    }

    tbody tr:hover {
background-color: #c8e6c9; /* Màu nền khi hover */
    }

    tbody tr:nth-child(odd) {
        background-color: #f8f9fa;
    }

    .table-row-hover:hover {
        transform: scale(1.05); /* Phóng to 5% */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Màu xung quanh */
        border-radius: 10px; /* Đường viền cong */
        transition: all 0.3s ease; /* Hiệu ứng mượt mà */
    }

    tbody tr:nth-child(even) {
        background-color: #e9ecef;
    }

    .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }
</style>


</head>
<body>
	<div class="be-wrapper be-fixed-sidebar">

		<jsp:include page="formadmin/header.jsp" />

		<div class="be-content">
			<div class="container-fluid">
				<!-- Sidebar -->

				<!-- Content -->

	      <header class="my-4">
            <h1 class="text-center">Quản lý đơn hàng</h1>
        </header>
  
            <div class="row">
                <div style="width: 1200px;padding-left: 100px">
                    <div class="card">
                        <div class="card-header">Danh sách đơn hàng</div>
                        <div class="card-body">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Mã đơn hàng</th>
                                        <th scope="col">Ngày đặt hàng</th>
                                        <th scope="col">Tình trạng</th>
                                        <th scope="col">Tổng tiền</th>
                                        <th scope="col">Hành động</th> <!-- Add this column for actions -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="order" items="${orders}">
                                        <tr>
                                            <td>${order.id}</td>
                                            <td>${order.date}</td>
                                            <td>${order.orderStatus.status}</td>
                                            <td>${order.total}</td>
                                            <td>
                                                <a href="editOrderStatus?id=${order.id}" class="btn btn-primary">Edit</a> <!-- Edit button -->
                                                <form action="deleteOrder" method="post" style="display:inline;">
                                                    <input type="hidden" name="orderId" value="${order.id}">
                                                    <button type="submit" class="btn btn-danger" onclick="return confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');">Delete</button>
                                                </form>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                    </div>
               
            </div>
        </div>
			</div>
			<jsp:include page="formadmin/foother.jsp" />
</body>
</html>