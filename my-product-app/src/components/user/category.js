import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Notification from './Notification';

const Category = ({ keyword, categoryId: headerCategoryId, setCategoryId }) => {
  const [products, setProducts] = useState([]); // Danh sách tất cả sản phẩm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [categoryId, setCategoryIdLocal] = useState(headerCategoryId); // Danh mục trong trang, mặc định là giá trị từ Header
  const itemsPerPage = 16; // 4 hàng x 4 sản phẩm
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sort, setSort] = useState(null);
  const [pageSize, setPageSize] = useState(100); // Mặc định là 20 sản phẩm mỗi trang
  const [brands, setBrands] = useState([]); // Danh sách thương hiệu
  const [selectedBrand, setSelectedBrand] = useState(''); // Thương hiệu được chọn
  const [likedProducts, setLikedProducts] = useState([]); // Giả sử bạn đã có danh sách sản phẩm yêu thích của người dùng

  const navigate = useNavigate();
  const location = useLocation();
  // Lấy danh sách thương hiệu từ API
  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thương hiệu:', error);
    }
  };

  // Hàm gọi API lấy sản phẩm
  const getProducts = async (filters = {}) => {
    try {
      const response = await axios.get('http://localhost:8080/api/products', {
        params: {
          size: pageSize, // Kích thước trang (số sản phẩm mỗi trang)
          page: currentPage - 1, // API yêu cầu trang bắt đầu từ 0
          ...filters, // Thêm các tham số bộ lọc
        },
      });

      setTotalPages(Math.ceil(response.data.length / itemsPerPage)); // Dùng `totalCount` thay vì `length`
      setProducts(response.data); // Cập nhật danh sách sản phẩm
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setProducts([]); // Trả về danh sách sản phẩm rỗng nếu có lỗi
    }
  };


  // Hàm áp dụng các bộ lọc và gọi lại API
  const applyFilters = () => {
    const filters = {};
    const currentCategoryId = categoryId || headerCategoryId; // Nếu không có categoryId trong trang thì sử dụng categoryId từ Header
    if (currentCategoryId !== null) filters.categoryId = currentCategoryId;
    if (minPrice !== null) filters.minPrice = minPrice;
    if (maxPrice !== null) filters.maxPrice = maxPrice;
    if (keyword !== '') filters.keyword = keyword;
    if (selectedBrand !== '') filters.brandId = selectedBrand;
    if (sort !== null) filters.sort = sort;

    console.log("Đang áp dụng bộ lọc: ", filters); // Kiểm tra các bộ lọc đang được áp dụng
    getProducts(filters); // Gọi API để lấy sản phẩm với các bộ lọc
  };

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    console.log("Đang gọi lại API với các bộ lọc", {
      categoryId,
      minPrice,
      maxPrice,
      keyword,
      sort,
      selectedBrand,
      pageSize,
      currentPage
    });
    applyFilters(); // Gọi API để lấy sản phẩm mới
    fetchBrands(); // Lấy danh sách thương hiệu
  }, [categoryId, minPrice, maxPrice, keyword, sort, selectedBrand, pageSize, currentPage]);

  // Chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
    console.log("Chuyển trang sang:", page);  // Kiểm tra xem có vào được không
    applyFilters(); // Gọi lại hàm applyFilters để lấy sản phẩm mới từ API
  };

  // Lấy sản phẩm của trang hiện tại

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

  const handleCategoryClick = (id) => {
    setCategoryIdLocal(id); // Cập nhật danh mục riêng trong trang
    setCategoryId(id); // Cập nhật danh mục trong Header nếu cần
  };
  // Thêm sản phẩm vào danh sách yêu thích

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



  return (
    <div className="body-content outer-top-xs">
      <div
        style={{
          width: '100%',
          maxWidth: '1400px', // Tùy chỉnh chiều rộng tối đa nếu cần
          margin: '0 auto', // Căn giữa
          paddingLeft: '15px', // Khoảng cách bên trái
          paddingRight: '15px', // Khoảng cách bên phải
        }}
      >


        <div className="row">

          <div
            className="col-md-12"
            style={{
              width: '100%', // Đảm bảo chiều rộng của div chiếm toàn bộ chiều rộng
              maxWidth: '1500px', // Bạn có thể thay đổi maxWidth theo ý muốn
              margin: '0 auto', // Căn giữa phần tử
            }}










          >
            <div id="category" className="category-carousel hidden-xs">
              <div className="item">
                <div className="image" style={{ height: "100%" }}>
                  <img
                    src="assets/images/banners/cmm.webp"
                    alt=""
                    className="img-responsive"
                  />
                </div>
              </div>
            </div>
            <div
              className="clearfix filters-container"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f1f1f1',
                borderRadius: '8px',
              }}
            >
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                  Danh mục
                </label>
                <select
                  className="form-control"
                  value={categoryId || ''}
                  onChange={(e) => handleCategoryClick(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', width: '100%' }}
                >
                  <option value="">Tất cả</option>
                  <option value="1">Điện thoại di động</option>
                  <option value="2">Laptop</option>
                  <option value="3">Máy tính bảng</option>
                  <option value="4">Phụ kiện</option>
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                  Thương hiệu
                </label>
                <select
                  className="form-control"
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', width: '100%' }}
                >
                  <option value="">Tất cả</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Thông báo */}
              <Notification
                message={notificationMessage}
                type={notificationType}
                show={showNotification}
                onClose={() => setShowNotification(false)}
              />

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                  Giá
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Thấp nhất"
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ flex: '1', padding: '8px', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Cao nhất"
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ flex: '1', padding: '8px', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                  Sắp xếp
                </label>
                <select
                  className="form-control"
                  onChange={(e) => setSort(e.target.value)}
                  style={{ padding: '8px', borderRadius: '4px', width: '100%' }}
                >
                  <option value="">Sắp xếp theo</option>
                  <option value="asc">Giá thấp đến cao</option>
                  <option value="desc">Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            <div className="search-result-container">
              <div id="myTabContent" className="tab-content category-list">
                <div className="tab-pane active" id="grid-container">
                  <div className="category-product">
                    <div className="row">
                      <div className="product-list row">
                        {currentProducts.length > 0 ? (
                          currentProducts.map((product) => {
                            const firstImageUrl =
                              product.productsImages.length > 0
                                ? `/assets/images/${product.productsImages[0].image.url}`
                                : 'default-image.jpg';

                            return (
                              <div className="col-md-3 product" key={product.id} style={{
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                              }}>
                                <div className={`product ${likedProducts.some(like => like.product.id === product.id) ? 'liked' : ''}`}
                                  style={{
                                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <div className="product-image">
                                    <div className="image">
                                      <a href={`/product/${product.id}`}>
                                        <img
                                          src={firstImageUrl}
                                          alt={product.name}
                                          className="card-img-top img-responsive"
                                          style={{
                                            transition: 'transform 0.3s ease-in-out',
                                            transform: 'translateX(-50%)'
                                          }}
                                        />
                                      </a>
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
                                  </div>

                                  <div className="cart clearfix animate-effect">
                                    <div className="action">
                                      <ul className="list-unstyled">
                                        <li className="add-cart-button btn-group">
                                          <button
                                            className="btn btn-primary"
                                            onClick={() => { handlePurchase(); addToCart(product.id); }}
                                          >
                                            <i className="fa fa-shopping-cart"></i>
                                          </button>
                                        </li>
                                        <li className="add-cart-button btn-group">
                                          <button
                                            className="btn btn-primary"
                                            onClick={() => { addToWishlist(product.id); thich(); }}
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
                                  <hr />
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
                              </div>

                            );
                          })
                        ) : (
                          <p className="text-center">Không có sản phẩm nào.</p>
                        )}
                      </div>
                      <div className="row justify-content-center mt-4">
                        <nav>
                          <div className="lbl-cnt d-flex justify-content-center align-items-center" style={{ textAlign: 'center' }}>

                            <div className="pagination-container">
                              <ul className="pagination justify-content-center"> {/* Added justify-content-center here */}
                                {
                                  totalPages > 0 ? (
                                    [...Array(totalPages)].map((_, index) => (
                                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button style={{
                                          height: '40px',
                                          width: '40px'
                                        }} className="page-link" onClick={() => handlePageChange(index + 1)}>
                                          {index + 1}
                                        </button>
                                      </li>
                                    ))
                                  ) : (
                                    <li><span className="page-link">Không có trang nào</span></li> // Thêm thông báo nếu không có trang
                                  )
                                }
                              </ul>
                            </div>
                          </div>
                        </nav>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Category; 