import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
const addToWishlist = async (productId) => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/likes/add', null, {
        params: { productId },
        headers: {
          'Authorization': `Bearer ${username}`, // Gửi thông tin username trong header
        },
        withCredentials: true,
      });
      console.log('Sản phẩm đã được thêm vào danh sách yêu thích');
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

    return (

        <div class="body-content outer-top-xs">
            <div class='container'>
                <div class='row'>
                    <div class='col-md-3 sidebar'>
                        <div class="sidebar-module-container">
                            <div class="sidebar-filter">

                                <div class="sidebar-widget wow fadeInUp">
                                    <div class="head">
                                        <h4 class="widget-title">Danh mục</h4>
                                    </div>
                                    <div class="sidebar-widget-body">
                                        <ul className="list" id="new-products-1">
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
                                </div>


                            </div>


                        </div>
                    </div>
                    <div class='col-md-9'>
                        <div id="category" class="category-carousel hidden-xs">
                            <div class="item">
                                <div class="image"> <img src="assets\images\banners\cat-banner-1.jpg" alt="" class="img-responsive" /> </div>
                                <div class="container-fluid">

                                </div>
                            </div>
                        </div>
                        <div class="clearfix filters-container m-t-10">
                            <div class="row">
                                <div class="col col-sm-8 col-md-4">
                                    <div class="filter-tabs">
                                        <label class="lbl">Thương hiệu</label>
                                        <select
                                            className="form-control"
                                            onChange={(e) => setSelectedBrand(e.target.value)}
                                        >
                                            <option value="">Tất cả</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div class="col col-sm-12 col-md-4">
                                    <div class="lbl-cnt"> <span class="lbl">Giá</span>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Giá thấp nhất"
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Giá cao nhất"
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>



                                <div class="col col-sm-12 col-md-2">
                                    <div class="lbl-cnt"> <span class="lbl">Sắp xếp</span>
                                        <div class="fld inline">
                                            <div class="dropdown dropdown-small dropdown-med dropdown-white inline">

                                                <select
                                                    className="form-control"
                                                    onChange={(e) => setSort(e.target.value)}
                                                >
                                                    <option value="">Sắp xếp theo</option>
                                                    <option value="asc">Giá thấp đến cao</option>
                                                    <option value="desc">Giá cao đến thấp</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col col-sm-3 col-md-2">
                                    <div className="lbl-cnt">
                                        <span className="lbl">Hiển thị trang</span>
                                        <div className="pagination-container">
                                            <ul className="pagination">
                                                {
                                                    totalPages > 0 ? (
                                                        [...Array(totalPages)].map((_, index) => (
                                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
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
                                </div>

                                <div class="col col-sm-6 col-md-4 text-right">

                                </div>
                            </div>
                        </div>

                        <div class="search-result-container ">
                            <div id="myTabContent" class="tab-content category-list">
                                <div class="tab-pane active " id="grid-container">
                                    <div class="category-product">
                                        <div class="row">
                                            <div className="product-list row">
                                                {currentProducts.length > 0 ? (
                                                    currentProducts.map((product) => {
                                                        const firstImageUrl =
                                                            product.productsImages.length > 0
                                                                ? `/assets/images/${product.productsImages[0].image.url}`
                                                                : 'default-image.jpg';

                                                        return (
                                                            <div className="col-md-3 product" key={product.id}>
<div className={`product ${likedProducts.some(like => like.product.id === product.id) ? 'liked' : ''}`}>    

                                                                <div class="product-image">
                                                                    <div class="image">  <a href={`/product/${product.id}`}>
                                                                        <img
                                                                            src={firstImageUrl}
                                                                            alt={product.name}
                                                                            className="card-img-top img-responsive"
                                                                        />
                                                                    </a> </div>

                                                                </div>

                                                                <div class="product-info text-left">
                                                                    <h3 class="name"><a href={`/product/${product.id}`}>{product.name}</a></h3>
                                                                    <div class="rating rateit-small"></div>
                                                                    <div class="description"></div>
                                                                    <div class="product-price"> <span class="price">{product.price.toLocaleString()} VND </span> </div>

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
                                                                            <li className="add-cart-button btn-group">
                                                                                <button
                                                                                    className="btn btn-primary"
                                                                                    onClick={() => addToWishlist(product.id)}
                                                                                >
                                                                                    <i className="icon fa fa-heart"></i>
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
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-center">Không có sản phẩm nào.</p>
                                                )}
                                            </div>

                                            <div className="row justify-content-center mt-4">
                                                <nav>

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