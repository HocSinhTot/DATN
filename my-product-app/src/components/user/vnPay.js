import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentForm = () => {
    const { state } = useLocation(); // Lấy dữ liệu từ trang trước
    const { userId, address, totalAmount } = state || {}; // Đảm bảo dữ liệu có sẵn
    const navigate = useNavigate(); // Để điều hướng sau khi thanh toán thành công

    const [cardInfoVisible, setCardInfoVisible] = useState(true);
    const [otpVisible, setOtpVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardholderName: '',
        issueDate: '',
        cardPassword: '',
        userId: userId,
        address: address,
        totalAmount: totalAmount,
    });

    const [otp, setOtp] = useState('');

    // Hàm xác thực thông tin thẻ
    const validateCardInfo = () => {
        const { cardNumber, cardholderName, issueDate } = formData;

        if (cardNumber && cardholderName && issueDate) {
            const cardNumberRegex = /^\d{16,19}$/;
            if (!cardNumberRegex.test(cardNumber)) {
                setErrorMessage("Số thẻ không hợp lệ. Vui lòng nhập lại.");
                return;
            }

            setCardInfoVisible(false);
            setOtpVisible(true);
        } else {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin thẻ.");
        }
    };

    // Hàm thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Hàm gửi OTP và hoàn tất thanh toán
    const handleOtpSubmit = (e) => {
        e.preventDefault();

        // Xác thực OTP và lưu dữ liệu đơn hàng
        axios.post('http://localhost:8080/api/cart/order/redirectPayment', {
            userId: formData.userId,
            address: formData.address,
            totalAmount: formData.totalAmount,
            payMethod: 2, // Thêm phương thức thanh toán VNPay
            otp: otp, // OTP nhập vào từ người dùng
        })
            .then(response => {
                alert('Thanh toán thành công!');
                navigate('/', { state: { orderId: response.data.orderId } }); // Điều hướng về trang chủ với orderId
            })
            .catch(err => {
                console.error('Error processing payment:', err);
                setErrorMessage('Xác thực OTP không thành công.');
            });
    };

    const styles = {
        paymentContainer: {
            maxWidth: '600px',
            margin: '50px auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        paymentHeader: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        paymentHeaderImg: {
            width: '150px',
            marginBottom: '10px',
        },
        paymentHeaderH3: {
            fontSize: '24px',
            color: '#333',
        },
        formControl: {
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
        },
        btnPrimary: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
        },
        alertDanger: {
            color: '#e74c3c',
            margin: '10px 0',
            fontSize: '14px',
            textAlign: 'center',
        }
    };

    return (
        <div style={styles.paymentContainer}>
            <div style={styles.paymentHeader}>
                <img src="/images/vnpay-logo.png" alt="VNPay Logo" style={styles.paymentHeaderImg} />
                <h3 style={styles.paymentHeaderH3}>Thanh toán VNPay</h3>
            </div>

            {errorMessage && <div style={styles.alertDanger}>{errorMessage}</div>}

            <p><strong>Người dùng:</strong> {formData.userId}</p>
            <p><strong>Địa chỉ giao hàng:</strong> {formData.address}</p>
            <p><strong>Số tiền thanh toán:</strong> {formData.totalAmount} VND</p>

            <form id="paymentForm" onSubmit={handleOtpSubmit}>
                <input type="hidden" name="userId" value={formData.userId} />
                <input type="hidden" name="totalAmount" value={formData.totalAmount} />
                <input type="hidden" name="address" value={formData.address} />

                {cardInfoVisible && (
                    <div id="cardInfoSection">
                        <div className="mb-3">
                            <label className="form-label">Số thẻ</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                placeholder="Số thẻ"
                                className="form-control"
                                style={styles.formControl}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tên chủ thẻ</label>
                            <input
                                type="text"
                                name="cardholderName"
                                value={formData.cardholderName}
                                onChange={handleInputChange}
                                placeholder="Tên chủ thẻ"
                                className="form-control"
                                style={styles.formControl}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ngày phát hành (MM/YY)</label>
                            <input
                                type="text"
                                name="issueDate"
                                value={formData.issueDate}
                                onChange={handleInputChange}
                                placeholder="Ngày phát hành"
                                className="form-control"
                                style={styles.formControl}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            style={styles.btnPrimary}
                            onClick={validateCardInfo}
                        >
                            Tiếp tục
                        </button>
                    </div>
                )}

                {otpVisible && (
                    <div id="otpSection">
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu OTP</label>
                            <input
                                type="password"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)} // Cập nhật OTP
                                placeholder="Mật khẩu OTP"
                                className="form-control"
                                style={styles.formControl}
                                required
                            />
                        </div>
                        <button type="submit" style={styles.btnPrimary}>
                            Xác nhận thanh toán
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PaymentForm;
