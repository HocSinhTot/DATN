import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage

    useEffect(() => {
        fetchCartData();
    }, [userId]);

    const fetchCartData = () => {
        if (!userId) {
            setMessage("Không tìm thấy userId. Vui lòng đăng nhập.");
            return;
        }

        // Fetch cart data from the backend
        axios.get(`http://localhost:8080/api/cart/viewCart?userId=${userId}`, { withCredentials: true })
            .then(response => {
                const cartData = response.data;
                if (cartData) {
                    setCartItems(cartData.cartItems);  // Cập nhật trạng thái giỏ hàng
                    setTotalAmount(cartData.totalAmount);  // Cập nhật tổng số tiền
                }
            })
            .catch(error => {
                console.error("Error fetching cart data:", error);
                setMessage("Lỗi khi tải giỏ hàng. Vui lòng thử lại.");
            });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            axios.post(
                'http://localhost:8080/api/cart/updateQuantity',
                null, // Body null vì sử dụng query params
                {
                    params: { userId, productId, quantity }, // Truyền tham số qua query string
                    withCredentials: true,
                }
            )
                .then(() => {
                    fetchCartData(); // Làm mới dữ liệu giỏ hàng
                })
                .catch(error => {
                    alert('Cập nhật giỏ hàng thất bại.');
                    console.error(error);
                });
        }
    };

    const removeFromCart = (productId) => {
        if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            axios.post(
                'http://localhost:8080/api/cart/removeFromCart',
                null,
                {
                    params: { userId, productId },
                    withCredentials: true,
                }
            )
                .then(() => {
                    fetchCartData(); // Làm mới dữ liệu giỏ hàng sau khi xóa
                })
                .catch(error => {
                    alert('Xóa sản phẩm thất bại.');
                    console.error(error);
                });
        }
    };

    const clearCart = () => {
        if (window.confirm("Bạn chắc chắn muốn xóa hết sản phẩm trong giỏ hàng?")) {
            axios.post(
                'http://localhost:8080/api/cart/clearCart',
                null,
                {
                    params: { userId },
                    withCredentials: true,
                }
            )
                .then(() => {
                    fetchCartData(); // Làm mới dữ liệu giỏ hàng sau khi xóa
                })
                .catch(error => {
                    alert('Xóa giỏ hàng thất bại.');
                    console.error(error);
                });
        }
    };

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.product.price);
            const quantity = parseInt(item.totalQuantity, 10);

            if (isNaN(price) || isNaN(quantity)) {
                console.error(`Invalid price or quantity for product: ${item.product.name}`);
                return sum;
            }

            return sum + (price * quantity);
        }, 0);

        setTotalAmount(total); // Cập nhật tổng tiền
    };

    useEffect(() => {
        if (cartItems.length > 0) {
            calculateTotal(cartItems);
        }
    }, [cartItems]);

    const handlePayment = () => {
        const cartData = {
            userId,
            cartItems
        };
    
        axios.post('http://localhost:8080/api/cart/invoice', cartData)
            .then(response => {
                const invoiceData = response.data;
                navigate('/invoice', { state: { invoiceData } }); // Đảm bảo truyền đúng dữ liệu
            })
            .catch(error => {
                console.error("Error creating invoice:", error);
            });
    };
    
    return (
        <div className="cart-page">
            <h2>Giỏ Hàng</h2>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.product.id}>
                            <td>{item.product.name}</td>
                            <td>
                                <a href={`/product/${item.product.id}`}>
                                    <img
                                        src={`/assets/images/${item.product.productsImages[0].image.url}`}
                                        alt={item.product.name}
                                        className="img-responsive"
                                    />
                                </a>
                            </td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}</td>
                            <td>
                                <div className="quant-input">
                                    <button onClick={() => updateQuantity(item.product.id, item.totalQuantity - 1)}>-</button>
                                    <input type="number" value={item.totalQuantity} min="1" readOnly />
                                    <button onClick={() => updateQuantity(item.product.id, item.totalQuantity + 1)}>+</button>
                                </div>
                            </td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.totalQuantity)}</td>
                            <td>
                                <button onClick={() => removeFromCart(item.product.id)} className="remove-btn">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="total-section">
                <h2>Tổng cộng: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span></h2>
            </div>

            <button onClick={clearCart} className="clear-cart-btn">Xóa hết</button>

            <button onClick={handlePayment} className="payment-btn">Thanh Toán</button>
        </div>
    );
};

export default CartPage;
