import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Number of products per page
  const [totalPages, setTotalPages] = useState(0); // Total pages

  // Fetch products when page or pageSize changes
  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to the first page
  };

  const fetchProducts = (page, size) => {
    fetch(`http://localhost:8080/api/admin/products?page=${page}&size=${size}`)
      .then(response => response.json())
      .then(data => {
        setProductList(data.content); // Products data
        setTotalPages(data.totalPages); // Total pages
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
            setProductList(productList.filter((product) => product.id !== id)); // Remove the deleted product from the list
          }
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search keyword!');
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
                <h5 className="card-title m-0">Product Management</h5>
                <div className="d-flex">
                  <input
                    type="text"
                    placeholder="Search product name..."
                    className="form-control"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary ml-2"
                  >
                    Search
                  </button>
                </div>
                <Link to="/products/add" className="btn btn-light">
                  Add New
                </Link>
              </div>

              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Actions</th>
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
                          <td>{product.category ? product.category.name : "N/A"}</td>
                          <td>{product.brand ? product.brand.name : "N/A"}</td>
                          <td>
                            <Link
                              to={`/products/edit/${product.id}`}
                              className="btn btn-warning btn-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Pagination Controls */}
                <div className="pagination">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="btn btn-primary"
                  >
                    Previous
                  </button>
                  <span>{currentPage + 1} / {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="btn btn-primary"
                  >
                    Next
                  </button>
                </div>

                {/* Page Size Selector */}
                <div className="page-size">
                  <label htmlFor="pageSize">Products per page:</label>
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

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
