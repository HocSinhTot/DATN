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

const Index = () => {
  const [products, setProducts] = useState({
    all: [],
    cheap: [],
    list20: [],
    phonesCheap: [],
    accessoriesDiscount: [],
  });

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
    try {
      const response = await axios.post('http://localhost:8080/api/cart/addToCart', null, {
        params: { userId, productId, quantity },
        withCredentials: true, // Đảm bảo gửi cookie session
      });

      // Lấy URL chuyển hướng từ response
      const redirectUrl = response.data.redirectUrl;

      // Nếu có URL chuyển hướng, điều hướng người dùng đến trang giỏ hàng
      if (redirectUrl) {
        navigate(redirectUrl);  // Dùng navigate thay vì history.push
      }
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

  const options = {
    loop: true,
    margin: 10,
    items: 1, // Chỉ 1 item mỗi lần hiển thị
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
  };

  const optionsProduct = {
    loop: true,
    margin: 10,
    nav: true,
    items: 4,
    dots: false,
    autoplay: false,
    navText: ['<', '>'],
  };

  const addToWishlist = async (productId) => {
    try {
        const response = await axios.post('http://localhost:8080/api/likes/add', null, {
            params: { productId },
            withCredentials: true,
        });
        console.log('Sản phẩm đã được thêm vào danh sách yêu thích');
    } catch (error) {
        console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
    }
};

    
  return (
    <>
    
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar Section */}
            <div className="col-xs-12 col-sm-12 col-md-3 sidebar" style={{        width: '8%'}}>
              <SideMenu />
            

            


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
  <li className={`me-3 ${categoryId === null ? 'active' : ''}`} onClick={() => handleCategoryClick(null)}>
    <span>Tất cả</span>
  </li>
  <li className={`me-3 ${categoryId === 1 ? 'active' : ''}`} onClick={() => handleCategoryClick(1)}>
    <span>Điện thoại di động</span>
  </li>
  <li className={`me-3 ${categoryId === 2 ? 'active' : ''}`} onClick={() => handleCategoryClick(2)}>
    <span>Laptop</span>
  </li>
  <li className={`me-3 ${categoryId === 3 ? 'active' : ''}`} onClick={() => handleCategoryClick(3)}>
    <span>Máy tính bảng</span>
  </li>
  <li className={categoryId === 4 ? 'active' : ''} onClick={() => handleCategoryClick(4)}>
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
                    <div className="product">
                      <div className="product-image">
                        <div className="image">
                          <a href={`/product/${product.id}`}>
                            <img
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
                        <br/>
                      </div>

                      <div className="cart clearfix animate-effect">
                                                                    <div className="action">
                                                                        <ul className="list-unstyled">
                                                                            <li className="add-cart-button btn-group">

                                                                                <button
                                                                                    className="btn btn-primary"
                                                                                    onClick={() => addToCart(product.id)}
                                                                                >
                                                                                    <i className="fa fa-shopping-cart"></i>
                                                                                </button>

                                                                            </li>
                                                                            <li className="lnk wishlist">
                                                            <a
                                                                data-toggle="tooltip"
                                                                className="add-to-cart"
                                                                href="#"
                                                                onClick={() => addToWishlist(product.id)}
                                                                title="Wishlist"
                                                            >
                                                                <i className="icon fa fa-heart"></i>
                                                            </a>
                                                        </li>
                                                                            <li className="lnk">
                                                                                <a
                                                                                    data-toggle="tooltip"
                                                                                    className="add-to-cart"
                                                                                    href={`/product/${product.id}`}
                                                                                    title="Compare"
                                                                                >
                                                                                    <i className="fa fa-signal" aria-hidden="true"></i>
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                    </div>
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
  products.cheap.map((product) => {
    const firstImageUrl = product.productsImages && product.productsImages.length > 0
    ? `/assets/images/${product.productsImages[0].image.url}`
    : 'default-image.jpg';
  
    
                return (
                  <SwiperSlide className="col-12 col-sm-6 col-md-4 col-lg-12" key={product.id}>
                    <div className="product">
                      <div className="product-image">
                        <div className="image">
                          <a href={`/product/${product.id}`}>
                            <img
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
                        <br/>
                      </div>

                      <div className="cart clearfix animate-effect">
                                                                    <div className="action">
                                                                        <ul className="list-unstyled">
                                                                            <li className="add-cart-button btn-group">

                                                                                <button
                                                                                    className="btn btn-primary"
                                                                                    onClick={() => addToCart(product.id)}
                                                                                >
                                                                                    <i className="fa fa-shopping-cart"></i>
                                                                                </button>

                                                                            </li>
                                                                            <li className="lnk wishlist">
                                                                                <a
                                                                                    data-toggle="tooltip"
                                                                                    className="add-to-cart"
                                                                                    href={`/addlike/${product.id}`}
                                                                                    title="Wishlist"
                                                                                >
                                                                                    <i className="icon fa fa-heart"></i>
                                                                                </a>
                                                                            </li>
                                                                            <li className="lnk">
                                                                                <a
                                                                                    data-toggle="tooltip"
                                                                                    className="add-to-cart"
                                                                                    href={`/product/${product.id}`}
                                                                                    title="Compare"
                                                                                >
                                                                                    <i className="fa fa-signal" aria-hidden="true"></i>
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                    </div>
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
                    <div className="product">
                      <div className="product-image">
                        <div className="image">
                          <a href={`/product/${product.id}`}>
                            <img
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
                        <br/>
                      </div>

                      <div className="cart clearfix animate-effect">
                                                                    <div className="action">
                                                                        <ul className="list-unstyled">
                                                                            <li className="add-cart-button btn-group">

                                                                                <button
                                                                                    className="btn btn-primary"
                                                                                    onClick={() => addToCart(product.id)}
                                                                                >
                                                                                    <i className="fa fa-shopping-cart"></i>
                                                                                </button>

                                                                            </li>
                                                                            <li className="lnk wishlist">
                                                                                <a
                                                                                    data-toggle="tooltip"
                                                                                    className="add-to-cart"
                                                                                    href={`/addlike/${product.id}`}
                                                                                    title="Wishlist"
                                                                                >
                                                                                    <i className="icon fa fa-heart"></i>
                                                                                </a>
                                                                            </li>
                                                                            <li className="lnk">
                                                                                <a
                                                                                    data-toggle="tooltip"
                                                                                    className="add-to-cart"
                                                                                    href={`/product/${product.id}`}
                                                                                    title="Compare"
                                                                                >
                                                                                    <i className="fa fa-signal" aria-hidden="true"></i>
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                    </div>
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