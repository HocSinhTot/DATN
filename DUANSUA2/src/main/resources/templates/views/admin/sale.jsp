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
    /* Header */
    .page-title {
        text-align: center;
        padding: 20px 0;
    }

    /* Card */
    .card {
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .card-header {
        background-color: #007bff;
        color: white;
        border-radius: 10px 10px 0 0;
        padding: 12px 20px;
    }

    .card-body {
        padding: 20px;
    }

    /* Table */
    .table {
        width: 100%;
        border-collapse: collapse;
    }

    thead {
        background-color: #f8f9fa;
    }

    tbody tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tbody tr:hover {
        background-color: #e2e6ea;
    }

    th, td {
        padding: 10px;
        text-align: center;
        border: none;
    }
</style>
</head>
<body>
    <div class="be-wrapper be-fixed-sidebar">

        <jsp:include page="formadmin/header.jsp" />

<header class="my-4">
    <h1 class="text-center">Mã giảm giá</h1>
</header>

<div class="container">
    <div class="row">
        <div style="width: 1200px;padding-left: 100px">
            <div class="card">
                <div class="card-header">Thông tin mã giảm giá</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Mã giảm giá</th>
                                <th scope="col">Ngày áp dụng</th>
                                <th scope="col">Ngày hết hạn</th>
                                <th scope="col">Mức giảm</th>
                                <th scope="col">Điều kiện áp dụng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <%-- Dữ liệu mã giảm giá giả lập --%>
                            <tr>
                                <td>SUMMER2024</td>
                                <td>2024-06-01</td>
                                <td>2024-06-30</td>
                                <td>10%</td>
                                <td>Đơn hàng từ 500,000 VND trở lên</td>
                            </tr>
                            <tr>
                                <td>NEWYEAR2025</td>
                                <td>2025-01-01</td>
                                <td>2025-01-31</td>
                                <td>20%</td>
                                <td>Đơn hàng từ 800,000 VND trở lên</td>
                            </tr>
                            <tr>
                                <td>BIRTHDAY2024</td>
                                <td>2024-09-01</td>
                                <td>2024-09-30</td>
                                <td>15%</td>
                                <td>Đơn hàng từ 700,000 VND trở lên</td>
                            </tr>
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