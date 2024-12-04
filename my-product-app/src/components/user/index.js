import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideMenu from '../layout/menu';
import Header from '../layout/header';
import Head from '../layout/head';
import { CAlert } from '@coreui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Notification from './Notification';
const Index = () => {
  const [products, setProducts] = useState({
    all: [],
    cheap: [],
    list20: [],
    phonesCheap: [],
    accessoriesDiscount: [],
  });
  const [likedProducts, setLikedProducts] = useState([]); // Giả sử bạn đã có danh sách sản phẩm yêu thích của người dùng
  const [categoryId, setCategoryId] = useState(null); // Danh mục được chọn
  const userId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage
  const navigate = useNavigate();  // Dùng `useNavigate` thay vì `useHistory`

  const getProducts = async (filters) => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Có lỗi khi tải sản phẩm:', error);
      return [];
    }
  };

  // Các hàm fetch cho từng loại sản phẩm
  const fetchProductsByCategory = useCallback(async () => {
    const filters = { categoryId: categoryId || undefined };
    const productsByCategory = await getProducts(filters);
    setProducts((prev) => ({ ...prev, all: productsByCategory }));
  }, [categoryId]);

  const fetchCheapProducts = useCallback(async () => {
    const filters = { sort: 'asc', size: 6 };
    const cheapProducts = await getProducts(filters);
    setProducts((prev) => ({ ...prev, cheap: cheapProducts }));
  }, []);

  const fetchList20Products = useCallback(async () => {
    const filters = { size: 20 };
    const list20Products = await getProducts(filters);
    setProducts((prev) => ({ ...prev, list20: list20Products }));
  }, []);

  const fetchPhonesCheap = useCallback(async () => {
    const filters = { categoryId: 1, sort: 'asc', size: 6 };
    const phonesCheap = await getProducts(filters);
    setProducts((prev) => ({ ...prev, phonesCheap }));
  }, []);

  const fetchAccessoriesDiscount = useCallback(async () => {
    const filters = { categoryId: 4, sort: 'asc', size: 6 };
    const accessoriesDiscount = await getProducts(filters);
    setProducts((prev) => ({ ...prev, accessoriesDiscount }));
  }, []);

  // Gọi API khi danh mục thay đổi
  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  // Gọi các API khác khi component được render
  useEffect(() => {
    fetchCheapProducts();
    fetchList20Products();
    fetchPhonesCheap();
    fetchAccessoriesDiscount();
  }, [fetchCheapProducts, fetchList20Products, fetchPhonesCheap, fetchAccessoriesDiscount]);

  // Xử lý chọn danh mục
  const handleCategoryClick = (id) => {
    setCategoryId(id); // Cập nhật danh mục
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantity = 1) => {
    const userId = sessionStorage.getItem("userId"); // Lấy userId từ sessionStorage
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    
    try {
      const response = await axios.post('http://localhost:8080/api/cart/addToCart', null, {
        params: { userId, productId, quantity },
        withCredentials: true, // Đảm bảo gửi cookie session
      });

      // Lấy URL chuyển hướng từ response
      const redirectUrl = response.data.redirectUrl;

 
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  // Xử lý khi người dùng nhấn nút "Add to Cart"
  const handleAddToCart = (e) => {
    e.preventDefault();
    const productId = e.target.productId.value;
    const quantity = e.target.quantity.value;

    addToCart(productId, quantity); // Gọi hàm addToCart với tham số
  };

  // Thêm sản phẩm vào danh sách yêu thích
  const [isFavorited, setIsFavorited] = useState(false); // Trạng thái ban đầu là chưa yêu thích

  const addToWishlist = async (productId) => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('User not logged in');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/likes/add', null, {
        params: { productId },
        headers: {
          'Authorization': `Bearer ${username}`, // Gửi thông tin username trong header
        },
        withCredentials: true,
      });
      console.log('Sản phẩm đã được thêm vào danh sách yêu thích');
      setIsFavorited(true); // Cập nhật trạng thái sau khi thêm thành công
    } catch (error) {
      console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
    }
  };

  // Lấy sản phẩm yêu thích từ API
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('User not logged in');
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
          throw new Error('Failed to fetch liked products');
        }
        return response.json();
      })
      .then((data) => setLikedProducts(data))
      .catch((error) => console.error('Error fetching liked products:', error));
  }, []);

