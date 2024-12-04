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
          cart: cartItems.reduce((acc, item) => {
              acc[item.product.id] = item.totalQuantity;
              return acc;
          }, {}),
      };
  
      // Gửi yêu cầu POST thay vì GET
      axios.post('http://localhost:8080/api/cart/invoice', cartData)
          .then(response => {
              const invoiceData = response.data;
              navigate('/invoice', { state: { invoiceData } });
          })
          .catch(error => {
              console.error("Error creating invoice:", error);
          });
  };
  
    
    return (
        <div
        className="cart-page"
        style={{
          maxWidth: '1350px',
          margin: '20px auto',
          padding: '20px',
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
          }}
        >
          Giỏ Hàng
        </h2>
      
        {message && (
          <p style={{ textAlign: 'center', color: '#ff6f61', marginBottom: '20px' }}>
            {message}
          </p>
        )}
      
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
            fontSize: '1.2rem',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                Sản phẩm
              </th>
              <th style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                Hình ảnh
              </th>
              <th style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                Giá
              </th>
              <th style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                Số lượng
              </th>
              <th style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                Thành tiền
              </th>
              <th style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.product.id}>
                <td style={{ textAlign: 'center', padding: '15px' }}>
                  {item.product.name}
                </td>
                <td style={{ textAlign: 'center', padding: '15px' }}>
                  <a href={`/product/${item.product.id}`}>
                    <img
                      src={`/assets/images/${item.product.productsImages[0].image.url}`}
                      alt={item.product.name}
                      style={{
                        width: '150px',
                        height: 'auto',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                    />
                  </a>
                </td>
                <td style={{ textAlign: 'center', padding: '15px' }}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.product.price)}
                </td>
                <td style={{ textAlign: 'center', padding: '15px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.totalQuantity - 1)
                      }
                      style={{
                        backgroundColor: '#f0f0f0',
                        border: 'none',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.totalQuantity}
                      readOnly
                      style={{
                        width: '60px',
                        textAlign: 'center',
                        margin: '0 10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                      }}
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.totalQuantity + 1)
                      }
                      style={{
                        backgroundColor: '#f0f0f0',
                        border: 'none',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td style={{ textAlign: 'center', padding: '15px' }}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.product.price * item.totalQuantity)}
                </td>
                <td style={{ textAlign: 'center', padding: '15px' }}>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    style={{
                      backgroundColor: '#ff6f61',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
        <div
          style={{
            textAlign: 'right',
            marginBottom: '20px',
            fontSize: '1.5rem',
          }}
        >
          Tổng cộng:{' '}
          <span
            style={{
              color: '#ff6f61',
              fontWeight: 'bold',
            }}
          >
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(totalAmount)}
          </span>
        </div>
      
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '15px 30px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              borderRadius: '5px',
            }}
          >
            Mua thêm sản phẩm
          </button>
          <button
            onClick={handlePayment}
            style={{
              padding: '15px 30px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              borderRadius: '5px',
            }}
          >
            Thanh Toán
          </button>
        </div>
      </div>
      
      
    );
};

export default CartPage;
