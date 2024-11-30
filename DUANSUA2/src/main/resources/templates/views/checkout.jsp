<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thanh toán</title>
    <!-- Các thư viện CSS và JavaScript cần thiết -->
</head>
<body>
    <h1>Thông tin thanh toán</h1>
    
    <!-- Form nhập thông tin giao hàng và phương thức thanh toán -->
    <form action="/checkout" method="post">
        <label for="address">Địa chỉ giao hàng:</label>
        <input type="text" id="address" name="address" required>
        <br><br>
        
        <label for="paymentMethod">Phương thức thanh toán:</label>
        <select id="paymentMethod" name="paymentMethod" required>
            <option value="cash">Tiền mặt</option>
            <option value="credit_card">Thẻ tín dụng</option>
            <!-- Các phương thức thanh toán khác nếu cần -->
        </select>
        <br><br>
        
        <!-- Bảng hiển thị các sản phẩm trong giỏ hàng -->
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="cartItem" items="${cart}">
                    <tr>
                        <td>${cartItem.product.name}</td>
                        <td>${cartItem.product.price}</td>
                        <td>${cartItem.quantity}</td>
                        <td>${cartItem.product.price * cartItem.quantity}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
        
        <!-- Hiển thị tổng số tiền cần thanh toán -->
        <h2>Total: ${totalAmount} VND</h2>
        
        <!-- Nút submit để hoàn thành thanh toán -->
        <button type="submit">Thanh toán</button>
    </form>
</body>
</html>
