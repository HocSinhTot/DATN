import React, { useState, useEffect } from 'react';
import Popup from './Popupuser';
import Notification from './Notification';
const WishlistPage = () => {
    const [listLike, setListLike] = useState([]);
    const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });

    useEffect(() => {
        const username = sessionStorage.getItem('username');

        if (!username) {
            console.error('Người dùng chưa đăng nhập');
            return;
        }

        fetch('http://localhost:8080/api/likes/like-products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${username}`,
            },
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách yêu thích');
                }
                return response.json();
            })
            .then((data) => setListLike(data))
            .catch((error) => console.error('Lỗi khi lấy danh sách yêu thích:', error));
    }, []);
    const handleShowPopup = (id) => {
        setPopup({
            show: true,
            message: 'Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?',
            onConfirm: () => {
                handleDeleteLike(id); // Gọi hàm xóa
            },
        });
    };

    const handleDeleteLike = (id) => {
        const username = sessionStorage.getItem('username');

        if (!username) {
            console.error('Người dùng chưa đăng nhập');
            return;
        }

        fetch(`http://localhost:8080/api/likes/delete?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${username}`,
            },
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Lỗi khi xóa sản phẩm yêu thích');
                }
                return response.text();
            })
            .then((message) => {
                console.log(message);
                if (message === 'Favourite deleted') {
                    setListLike((prevList) => prevList.filter((item) => item.id !== id));
                    setNotificationMessage('Đã xóa khỏi yêu thích');
                    setNotificationType('success');
                    setShowNotification(true);

                    setTimeout(() => setShowNotification(false), 3000); // Ẩn thông báo sau 3 giây
                }
                setPopup({ show: false }); // Đóng popup sau khi xóa
            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm yêu thích:', error);
            });
    };



    ///thông báo
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('success');

    const handlePurchase = () => {
        // Logic mua hàng
        setNotificationMessage('Đã xóa khỏi yêu thích');
        setNotificationType('success');
        setShowNotification(true);

        setTimeout(() => setShowNotification(false), 3000); // Ẩn sau 3 giây
    };


    return (
        <div
            className="wishlist-page"
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
                Sản Phẩm Yêu Thích
            </h2>

            <div className="table-responsive">
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '20px',
                        fontSize: '1.2rem',
                        height: 'auto',
                    }}
                >
                    <thead>
                        <tr>
                            <th
                                colSpan="3"
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '20px',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                Danh Sách Sản Phẩm Yêu Thích
                                {/* Thông báo */}
                                <Notification
                                    message={notificationMessage}
                                    type={notificationType}
                                    show={showNotification}
                                    onClose={() => setShowNotification(false)}
                                />

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listLike.map((like) => (
                            <tr key={like.id}>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                    }}
                                >
                                    {like.product.images.length > 0 && (
                                        <img
                                            src={`/assets/images/${like.product.images[0].url}`}
                                            alt={like.product.name}
                                            style={{
                                                width: '150px',
                                                height: 'auto',
                                                objectFit: 'cover',
                                                borderRadius: '10px',
                                            }}
                                        />
                                    )}
                                </td>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                    }}
                                >
                                    <div className="product-name">
                                        <a href={`/productdetails/${like.product.id}`} style={{ fontSize: '1.2rem' }}>
                                            {like.product.name}
                                        </a>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        {like.product.price.toLocaleString()} VNĐ
                                    </div>
                                </td>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                    }}
                                >
                                    <button
                                        onClick={() => handleShowPopup(like.id)}
                                        style={{
                                            backgroundColor: '#ff6f61',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '12px 24px',
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
            </div>

            {popup.show && (
                <Popup
                    message={popup.message}
                    onClose={() => setPopup({ show: false, message: '', onConfirm: null })}
                    onConfirm={popup.onConfirm}
                />
            )}
        </div>
    );
};

export default WishlistPage;
