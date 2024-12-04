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
        <div className="cnt-home">
            <div className="body-content">
                <div className="container">
                    <div className="my-wishlist-page">
                        <div className="row">
                            <div className="col-md-12 my-wishlist">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th colSpan="3" className="heading-title">Sản phẩm yêu thích</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listLike.map((like) => (
                                                <tr key={like.id}>
                                                    <td className="col-md-2">
                                                        {like.product.images.length > 0 && (
                                                            <img
                                                                src={`/assets/images/${like.product.images[0].url}`}
                                                                className="img-responsive"
                                                                alt="Product Image"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="col-md-7">
                                                        <div className="product-name">
                                                            <a href={`/productdetails/${like.product.id}`}>
                                                                {like.product.name}
                                                            </a>
                                                        </div>
                                                        
                                                        <div className="">
                                                            <span style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                                                                {like.product.price.toLocaleString()} VNĐ
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="col-md-1 close-btn">
                                                        <button onClick={() => handleDeleteLike(like.id)}>
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
