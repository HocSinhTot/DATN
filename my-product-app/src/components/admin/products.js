import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Popup from './Popup';
const Management = () => {
  // State for product management
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Số sản phẩm mỗi trang
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang


  // State for user management
  const [userList, setUserList] = useState([]);
  const [popup, setPopup] = useState({ show: false, type: "", productId: null });

  // State for form data (Add Product / Edit Product)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    brand: '',
    category: '',
  });

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch product data
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    // Fetch brand and category options
    const fetchOptions = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:8080/api/brands'),
          axios.get('http://localhost:8080/api/categories'),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching brands or categories:', error);
      }
    };
    fetchOptions();
  }, []);

  const fetchProducts = (page, size) => {
    fetch(`http://localhost:8080/api/admin/products?page=${page}&size=${size}`)
      .then(response => response.json())
      .then(data => {
        setProductList(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi số sản phẩm mỗi trang
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("Product deleted successfully!");
            setProductList(productList.filter((product) => product.id !== id));
          }
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm!');
      return;
    }
    fetch(`http://localhost:8080/api/admin/products/search?name=${searchTerm}`)
      .then(response => response.json())
      .then(data => setProductList(data))
      .catch(error => console.error('Error searching products:', error));
  };

  const openPopup = (type, productId = null) => {
    setPopup({ show: true, type, productId });
    if (type === 'edit' && productId) {
      // Fetch the product details for editing
      axios.get(`http://localhost:8080/api/admin/products/${productId}`)
        .then(response => {
          setFormData({
            ...response.data,
            brand: response.data.brand.id,
            category: response.data.category.id
          });
        })
        .catch(error => console.error("Error fetching product data:", error));
    } else {
      setFormData({ name: '', description: '', price: '', quantity: '', brand: '', category: '' });
    }
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

    try {
      const formDataToSend = new FormData();
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        quantity: formData.quantity,
        brand: formData.brand,
        category: formData.category,
      };

      formDataToSend.append('product', JSON.stringify(productPayload));

      const url = popup.type === 'edit'
        ? `http://localhost:8080/api/admin/products/${popup.productId}`
        : 'http://localhost:8080/api/admin/products';

      const method = popup.type === 'edit' ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        alert('Sản phẩm đã được cập nhật/thêm thành công!');
        setPopup({ show: false, type: "", productId: null });
        fetchProducts(currentPage, pageSize); // Refresh product list
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  const handleReset = () => {
    setSearchTerm(''); // Clear search input
    fetchProducts(currentPage, pageSize); // Reload product list without search filter
  };

  return (
    <>
      {/* Popup for Add / Edit Product */}
      {popup.show && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px 40px',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              width: '660px',
              maxWidth: '90%',
            }}
          >
            <h3 style={{ marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
              {popup.type === 'edit' ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
            </h3>
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px',
                }}
              >
                {/* Tên sản phẩm */}
                <div className="form-group">
                  <label htmlFor="name" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Tên sản phẩm</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      height: '40px',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      marginBottom: '10px',
                      width: '100%',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease', // Add transition for hover effect
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'} // Focus state for border color
                    onBlur={(e) => e.target.style.border = '1px solid #ccc'} // Blur state to reset the border color
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'} // Hover state for shadow
                    onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'} // Reset shadow on mouse leave
                  />
                  {errors.name && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.name}</div>}
                </div>

                {/* Repeat similar hover effects for other inputs */}
                {/* Giá */}
                <div className="form-group">
                  <label htmlFor="price" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Giá</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    style={{
                      height: '40px',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      marginBottom: '10px',
                      width: '100%',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                  />
                  {errors.price && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.price}</div>}
                </div>

                {/* Số lượng */}
                <div className="form-group">
                  <label htmlFor="quantity" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Số lượng</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    className="form-control"
                    value={formData.quantity}
                    onChange={handleChange}
                    style={{
                      height: '40px',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      marginBottom: '10px',
                      width: '100%',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                  />
                  {errors.quantity && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.quantity}</div>}
                </div>

                {/* Danh mục */}
                <div className="form-group">
                  <label htmlFor="category" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Danh mục</label>
                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                    style={{
                      height: '40px',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      marginBottom: '10px',
                      width: '100%',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.category}</div>}
                </div>

                {/* Thương hiệu */}
                <div className="form-group">
                  <label htmlFor="brand" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Thương hiệu</label>
                  <select
                    id="brand"
                    name="brand"
                    className="form-control"
                    value={formData.brand}
                    onChange={handleChange}
                    style={{
                      height: '40px',
                      padding: '10px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      marginBottom: '10px',
                      width: '100%',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors.brand && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.brand}</div>}
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label htmlFor="description" style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    marginBottom: '10px',
                    width: '100%',
                    height: '120px',
                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                  onBlur={(e) => e.target.style.border = '1px solid #ccc'}
                  onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)'}
                  onMouseLeave={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'}
                />
                {errors.description && <div className="text-danger" style={{ fontSize: '14px' }}>{errors.description}</div>}
              </div>

              {/* Button Submit & Close */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {popup.type === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setPopup({ show: false, type: "", productId: null })}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}




      {/* Product Table */}

      <div className="be-wrapper be-fixed-sidebar">
        <div className="be-content">
          <div className="container-fluid">
            <div className="content">
              <div className="card">
                <div className="card-header">

                  <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý sản phẩm</h5>
                  <button
                    className="btn btn-success mb-3"
                    onClick={() => openPopup('add')}
                    style={{
                      marginTop: '18px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                  >
                    <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
                  </button>

                </div>

                <div className="card-body">
                  <div className="d-flex" style={{ alignItems: 'center', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                      className="InputContainer-"
                      value={searchTerm} // Liên kết giá trị với searchTerm
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        width: '300px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        transition: 'border 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                      onBlur={(e) => (e.target.style.border = '1px solid #ddd')}
                      onMouseEnter={(e) => (e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.5)')}
                      onMouseLeave={(e) => (e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)')}
                    />



                    <button
                      onClick={handleSearch}
                      className="btn btn-primary"
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                      Tìm kiếm
                    </button>
                    <button
                      onClick={() => handleReset()}
                      className="btn btn-secondary"
                      style={{
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 5px 10px rgba(108, 117, 125, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                    >
                      Đặt lại
                    </button>

                    <div className="page-size" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label htmlFor="pageSize" style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        Số sản phẩm mỗi trang:
                      </label>
                      <select
                        id="pageSize"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        style={{
                          padding: '10px',
                          fontSize: '16px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                          cursor: 'pointer',
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>




                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}    >STT</th>
                        <th style={{ textAlign: 'center' }}    >Tên sản phẩm</th>

                        <th style={{ textAlign: 'center' }}    >Giá</th>
                        <th style={{ textAlign: 'center' }}    >Số lượng</th>
                        <th style={{ textAlign: 'center' }}    >Danh mục</th>
                        <th style={{ textAlign: 'center' }}    >Thương hiệu</th>
                        <th style={{ textAlign: 'center' }}    >Mô tả</th>
                        <th style={{ textAlign: 'center' }}    >Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(productList) && productList.length > 0 ? (
                        productList.map((product, index) => (
                          <tr key={product.id}>
                            <td style={{ width: '20px' }}>{index + 1}</td>
                            <td>{product.name}</td>

                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>
                              {product.category ? product.category.name : "N/A"}
                            </td>
                            <td>{product.brand ? product.brand.name : "N/A"}</td>
                            <td >{product.description}</td>
                            <td>
                              <button
                                onClick={() => openPopup('edit', product.id)}
                                style={{
                                  backgroundColor: '#ffc107',
                                  color: '#fff',
                                  padding: '12px 30px',
                                  borderRadius: '10px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  boxShadow: '0 5px 10px rgba(255, 193, 7, 0.3)',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = '#e0a800';
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = '#ffc107';
                                }}
                              >
                                <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>

                              </button>

                              <button
                                onClick={() => handleDelete(product.id)}
                                style={{
                                  marginLeft: '10px',
                                  backgroundColor: '#dc3545',
                                  color: '#fff',
                                  padding: '12px 30px',
                                  borderRadius: '10px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                                  transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = '#a71d2a';
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = '#dc3545';
                                }}
                              >
                                <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                              </button>

                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center" }}>
                            Không có sản phẩm nào
                          </td>
                        </tr>
                      )}
                    </tbody>


                  </table>
                  <div className="pagination" style={{ width: '100%', justifyContent: 'center', paddingRight: '70px' }}>
                    <button
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '12px 30px',
                        borderRadius: '10px',

                        border: 'none',
                        cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        opacity: currentPage === 0 ? '0.5' : '1', // Disable button opacity when disabled
                      }}
                      onMouseOver={(e) => {
                        if (currentPage !== 0) e.target.style.backgroundColor = '#0056b3';
                      }}
                      onMouseOut={(e) => {
                        if (currentPage !== 0) e.target.style.backgroundColor = '#007bff';
                      }}
                      disabled={currentPage === 0}
                    >
                      <i class="bi bi-caret-left-square-fill"></i>
                    </button>

                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333',
                        textAlign: 'center',
                        margin: '0 15px',
                        padding: '8px 15px',
                        borderRadius: '10px',
                        backgroundColor: '#f0f0f0',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        display: 'inline-block',
                        minWidth: '80px',
                      }}
                    >
                      {currentPage + 1} / {totalPages}
                    </span>


                    <button
                      disabled={currentPage === totalPages - 1}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '12px 30px',
                        borderRadius: '10px',
                        border: 'none',
                        width: '106px',
                        cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        opacity: currentPage === totalPages - 1 ? '0.5' : '1', // Disable button opacity when disabled
                      }}
                      onMouseOver={(e) => {
                        if (currentPage !== totalPages - 1) e.target.style.backgroundColor = '#0056b3';
                      }}
                      onMouseOut={(e) => {
                        if (currentPage !== totalPages - 1) e.target.style.backgroundColor = '#007bff';
                      }}
                      disabled={currentPage === totalPages - 1}
                    >
                      <i class="bi bi-caret-right-square-fill"></i>
                    </button>

                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </div >


    </>
  );
};

export default Management;
