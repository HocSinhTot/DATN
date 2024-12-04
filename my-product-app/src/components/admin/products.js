import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
const [pageSize, setPageSize] = useState(10); // Số sản phẩm mỗi trang
const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  useEffect(() => {
    // Fetch product data from API
    fetch("http://localhost:8080/api/admin/products") // API endpoint
      .then((response) => response.json())
      .then((data) => setProductList(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  useEffect(() => {
    fetchProducts(currentPage, pageSize);
}, [currentPage, pageSize]);

const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset về trang đầu tiên khi thay đổi số sản phẩm mỗi trang
};


const fetchProducts = (page, size) => {
    fetch(`http://localhost:8080/api/admin/products?page=${page}&size=${size}`)
        .then(response => response.json())
        .then(data => {
            setProductList(data.content); // Dữ liệu sản phẩm
            setTotalPages(data.totalPages); // Tổng số trang
        })
        .catch(error => console.error('Error fetching products:', error));
};


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("Product deleted successfully!");
            setProductList(productList.filter((product) => product.id !== id)); // Remove deleted product from list
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
  return (
    <div className="be-wrapper be-fixed-sidebar">
      <div className="be-content">
        <div className="container-fluid">
          <div className="content">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title m-0">Quản lý sản phẩm</h5>
                <div className="d-flex">
                  <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    className="form-control"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary ml-2"
                  >
                    Tìm kiếm
                  </button>
                </div>
                <Link to="/products/add" className="btn btn-light">
                  Thêm mới
                </Link>
              </div>

              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên sản phẩm</th>
                      <th>Mô tả</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Danh mục</th>
                      <th>Thương hiệu</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(productList) && productList.length > 0 ? (
        productList.map((product, index) => (
                        <tr key={product.id}>
                          <td>{index + 1}</td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>{product.price}</td>
                          <td>{product.quantity}</td>
                          <td>
                            {product.category ? product.category.name : "N/A"}
                          </td>
                          <td>{product.brand ? product.brand.name : "N/A"}</td>
                          <td>
                            <Link
                              to={`/products/edit/${product.id}`}
                              className="btn btn-warning btn-sm"
                            >
                              Sửa
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Xóa
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
                  <div className="pagination">
    <button
        disabled={currentPage === 0}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="btn btn-primary"
    >
        Trước
    </button>
    <span>{currentPage + 1} / {totalPages}</span>
    <button
        disabled={currentPage === totalPages - 1}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="btn btn-primary"
    >
        Sau
    </button>
</div>

<div className="page-size">
    <label htmlFor="pageSize">Số sản phẩm mỗi trang:</label>
    <select
    id="pageSize"
    value={pageSize}
    onChange={handlePageSizeChange}
>
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={20}>20</option>
</select>


</div>

                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
