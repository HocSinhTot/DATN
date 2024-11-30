import React, { useState, useEffect } from 'react';

const WishlistPage = () => {
    const [listLike, setListLike] = useState([]);
    
    useEffect(() => {
        // Giả sử có một API để lấy danh sách yêu thích
        fetch('/api/like-products')
            .then(response => response.json())
            .then(data => setListLike(data))
            .catch(error => console.error('Error fetching liked products:', error));
    }, []);
    
    const handleDeleteLike = (id) => {
        // Hàm để xóa sản phẩm khỏi danh sách yêu thích
        fetch(`/api/dellike/${id}`, { method: 'DELETE' })
            .then(() => {
                // Xóa sản phẩm khỏi listLike sau khi thành công
                setListLike(listLike.filter(item => item.id !== id));
            })
            .catch(error => console.error('Error deleting liked product:', error));
    };

    return (
        <div className="cnt-home">
            {/* Header Component */}

            {/* Breadcrumb */}
            

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
                                            {/* Lặp qua danh sách sản phẩm yêu thích */}
                                            {listLike.map(like => (
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
                                                        <div className="rating">
                                                            {/* Hiển thị đánh giá sao */}
                                                            <i className="fa fa-star rate"></i>
                                                            <i className="fa fa-star rate"></i>
                                                            <i className="fa fa-star rate"></i>
                                                            <i className="fa fa-star rate"></i>
                                                            <i className="fa fa-star non-rate"></i>
                                                            <span className="review">(06 Đánh giá)</span>
                                                        </div>
                                                        <div className="pric">
                                                            <span style={{ fontWeight: 'bold', fontSize: 'medium' }}>
                                                                {like.product.price} VNĐ
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

                    {/* Brands Carousel */}
                    <div id="brands-carousel" className="logo-slider wow fadeInUp">
                        <div className="logo-slider-inner">
                            <div id="brand-slider" className="owl-carousel brand-slider custom-carousel owl-theme">
                                <div className="item m-t-15">
                                    <a href="#" className="image">
                                        <img src="assets/images/brands/brand1.png" alt="Brand 1" />
                                    </a>
                                </div>
                                <div className="item m-t-10">
                                    <a href="#" className="image">
                                        <img src="assets/images/brands/brand2.png" alt="Brand 2" />
                                    </a>
                                </div>
                                {/* Các thương hiệu khác */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
        </div>
    );
};

export default WishlistPage;