///thông báo
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const handlePurchase = () => {
    // Logic mua hàng
    setNotificationMessage('Đã thêm vào giỏ hàng');
    setNotificationType('success');
    setShowNotification(true);

    setTimeout(() => setShowNotification(false), 3000); // Ẩn sau 3 giây
  };

  const thich = () => {
    // Logic mua hàng
    setNotificationMessage('Đã thích sản phẩm');
    setNotificationType('success');
    setShowNotification(true);

    setTimeout(() => setShowNotification(false), 3000); // Ẩn sau 3 giây
  };

  const [hoverIndex, setHoverIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };


  return (
    <>
    
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar Section */}
            <div className="col-xs-12 col-sm-12 col-md-3 sidebar" style={{        width: '8%'}}>
              <SideMenu />
            
      {/* Thông báo */}
      <Notification
        message={notificationMessage}
        type={notificationType}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

            


            </div>

            <div className="col-xs-12 col-sm-12 col-md-9 homebanner-holder" style={{        width: '87%'}}>

      <div id="hero" style={{paddingTop:'16px'}}>
        <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
      
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper">
          <SwiperSlide
            className=" "
            style={{
              backgroundImage: "url(/assets/images/sliders/1.jpg)",
              height: "450px",
              width: "900px",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#ccc", // Fallback color
            }}
          >
            <div className="container-fluid">
              <div className="caption bg-color vertical-center text-left">
                {/* Nội dung caption nếu cần */}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide
            className="item"
            style={{
              backgroundImage: "url(/assets/images/sliders/2.jpg)",
              height: "450px",
              width: "900px",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#ccc", // Fallback color
            }}
          >
            <div className="container-fluid">
              <div className="caption bg-color vertical-center text-left">
                {/* Nội dung caption nếu cần */}
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>




              <div className="info-boxes wow fadeInUp">
                <div className="info-boxes-inner">
                  <div className="row">
                    <div className="col-md-6 col-sm-4 col-lg-4">
                      <div className="info-box">
                        <div className="row">
                          <div className="col-xs-12">
                            <h4 className="info-box-heading green">Hoàn tiền</h4>
                          </div>
                        </div>
                        <h6 className="text">Đảm bảo hoàn tiền trong 30 ngày</h6>
                      </div>
                    </div>

                    <div className="hidden-md col-sm-4 col-lg-4">
                      <div className="info-box">
                        <div className="row">
                          <div className="col-xs-12">
                            <h4 className="info-box-heading green">Miễn phí vận chuyển</h4>
                          </div>
                        </div>
                        <h6 className="text">Vận chuyển cho các đơn đặt hàng trên
                          1.000.000  VNĐ</h6>
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-4 col-lg-4">
                      <div className="info-box">
                        <div className="row">
                          <div className="col-xs-12">
                            <h4 className="info-box-heading green">Giảm giá đặc biệt</h4>
                          </div>
                        </div>
                        <h6 className="text">Giảm thêm 100.000 VNĐ cho tất cả các mặt hàng</h6>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div id="product-tabs-slider" className="scroll-tabs outer-top-vs wow fadeInUp">
                <div className="more-info-tab clearfix ">
                  <h3 className="new-product-title pull-left">Sản phẩm mới</h3>
                 
                  <ul className="nav nav-tabs nav-tab-line pull-right gap-3" id="new-products-1">
      <li
        className={`me-3 ${categoryId === null ? 'active' : ''}`}
        onClick={() => handleCategoryClick(null)}
        onMouseEnter={() => handleMouseEnter(1)}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          color: hoverIndex === 1 ? 'blue' : '#000', // Blue on hover, black by default
        }}
      >
        <span>Tất cả</span>
      </li>
      <li
        className={`me-3 ${categoryId === 1 ? 'active' : ''}`}
        onClick={() => handleCategoryClick(1)}
        onMouseEnter={() => handleMouseEnter(2)}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          color: hoverIndex === 2 ? 'red' : '#000', // Red on hover, black by default
        }}
      >
        <span>Điện thoại di động</span>
      </li>
      <li
        className={`me-3 ${categoryId === 2 ? 'active' : ''}`}
        onClick={() => handleCategoryClick(2)}
        onMouseEnter={() => handleMouseEnter(3)}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          color: hoverIndex === 3 ? 'purple' : '#000', // Purple on hover, black by default
        }}
      >
        <span>Laptop</span>
      </li>
      <li
        className={`me-3 ${categoryId === 3 ? 'active' : ''}`}
        onClick={() => handleCategoryClick(3)}
        onMouseEnter={() => handleMouseEnter(4)}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          color: hoverIndex === 4 ? 'yellow' : '#000', // Yellow on hover, black by default
        }}
      >
        <span>Máy tính bảng</span>
      </li>
      <li
        className={`${categoryId === 4 ? 'active' : ''}`}
        onClick={() => handleCategoryClick(4)}
        onMouseEnter={() => handleMouseEnter(5)}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          color: hoverIndex === 5 ? 'green' : '#000', // Green on hover, black by default
        }}
      >
        <span>Phụ kiện</span>
      </li>
    </ul>

                 
                </div>
                <div className="tab-content outer-top-xs">
      <div className="tab-pane in active" id="all">
        <div className="product-slider">
          <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper">
           {Array.isArray(products.all) && products.all.length > 0 ? (
  products.all.map((product) => {
    const firstImageUrl = product.productsImages && product.productsImages.length > 0
    ? `/assets/images/${product.productsImages[0].image.url}`
    : 'default-image.jpg';
  
    
                return (
                  <SwiperSlide className="col-12 col-sm-6 col-md-4 col-lg-12" key={product.id}>
                  <div className={`product ${likedProducts.some(like => like.product.id === product.id) ? 'liked' : ''}`} style={{
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                  }}>
                    <div className="product-image">
                      <div className="image">
                        <a href={`/product/${product.id}`}>
                          <img
                            src={firstImageUrl}
                            alt={product.name}
                            className="img-responsive"
                            style={{
                              transition: 'transform 0.3s ease-in-out',
                                   transform: 'translateX(-50%)'
                               
                            }}
                          />
                        </a>
                      </div>
                      <div className="tag new">
                        <span>new</span>
                      </div>
                    </div>
                
                    <div className="product-info text-left">
                      <h3 className="name">
                        <a href={`/product/${product.id}`}>{product.name}</a>
                      </h3>
                      <div className="rating rateit-small"></div>
                      <div className="description"></div>
                      <div className="product-price">
                        <span className="price">
                          {product.price.toLocaleString()} VND
                        </span>
                      </div>
                      <br />
                    </div>
                
                    <div className="cart clearfix animate-effect">
                      <div className="action">
                        <ul className="list-unstyled">
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                handlePurchase();
                                addToCart(product.id);
                              }}
                            >
                              <i className="fa fa-shopping-cart"></i>
                            </button>
                          </li>
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                addToWishlist(product.id);
                                thich();
                              }}
                              style={{
                                color: isFavorited ? 'red' : 'white', // Thay đổi màu biểu tượng trái tim
                              }}
                            >
                              <i className={`icon fa fa-heart ${isFavorited ? 'favorited' : ''}`}></i>
                            </button>
                          </li>
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => window.location.href = `/product/${product.id}`}
                            >
                              <i className="fa fa-signal" aria-hidden="true"></i>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                
                  <style jsx>{`
                    .product:hover {
                      transform: translateY(-10px);
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .product:hover .product-image img {
                      transform: scale(1.1);
                    }
                  `}</style>
                </SwiperSlide>
                
                );
              })
            ) : (
              <p></p>
            )}
          </Swiper>
        </div>
      </div>
    </div>
              </div>
              <div className="wide-banners wow fadeInUp outer-bottom-xs">
                <div className="row">
                  <div className="col-md-7 col-sm-6">
                    <div className="wide-banner cnt-strip">
                      <div className="image">
                        <img className="img-responsive" src="\assets\\images\banners\bannerdt4.webp"
                          alt="" />
                      </div>

                    </div>
                  </div>
                  <div className="col-md-5 col-sm-6">
                    <div className="wide-banner cnt-strip">
                      <div className="image">
                        <img className="img-responsive" src="\assets\\images\banners\bannerdt3.jpg"
                          alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section className="section featured-product wow fadeInUp">
                <h3 className="section-title">ĐIỆN THOẠI GIÁ RẺ</h3>
                <div className="product-slider">
          <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper">
           {Array.isArray(products.cheap) && products.cheap.length > 0 ? (
  products.phonesCheap.map((product) => {
    const firstImageUrl = product.productsImages && product.productsImages.length > 0
    ? `/assets/images/${product.productsImages[0].image.url}`
    : 'default-image.jpg';
  
    
                return (
                  <SwiperSlide className="col-12 col-sm-6 col-md-4 col-lg-12" key={product.id}>
                  <div className={`product ${likedProducts.some(like => like.product.id === product.id) ? 'liked' : ''}`} 
                       style={{
                         transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                       }}
                  >
                    <div className="product-image">
                      <div className="image">
                        <a href={`/product/${product.id}`}>
                          <img
                            style={{
                              transform: 'translateX(-50%)',
                              transition: 'transform 0.3s ease-in-out',
                            }}
                            src={firstImageUrl}
                            alt={product.name}
                            className="img-responsive"
                          />
                        </a>
                      </div>
                      <div className="tag new">
                        <span>new</span>
                      </div>
                    </div>
                
                    <div className="product-info text-left">
                      <h3 className="name">
                        <a href={`/product/${product.id}`}>{product.name}</a>
                      </h3>
                      <div className="rating rateit-small"></div>
                      <div className="description"></div>
                      <div className="product-price">
                        <span className="price">
                          {product.price.toLocaleString()} VND
                        </span>
                      </div>
                      <br />
                    </div>
                
                    <div className="cart clearfix animate-effect">
                      <div className="action">
                        <ul className="list-unstyled">
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                handlePurchase();
                                addToCart(product.id);
                              }}
                            >
                              <i className="fa fa-shopping-cart"></i>
                            </button>
                          </li>
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                addToWishlist(product.id);
                                thich();
                              }}
                              style={{
                                color: isFavorited ? 'red' : 'white',
                              }}
                            >
                              <i className={`icon fa fa-heart ${isFavorited ? 'favorited' : ''}`}></i>
                            </button>
                          </li>
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => window.location.href = `/product/${product.id}`}
                            >
                              <i className="fa fa-signal" aria-hidden="true"></i>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                
                  <style jsx>{`
                    .product:hover {
                      transform: translateY(-10px);
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .product:hover .product-image img {
                      transform: scale(1.1);
                    }
                  `}</style>
                </SwiperSlide>
                
                );
              })
            ) : (
              <p></p>
            )}
          </Swiper>
        </div>
              </section>
              <div className="wide-banners wow fadeInUp outer-bottom-xs">
                <div className="row">
                  <div className="col-md-12">
                    <div className="wide-banner cnt-strip">
                      <div className="image">
                        <img className="img-responsive" style={{width : "1500px",height:"391px"}} src="\assets\\images\banners\bannerdt2.jpg"
                          alt="" />
                      </div>
                     
                      <div className="new-label">
                        <div className="text">NEW</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="best-deal wow fadeInUp outer-bottom-xs">
                <h3 className="section-title">Phụ kiện tốt nhất</h3>
                <div className="product-slider">
            <div>
          <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper">
            {Array.isArray(products.accessoriesDiscount) && products.accessoriesDiscount.length > 0 ? (
  products.accessoriesDiscount.map((product) => {
    const firstImageUrl = product.productsImages && product.productsImages.length > 0
  ? `/assets/images/${product.productsImages[0].image.url}`
  : 'default-image.jpg';

    
                return (
                  <SwiperSlide className="col-12 col-sm-6 col-md-4 col-lg-12" key={product.id}>
                  <div className={`product ${likedProducts.some(like => like.product.id === product.id) ? 'liked' : ''}`} 
                       style={{
                         transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                       }}
                  >
                    <div className="product-image">
                      <div className="image">
                        <a href={`/product/${product.id}`}>
                          <img
                            src={firstImageUrl}
                            alt={product.name}
                            className="img-responsive"
                            style={{
                              transition: 'transform 0.3s ease-in-out',

                              transform: 'translateX(-50%)'

                            }}
                          />
                        </a>
                      </div>
                      <div className="tag new">
                        <span>new</span>
                      </div>
                    </div>
                
                    <div className="product-info text-left">
                      <h3 className="name">
                        <a href={`/product/${product.id}`}>{product.name}</a>
                      </h3>
                      <div className="rating rateit-small"></div>
                      <div className="description"></div>
                      <div className="product-price">
                        <span className="price">
                          {product.price.toLocaleString()} VND
                        </span>
                      </div>
                      <br />
                    </div>
                
                    <div className="cart clearfix animate-effect">
                      <div className="action">
                        <ul className="list-unstyled">
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                handlePurchase();
                                addToCart(product.id);
                              }}
                            >
                              <i className="fa fa-shopping-cart"></i>
                            </button>
                          </li>
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                addToWishlist(product.id);
                                thich();
                              }}
                              style={{
                                color: isFavorited ? 'red' : 'white',
                              }}
                            >
                              <i className={`icon fa fa-heart ${isFavorited ? 'favorited' : ''}`}></i>
                            </button>
                          </li>
                          <li className="add-cart-button btn-group">
                            <button
                              className="btn btn-primary"
                              onClick={() => window.location.href = `/product/${product.id}`}
                            >
                              <i className="fa fa-signal" aria-hidden="true"></i>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                
                  <style jsx>{`
                    .product:hover {
                      transform: translateY(-10px);
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .product:hover .product-image img {
                      transform: scale(1.1);
                    }
                  `}</style>
                </SwiperSlide>
                
                );
              })
            ) : (
              <p></p>
            )}
          </Swiper>
        </div>
              </div>
</div>
            

            </div>
          </div>
        </div>
    
    </>
  );

};

export default Index;