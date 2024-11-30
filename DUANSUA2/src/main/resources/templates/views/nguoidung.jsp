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
<link rel="shortcut icon" href="assets\img\logo-fav.png">
<title>Beagle</title>
<link rel="stylesheet" type="text/css"
	href="assets\lib\perfect-scrollbar\css\perfect-scrollbar.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\material-design-icons\css\material-design-iconic-font.min.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\jquery.vectormap\jquery-jvectormap-1.2.2.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\jqvmap\jqvmap.min.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\datetimepicker\css\bootstrap-datetimepicker.min.css">
<link rel="stylesheet" href="assets\css\app.css" type="text/css">
<style>
/* Custom CSS */
body {
	background-color: #f8f9fa;
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
	background-color: #e2e6ea;
}

tbody tr:nth-child(even) {
	background-color: #f8f9fa;
}

tbody tr:nth-child(odd) {
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



		<div class="be-content">
			<div class="container-fluid">
				<!-- Sidebar -->

				<!-- Content -->

				<div class="content">
					<div class="card">
						<div class="card-header">
							<h5 class="card-title m-0">Quản lý người dùng</h5>
							<a href="admin/multipart/add" class="btn btn-primary">Thêm
								mới</a>
						</div>
						<div class="card-body">
							<table class="table">
								<thead>
									<tr>
										<th>ID</th>
										<th>Usename</th>
										<th>Password</th>
										<th>Email</th>
										<th>Name</th>
										<th>Birthday</th>
										<th>Address</th>
										<th>Phone</th>
										<th>Role</th>
										<th>Img</th>
										<th>Actions</th>

									</tr>
								</thead>
								<tbody>
									<c:forEach var="nguoiDung" items="${nguoiDungList}">
										<tr>
											<th scope="row">${nguoiDung.id}</th>
											<td>${nguoiDung.usename}</td>
											<td>${nguoiDung.password}</td>
											<td>${nguoiDung.email}</td>
											<td>${nguoiDung.name}</td>
											<td>${nguoiDung.birthday}</td>
											<td>${nguoiDung.address}</td>
											<td>${nguoiDung.phone}</td>
											<td>${nguoiDung.role ? 'Admin' : 'User'}</td>

										</tr>
									</c:forEach>

								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
</body>
</html>