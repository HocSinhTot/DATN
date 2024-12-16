import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [priceId, setPriceId] = useState(null); // Thêm priceId vào state
  const [colors, setColors] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [price, setPrice] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]); // Dữ liệu sản phẩm tương tự
  const [activeTab, setActiveTab] = useState('description'); // Quản lý tab hiện tại
  const [quantity, setQuantity] = useState(1);

  // Chuyển đổi tab khi người dùng click vào
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  useEffect(() => {
    if (id) {
      // Gọi API để lấy thông tin sản phẩm theo ID
      axios
        .get(`http://localhost:8080/api/product/${id}`)
        .then((response) => {
          const data = response.data;
          setProduct(data);

          // Lấy tất cả hình ảnh từ sản phẩm
          const images = data.images;
          setFilteredImages(images);

          // Đặt ảnh đầu tiên làm ảnh lớn ban đầu
          if (images.length > 0) {
            setCurrentImage(images[0].url);
          }
        })
        .catch((error) => {
          console.error("Error fetching product data", error);
        });
    }


    // Gọi API để lấy dung lượng
    axios
      .get(`http://localhost:8080/api/product/${id}/capacities`)
      .then((response) => {
        const data = response.data;
        setCapacities(data);

        // Chọn dung lượng đầu tiên làm mặc định
        if (data.length > 0) {
          setSelectedCapacity(data[0].capacityId);
          setPrice(data[0].price);
        }
      })
      .catch((error) => console.error("Error fetching capacities data", error));

    axios
      .get(`http://localhost:8080/api/product/${id}/colors`)
      .then((response) => {
        const data = response.data;
        setColors(data);

        // Chọn dung lượng đầu tiên làm mặc định
        if (data.length > 0) {
          setSelectedColor(data[0].colorId);
        }
      })
      .catch((error) => console.error("Error fetching colors data", error));

    // Gọi API để lấy sản phẩm tương tự
    axios
      .get(`http://localhost:8080/api/product/${id}/similar`)
      .then((response) => {
        setSimilarProducts(response.data); // Giả sử API trả về danh sách sản phẩm tương tự
        console.log(response.data); // In dữ liệu thay vì sử dụng similarProducts
      })
      .catch((error) => console.error("Error fetching similar products", error));
  }, [id]);

  const handleColorChange = (color) => {
    setSelectedColor(color);


  };
  const navigate = useNavigate();  // Use useNavigate instead of useHistory

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const stockResponse = await axios.get(`http://localhost:8080/api/product/checkStock/${product.id}`);
    const stockQuantity = stockResponse.data.stockQuantity;

    if (quantity <= 0 || quantity > stockQuantity) {
      alert("Số lượng không hợp lệ.");
      return;
    }
    const userId = sessionStorage.getItem("userId"); // Lấy userId từ sessionStorage

    if (!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      const encodedColorName = encodeURIComponent(selectedColor?.colorName); // Mã hóa tên màu
      const response = await axios.post(

        "http://localhost:8080/api/cart/addToCart",
        null,
        {
          params: {
            userId,  // Truyền userId vào yêu cầu
            productId: product.id,
            quantity,
            colorId: selectedColor?.colorId,
            capacity: selectedCapacity,
            priceId,
          },

          withCredentials: true,
        }

      );
      const redirectUrl = response.data.redirectUrl;
      if (redirectUrl) navigate(redirectUrl);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const handleCapacityChange = (capacityId) => {
    const selected = capacities.find((item) => item.capacityId === capacityId);
    if (selected) {
      setSelectedCapacity(capacityId);
      setPrice(selected.price);
      setPriceId(selected.priceId);
    }
  };

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl); // Cập nhật ảnh lớn
  };

  if (!product) {
    return <p>Đang tải dữ liệu sản phẩm...</p>;
  }


  return (
    <div className="body-content outer-top-xs">
      <div className style={{ justifyContent: 'center', display: 'flex', paddingBottom: '20px' }} >
        <div className="row single-product">

          <div style={{ width: '1400px' }}>

            <div className="col-md-3 sidebar" style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div className="sidebar-module-container">
                <div className="sidebar-widget">
                  <h3 className="section-title" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                    Sản phẩm tương tự
                  </h3>
                  <Swiper
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                    style={{ marginTop: '10px' }}
                  >
                    {similarProducts.length > 0 ? (
                      similarProducts.map((product) => {
                        const firstImageUrl = product.productsImages?.length > 0
                          ? `/assets/images/${product.productsImages[0].image.url}`
                          : (product.images?.length > 0
                            ? `/assets/images/${product.images[0].url}`
                            : 'default-image.jpg');

                        return (
                          <SwiperSlide key={product.id} className="item" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="products special-product" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#fff', transition: 'transform 0.3s ease' }}>
                              <div className="product">
                                <div className="product-micro">
                                  <div className="row product-micro-row">
                                    <div className="col col-xs-12" style={{ textAlign: 'center' }}>
                                      <div className="product-image">
                                        <div className="image">
                                          <a href={`/product/${product.id}`}>
                                            <img
                                              src={firstImageUrl}
                                              alt={product.name}
                                              className="img-responsive"
                                              style={{ width: '100%', height: 'auto', borderRadius: '5px', objectFit: 'cover' }}
                                            />
                                          </a>
                                        </div>
                                      </div>
                                      <div className="product-info" style={{ marginTop: '10px' }}>
                                        <h3 className="name" style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
                                          <a href={`/product/${product.id}`}>
                                            {product.name}
                                          </a>
                                        </h3>
                                        <div className="product-price">
                                          <span className="price" style={{ fontSize: '18px', color: '#ff6f61', fontWeight: '700' }}>
                                            {product.price.toLocaleString()} VND
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })
                    ) : (
                      <p style={{ textAlign: 'center', color: '#888' }}>Không có sản phẩm nào.</p>
                    )}
                  </Swiper>
                </div>
              </div>
            </div>


            <div className="detail-block">
              <div className="row wow fadeInUp">
                {/* Product Gallery */}
                <div className="col-xs-12 col-sm-6 col-md-5 gallery-holder">
                  <div className="product-item-holder size-big single-product-gallery small-gallery">
                    <div className="image">
                      {/* Hiển thị ảnh lớn dựa trên trạng thái */}
                      {currentImage && (
                        <img
                          src={`/assets/images/${currentImage}`}
                          className="img-responsive"
                          alt="Product Image"
                        />
                      )}
                    </div>
                  </div>
                  <div className="single-product-gallery-thumbs gallery-thumbs">
                    <Swiper
                      slidesPerView={4}
                      spaceBetween={0}
                      loop={true}
                      modules={[Pagination, Navigation]}
                      className="mySwiper"
                    >
                      {filteredImages.map((image, index) => (
                        <SwiperSlide className="item" key={index}>
                          <a
                            className={`horizontal-thumb ${currentImage === image?.url ? "active" : ""
                              }`}
                            href={`#slide${index + 1}`}
                            data-slide={index + 1}
                            onClick={(e) => {
                              e.preventDefault(); // Ngăn chuyển hướng
                              handleImageClick(image?.url); // Cập nhật ảnh lớn
                            }}
                          >
                            <img
                              className="img-responsive"
                              width="85"
                              alt={`Product Image ${index + 1}`}
                              src={`/assets/images/${image?.url || "default.jpg"}`}
                            />
                          </a>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>

                {/* Product Info */}
                <div className="col-sm-6 col-md-7 product-info-block">
                  <div className="product-info">
                    <h1 className="name">{product.name}</h1>
                    <div className="description-container m-t-20">
                      <span>{product.description}</span>
                      <div class="stock-container info-container m-t-10">
                        <div class="row">
                          <div class="col-sm-2">
                            <div class="stock-box">
                              <span class="label">Kho :</span>
                            </div>
                          </div>
                          <div class="col-sm-9">
                            <div class="stock-box">
                              <span class="value" >{product.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form onSubmit={handleAddToCart}>
                      <input type="hidden" name="productId" value={product.id} />

                      {/* Color Options */}
                      <div className="color-options m-t-20">
                        <h4>Chọn màu:</h4>
                        <div style={{ display: "flex", gap: "10px" }}>
                          {colors.map((color) => (
                            <i
                              key={color.colorId}
                              style={{
                                padding: "5px 10px",
                                backgroundColor: color.colorName.toLowerCase(),
                                border: selectedColor === color ? "2px solid black" : "1px solid #ddd",
                                color: "#black",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                              onClick={() => handleColorChange(color)}
                            >
                              {color.colorName}
                            </i>
                          ))}
                        </div>
                      </div>
                      <div className="capacity-options m-t-20">
                        <h4>Chọn dung lượng:</h4>
                        <div style={{ display: "flex", gap: "10px" }}>
                          {capacities.map((item) => (
                            <i
                              key={item.capacityId}
                              style={{
                                padding: "5px 10px",
                                border:
                                  selectedCapacity === item.capacityId
                                    ? "2px solid black"
                                    : "1px solid #9999",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                              onClick={() => handleCapacityChange(item.capacityId)}
                            >

                              {item.capacityName}
                            </i>
                          ))}
                        </div>
                      </div>
                      {/* Price and Cart */}
                      <div className="price-container info-container m-t-20">
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="price-box">
                              <span className="price"> {formatCurrencyVND(price)}</span>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div class="favorite-button m-t-10">
                              <a class="btn btn-primary" data-toggle="tooltip" data-placement="right" title="Wishlist" href="#">
                                <i class="fa fa-heart"></i>
                              </a>

                            </div>
                          </div>

                        </div>

                      </div>
                      <div class="quantity-container info-container">
                        <div class="row">
                          <div class="col-sm-2">
                            <span class="label">Số lượng :</span>
                          </div>
                          <div class="col-sm-2">
                            <div className="form-group">

                              <input style={{ width: '60px' }}
                                type="number"
                                name="quantity"
                                className="form-control"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                          <div class="col-sm-4">
                            <button type="submit" className="btn btn-primary">Thêm vào giỏ hàng</button>

                          </div>

                        </div>


                      </div>
                    </form>

                  </div>

                </div>
                {/* End Product Info */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductDetail;
