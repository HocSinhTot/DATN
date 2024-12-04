import React, { useState, useEffect } from 'react';

const WishlistPage = () => {
    const [listLike, setListLike] = useState([]);

    useEffect(() => {
        const username = sessionStorage.getItem('username'); // Lấy thông tin người dùng từ sessionStorage

        if (!username) {
            console.error('User not logged in');
            return; // Ngừng thực thi nếu chưa đăng nhập
        }

        fetch('http://localhost:8080/api/likes/like-products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${username}` // Gửi username hoặc token nếu cần
            },
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch liked products');
                }
                return response.json();
            })
            .then((data) => setListLike(data))
            .catch((error) => console.error('Error fetching liked products:', error));
    }, []);

    const handleDeleteLike = (id) => {
        const username = sessionStorage.getItem('username');

        if (!username) {
            console.error('User not logged in');
            return;
        }

        fetch(`http://localhost:8080/api/likes/delete?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${username}`,
            },
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting liked product');
            }
            return response.text();  // Dùng .text() thay vì .json() vì phản hồi không phải JSON
        })
        .then(message => {
            console.log(message);  // In thông báo từ server
            if (message === 'Favourite deleted') {
                setListLike(listLike.filter(item => item.id !== id));
            }
        })
        .catch(error => {
            console.error('Error deleting liked product:', error);
        });
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
                        height: 'auto', // Tăng chiều cao cho bảng
                    }}
                >
                    <thead>
                        <tr>
                            <th
                                colSpan="3"
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '20px', // Tăng padding
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                Danh Sách Sản Phẩm Yêu Thích
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listLike.map((like) => (
                            <tr key={like.id}>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px', // Tăng padding cho mỗi ô
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
                                        padding: '20px', // Tăng padding cho mỗi ô
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
                                        padding: '20px', // Tăng padding cho mỗi ô
                                    }}
                                >
                                    <button
                                        onClick={() => handleDeleteLike(like.id)}
                                        style={{
                                            backgroundColor: '#ff6f61',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '12px 24px', // Tăng kích thước nút
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
        </div>
    );
};

export default WishlistPage;
