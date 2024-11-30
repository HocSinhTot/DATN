import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const InvoicePage = () => {
    const { state } = useLocation();
    const { invoiceData } = state || {};
    const [address, setAddress] = useState("");
    const [payMethod, setPayMethod] = useState(1); // 1: COD, 2: VNPay
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");

    const handlePaymentSubmit = (event) => {
        event.preventDefault();

        const formData = {
            userId: parseInt(userId),
            totalAmount: invoiceData.totalAmount,
            address,
            payMethod
        };

        axios.post('http://localhost:8080/api/cart/order/redirectPayment', formData)
            .then(response => {
                if (payMethod === 2) {
                    // Thanh toán qua VNPay: chuyển hướng tới VNPay
                    const paymentUrl = response.data.paymentUrl; // Nhận URL thanh toán từ API backend
                    window.location.href = paymentUrl; // Chuyển hướng người dùng đến VNPay
                } else {
                    // Thanh toán COD
                    alert('Đặt hàng thành công');
                    navigate('/', { state: { orderId: response.data.orderId } });
                }
            })
            .catch(error => {
                console.error("Error processing payment:", error);
            });
    };

    return (
        <div>
            <h2>Hóa Đơn</h2>
            <div>
                <p><strong>Tổng tiền:</strong> {invoiceData?.totalAmount} VND</p>
            </div>
            <form onSubmit={handlePaymentSubmit}>
                <div>
                    <label>Địa chỉ giao hàng:</label>
                    <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Phương thức thanh toán:</label>
                    <div>
                        <input 
                            type="radio" 
                            value="1" 
                            checked={payMethod === 1} 
                            onChange={() => setPayMethod(1)} 
                        /> Thanh toán khi nhận hàng
                        <input 
                            type="radio" 
                            value="2" 
                            checked={payMethod === 2} 
                            onChange={() => setPayMethod(2)} 
                        /> Thanh toán qua VNPay
                    </div>
                </div>

                <button type="submit">Xác nhận thanh toán</button>
            </form>
        </div>
    );
};

export default InvoicePage;
