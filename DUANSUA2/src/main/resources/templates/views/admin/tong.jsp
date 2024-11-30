
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Thống kê doanh thu</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<div class="container">
    <h1 class="text-center my-4">Thống kê doanh thu theo tháng</h1>

    <form action="${pageContext.request.contextPath}/revenue" method="get" class="my-4">
        <div class="form-row align-items-center">
            <div class="col-auto">
                <label for="month">Chọn tháng:</label>
                <select name="month" id="month" class="form-control">
                    <c:forEach begin="1" end="12" varStatus="loop">
                        <option value="${loop.index}" ${loop.index == selectedMonth ? 'selected' : ''}>Tháng ${loop.index}</option>
                    </c:forEach>
                </select>
            </div>
            <div class="col-auto">
                <label for="year">Chọn năm:</label>
                <select name="year" id="year" class="form-control">
                    <option value="2023" ${selectedYear == 2023 ? 'selected' : ''}>2023</option>
                    <option value="2024" ${selectedYear == 2024 ? 'selected' : ''}>2024</option>
                    <option value="2025" ${selectedYear == 2025 ? 'selected' : ''}>2025</option>
                </select>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary mt-2">Xem doanh thu</button>
            </div>
        </div>
    </form>

    <div class="card my-4">
        <div class="card-header">Tổng doanh thu tháng ${selectedMonth}/${selectedYear}</div>
        <div class="card-body">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Ngày</th>
                    <th scope="col">Doanh thu</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Ngày 1</td>
                    <td>${monthlyRevenue} VND</td>
                </tr>
                <!-- Thêm các dòng dữ liệu khác tương tự cho các ngày khác của tháng -->
                </tbody>
            </table>
        </div>
    </div>

</div>
</body>
</html>
