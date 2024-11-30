<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
	crossorigin="anonymous">
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
	integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
	crossorigin="anonymous"></script>
</head>
<body>
	<div class="container">
		<div class="card">
			<div class="card-header">
				<h3>Chi tiết giỏ hàng</h3>
			</div>
			<div class="card-body">
		    
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="cartItem" items="${cartItems}">
                <tr>
                    <td>${cartItem.name}</td>
                    <td><img src="assets/images/${cartItem.image}" alt="${cartItem.name}" style="width: 100px;"></td>
                    <td>${cartItem.price}</td>
                    <td>${cartItem.quantity}</td>
                    <td>${cartItem.totalPrice}</td>
                </tr>
            </c:forEach>
            
            
            
            
            
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Total Amount:</strong></td>
                <td>${totalAmount}</td>
            </tr>
        </tfoot>
    </table>
    
    <p>Invoice generated at: ${currentTime}</p>

				<br>
				<div class="row">
					<div class="col-md-6"></div>
					<div class="col-md-6">
						<form action="/order/pay" method="post">
							<div class="mb-3">
								<label for="exampleFormControlInput1" class="form-label">Tổng
									tiền: <fmt:formatNumber> ${total}</fmt:formatNumber>
								</label>
							</div>
							<div class="mb-3">
								<label for="exampleFormControlInput1" class="form-label">Địa
									chỉ</label> <input type="text" name="address" placeholder="Địa chỉ"
									class="form-control">
							</div>
							<div class="mb-3">
								<label for="exampleFormControlInput1" class="form-label">Phương
									thức thanh toán</label>
								<div class="form-check">
									<input checked class="form-check-input" type="radio"
										name="payMethod" value="1" id="flexRadioDefault1"> <label
										class="form-check-label" for="flexRadioDefault1">
										Thanh toán khi nhận hàng </label>
								</div>
								<div class="form-check">
									<input class="form-check-input" type="radio" name="payMethod"
										id="flexRadioDefault2" value="2"> <label
										class="form-check-label" for="flexRadioDefault2">
										Thanh toán VNPay </label>
								</div>
							</div>
							<button class="btn btn-primary">Thanh toán</button>
						</form>
					</div>
				</div>


			</div>
		</div>
	</div>
</body>

</html>