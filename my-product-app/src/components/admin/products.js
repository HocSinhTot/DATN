import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Popup from './Popup';  // Giả sử bạn đã có một component Popup
import Swal from 'sweetalert2';
const Management = () => {
  // State for product management
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Số sản phẩm mỗi trang
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [sortOrder, setSortOrder] = useState("asc"); // Mặc định là sắp xếp tăng dần
  const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);



  const openPopup = (message, onConfirm) => {
    setPopup({ show: true, message, onConfirm });
  };
  // Form data for Add/Edit Product
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    brand: "",
    category: "",
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchOptions = (method, body = null) => {
    const token = sessionStorage.getItem('token'); // Lấy token từ sessionStorage

    return {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Thêm header Authorization
      },
      body: body ? JSON.stringify(body) : null,
    };
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:8080/api/brands"),
          axios.get("http://localhost:8080/api/categories"),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching brands or categories:", error);
      }
    };
    fetchOptions();
  }, []);

  const fetchProducts = (page, size) => {
    fetch(`http://localhost:8080/api/admin/products?page=${page}&size=${size}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.content)) {
          setProductList(data.content);
          setTotalPages(data.totalPages);
        } else {
          console.error("API response does not contain a valid 'content' array.");
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi số sản phẩm mỗi trang
  };


  const handleDelete = (id) => {
    openPopup('Bạn có chắc chắn muốn xóa sản phẩm này không?', () => {
      fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              title: 'Thành công!',
              text: 'Sản phẩm đã được xóa thành công!',
              icon: 'success',
              confirmButtonText: 'OK',
              timer: 3000,
              timerProgressBar: true,
            });

            setProductList(productList.filter((product) => product.id !== id));
          }
        })
        .catch((error) => console.error('Error deleting product:', error))
        .finally(() => setPopup({ show: false, message: '', onConfirm: null }));
    });
  };



  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }
    fetch(`http://localhost:8080/api/admin/products/search?name=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setProductList(data))
      .catch((error) => console.error("Error searching products:", error));
  };

  const openAddPopup = () => {
    setIsEditMode(false);
    setIsPopupOpen(true);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      brand: "",
      category: "",
    });
    setErrors({});
  };

  const openEditPopup = (productId) => {
    axios
      .get(`http://localhost:8080/api/admin/products/${productId}`)
      .then((response) => {
        setFormData({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          quantity: response.data.quantity,
          brand: response.data.brand.id,
          category: response.data.category.id,
        });
        setCurrentProductId(productId);
        setIsEditMode(true);
        setIsPopupOpen(true);
        setErrors({});
      })
      .catch((error) => console.error("Error fetching product data:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    // Kiểm tra tên sản phẩm không có ký tự đặc biệt
    if (!formData.name.trim()) {
      validationErrors.name = "Tên sản phẩm không được để trống";
    } else if (/[^a-zA-Z0-9\s]/.test(formData.name)) { // Kiểm tra ký tự đặc biệt
      validationErrors.name = "Tên sản phẩm không được chứa ký tự đặc biệt";
    }

    // Kiểm tra giá sản phẩm
    const price = String(formData.price).trim(); // Đảm bảo giá là chuỗi
    if (!price || isNaN(price)) {
      validationErrors.price = "Giá sản phẩm phải là một số hợp lệ";
    } else if (Number(price) <= 0) {
      validationErrors.price = "Giá sản phẩm không được là số âm hoặc bằng 0";
    } else if (/[^0-9.]/.test(price)) {
      validationErrors.price = "Giá sản phẩm không được chứa ký tự chữ hoặc ký tự đặc biệt";
    }

    // Kiểm tra số lượng sản phẩm
    const quantity = String(formData.quantity).trim(); // Đảm bảo số lượng là chuỗi
    if (!quantity || isNaN(quantity)) {
      validationErrors.quantity = "Số lượng sản phẩm phải là một số hợp lệ";
    } else if (Number(quantity) <= 0) {
      validationErrors.quantity = "Số lượng sản phẩm không được là số âm hoặc bằng 0";
    } else if (/[^0-9]/.test(quantity)) {
      validationErrors.quantity = "Số lượng sản phẩm không được chứa chữ hoặc ký tự đặc biệt";
    }

    // Kiểm tra danh mục và thương hiệu
    const category = String(formData.category).trim(); // Đảm bảo category là chuỗi
    if (!category) {
      validationErrors.category = "Danh mục sản phẩm không được để trống";
    }

    const brand = String(formData.brand).trim(); // Đảm bảo brand là chuỗi
    if (!brand) {
      validationErrors.brand = "Thương hiệu sản phẩm không được để trống";
    }

    // Kiểm tra mô tả sản phẩm
    const description = String(formData.description).trim(); // Đảm bảo description là chuỗi
    if (!description) {
      validationErrors.description = "Mô tả sản phẩm không được để trống";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const productPayload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      brand: formData.brand,
      category: formData.category,
    };

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:8080/api/admin/products/${currentProductId}`
      : "http://localhost:8080/api/admin/products";

    try {
      const response = await axios({
        method,
        url,
        data: productPayload,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: 'Thành công!',
          text: isEditMode ? 'Sản phẩm đã được cập nhật thành công!' : 'Sản phẩm đã được thêm thành công!',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
        });

        setIsPopupOpen(false);
        fetchProducts(currentPage, pageSize);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        alert("Lỗi từ máy chủ: " + JSON.stringify(error.response.data));
      } else {
        console.error("Unexpected error:", error);
        alert("Lỗi bất ngờ xảy ra.");
      }
    }
  };




  const handleReset = () => {
    setSearchTerm(""); // Clear search input
    fetchProducts(currentPage, pageSize); // Reload product list without search filter
  };

  const sortProducts = (order) => {
    if (!Array.isArray(productList) || productList.length === 0) {
      console.error("productList is either not an array or is empty.");
      return [];
    }

    return [...productList].sort((a, b) => {
      const quantityA = a.quantity ?? 0;
      const quantityB = b.quantity ?? 0;

      return order === "asc" ? quantityA - quantityB : quantityB - quantityA;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedProducts = sortProducts(sortOrder);

  return (
    <>
      {/* Popup for Add / Edit Product */}
      {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px 40px",
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              width: "660px",
              maxWidth: "90%",
            }}
          >
            <h3
              style={{
                marginBottom: "25px",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              {isEditMode ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}
            </h3>
            <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                {/* Tên sản phẩm */}
                <div className="form-group">
                  <label htmlFor="name" style={{ fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      height: "40px",
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                      width: "100%",
                      transition: "border 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                    onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                    onMouseEnter={(e) => (e.target.style.boxShadow = "0 2px 8px rgba(0, 123, 255, 0.5)")}
                    onMouseLeave={(e) => (e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)")}
                  />
                  {errors.name && <div className="text-danger" style={{ fontSize: "14px" }}>{errors.name}</div>}
                </div>

                {/* Giá */}
                <div className="form-group">
                  <label htmlFor="price" style={{ fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
                    Giá
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    style={{
                      height: "40px",
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                      width: "100%",
                      transition: "border 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                    onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                  />
                  {errors.price && <div className="text-danger" style={{ fontSize: "14px" }}>{errors.price}</div>}
                </div>

                {/* Số lượng */}
                <div className="form-group">
                  <label htmlFor="quantity" style={{ fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
                    Số lượng
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    className="form-control"
                    value={formData.quantity}
                    onChange={handleChange}
                    style={{
                      height: "40px",
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                      width: "100%",
                      transition: "border 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                    onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                  />
                  {errors.quantity && <div className="text-danger" style={{ fontSize: "14px" }}>{errors.quantity}</div>}
                </div>

                {/* Danh mục */}
                <div className="form-group">
                  <label htmlFor="category" style={{ fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
                    Danh mục
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                    style={{
                      height: "40px",
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                      width: "100%",
                      transition: "border 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                    onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.category && <div className="text-danger" style={{ fontSize: "14px" }}>{errors.category}</div>}
                </div>

                {/* Thương hiệu */}
                <div className="form-group">
                  <label htmlFor="brand" style={{ fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
                    Thương hiệu
                  </label>
                  <select
                    id="brand"
                    name="brand"
                    className="form-control"
                    value={formData.brand}
                    onChange={handleChange}
                    style={{
                      height: "40px",
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                      width: "100%",
                      transition: "border 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                    onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                  {errors.brand && <div className="text-danger" style={{ fontSize: "14px" }}>{errors.brand}</div>}
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div className="form-group" style={{ marginTop: "20px" }}>
                <label htmlFor="description" style={{ fontWeight: "bold", marginBottom: "5px", color: "#333" }}>
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    marginBottom: "10px",
                    width: "100%",
                    height: "120px",
                    transition: "border 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                  onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                />
                {errors.description && <div className="text-danger" style={{ fontSize: "14px" }}>{errors.description}</div>}
              </div>

              {/* Button Submit & Close */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "16px", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer", boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)", transition: "all 0.3s ease" }}>
                  {isEditMode ? "Cập nhật" : "Thêm mới"}
                </button>

                <button className="btn btn-secondary" onClick={() => setIsPopupOpen(false)} style={{ padding: "10px 20px", fontSize: "16px", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer", boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)", transition: "all 0.3s ease" }}>
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="be-wrapper be-fixed-sidebar">
        {popup.show && (
          <Popup
            message={popup.message}
            onClose={() => setPopup({ show: false, message: '', onConfirm: null })}
            onConfirm={popup.onConfirm}
          />
        )}
        <div className="be-content">
          <div className="container-fluid">
            <div className="content">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý sản phẩm</h5>
                  <button className="btn btn-success mb-3" onClick={openAddPopup} style={{ marginTop: '18px', backgroundColor: '#28a745', color: '#fff', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)', transition: 'all 0.3s ease' }}>
                    <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
                  </button>
                </div>

                <div className="card-body">
                  <div className="d-flex" style={{ alignItems: "center", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        width: "300px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        transition: "border 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                      onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
                    />

                    <button onClick={handleSearch} className="btn btn-primary" style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)", transition: "all 0.3s ease" }}>
                      Tìm kiếm
                    </button>
                    <button onClick={() => handleReset()} className="btn btn-secondary" style={{ backgroundColor: "#6c757d", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", transition: "all 0.3s ease" }}>
                      Đặt lại
                    </button>

                    <div className="page-size" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={toggleSortOrder} style={{ backgroundColor: "#6c757d", color: "#fff", padding: "11px 23px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", transition: "all 0.3s ease" }}>
                        {sortOrder === "asc" ? "Sắp xếp từ thấp đến cao" : "Sắp xếp từ cao đến thấp"}
                      </button>

                      <label htmlFor="pageSize" style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                        Số sản phẩm mỗi trang:
                      </label>
                      <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ddd", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>

                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>STT</th>
                        <th style={{ textAlign: 'center' }}>Tên sản phẩm</th>
                        <th style={{ textAlign: 'center' }}>Giá</th>
                        <th style={{ textAlign: 'center' }}>Số lượng</th>
                        <th style={{ textAlign: 'center' }}>Danh mục</th>
                        <th style={{ textAlign: 'center' }}>Thương hiệu</th>
                        <th style={{ textAlign: 'center' }}>Mô tả</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(sortedProducts) && sortedProducts.length > 0 ? (
                        sortedProducts.map((product, index) => (
                          <tr key={product.id}>
                            <td style={{ width: "20px" }}>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td style={{ color: product.quantity < 20 ? "red" : "inherit", fontWeight: product.quantity < 20 ? "bold" : "normal" }}>
                              {product.quantity}
                            </td>
                            <td>{product.category ? product.category.name : "N/A"}</td>
                            <td>{product.brand ? product.brand.name : "N/A"}</td>
                            <td>{product.description}</td>
                            <td>
                              <button onClick={() => openEditPopup(product.id)} style={{ backgroundColor: '#ffc107', color: '#fff', padding: '12px 30px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(255, 193, 7, 0.3)', transition: 'all 0.3s ease' }}>
                                <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                              </button>
                              <button onClick={() => handleDelete(product.id)} style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: '#fff', padding: '12px 30px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)', transition: 'all 0.3s ease' }}>
                                <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center" }}>Không có sản phẩm nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="pagination" style={{ width: "100%", justifyContent: "center", paddingRight: "70px" }}>
                    <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)} style={{ backgroundColor: '#007bff', color: '#fff', padding: '12px 30px', borderRadius: '10px', border: 'none', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)', transition: 'all 0.3s ease', opacity: currentPage === 0 ? '0.5' : '1' }}>
                      <i class="bi bi-caret-left-square-fill"></i>
                    </button>

                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', textAlign: 'center', margin: '0 15px', padding: '8px 15px', borderRadius: '10px', backgroundColor: '#f0f0f0', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', display: 'inline-block', minWidth: '80px' }}>
                      {currentPage + 1} / {totalPages}
                    </span>

                    <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)} style={{ backgroundColor: '#007bff', color: '#fff', padding: '12px 30px', borderRadius: '10px', border: 'none', width: '106px', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)', transition: 'all 0.3s ease', opacity: currentPage === totalPages - 1 ? '0.5' : '1' }}>
                      <i class="bi bi-caret-right-square-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Management;