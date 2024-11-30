<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Edit Order Status</title>
<link rel="stylesheet" type="text/css" href="assets/css/app.css">
</head>
<body>
	<div class="container">
		<div class="row">
			<div style="width: 1200px;padding-left: 100px">
				<div class="card">
					<div class="card-header">Chỉnh sửa trạng thái đơn hàng</div>
					<div class="card-body">
						<form action="updateOrderStatus" method="post">
							<input type="hidden" name="orderId" value="${order.id}" />
							<div class="form-group">
								<label for="orderStatus">Trạng thái đơn hàng</label>
								<select name="orderStatusId" class="form-control">
									<c:forEach var="status" items="${orderStatuses}">
										<option value="${status.id}" <c:if test="${status.id == order.orderStatus.id}">selected</c:if>>${status.status}</option>
									</c:forEach>
								</select>
							</div>
							<button type="submit" class="btn btn-primary">Cập nhật</button>
							<a href="order" class="btn btn-secondary">Hủy</a>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
