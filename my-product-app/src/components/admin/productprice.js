import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPriceTable = () => {
  const [productsPrices, setProductsPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [popup, setPopup] = useState({ show: false, type: '', priceData: { product: {}, capacity: {}, price: '' } });

  // New state variables for pagination and filters
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('product.name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePrices = await axios.get('http://localhost:8080/api/admin/products-price');
        setProductsPrices(responsePrices.data);

        const responseProducts = await axios.get('http://localhost:8080/api/admin/products');
        if (Array.isArray(responseProducts.data.content)) {
          setProducts(responseProducts.data.content);
        }

        const responseCapacities = await axios.get('http://localhost:8080/api/admin/capacity');
        setCapacities(responseCapacities.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filtered and sorted products prices based on search and sorting
  const filteredPrices = productsPrices.filter(item =>
    item.product?.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const compareA = a[sortBy]?.name || a[sortBy];
    const compareB = b[sortBy]?.name || b[sortBy];

    if (sortOrder === 'asc') {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });

  const paginatedData = filteredPrices.slice((page - 1) * pageSize, page * pageSize);

  const handleEdit = (item) => setPopup({ show: true, type: 'edit', priceData: item });
  const handleDelete = (item) => setPopup({ show: true, type: 'delete', priceData: item });

  const closePopup = () => setPopup({ show: false, type: '', priceData: { product: {}, capacity: {}, price: '' } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { priceData, type } = popup;
    const price = parseFloat(priceData.price);
    if (isNaN(price) || price < 0 || !priceData.product.id || !priceData.capacity.id) {
      alert('Vui lòng nhập dữ liệu hợp lệ.');
      return;
    }

    const url = type === 'edit'
      ? `http://localhost:8080/api/admin/products-price/${priceData.product.id}/${priceData.capacity.id}`
      : 'http://localhost:8080/api/admin/products-price';

    try {
      await axios({
        method: type === 'edit' ? 'PUT' : 'POST',
        url,
        data: {
          product: { id: priceData.product.id },
          capacity: { id: priceData.capacity.id },
          price,
        },
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Cập nhật thành công!');
      closePopup();
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Lỗi khi gửi dữ liệu.');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => setSearch(e.target.value);

  // Handle sort by change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle price sorting toggle
  const handlePriceSortToggle = () => {
    if (sortBy === 'price') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('price');
      setSortOrder('asc');
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => setPage(newPage);

  // Handle page size change
  const handlePageSizeChange = (e) => setPageSize(Number(e.target.value));

  // Reset all filters and pagination
  const handleReset = () => {
    setSearch('');
    setSortBy('product.name');
    setSortOrder('asc');
    setPage(1);
    setPageSize(5);
  };

  return (
    <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
      <div className="be-content" style={{ width: '1100px' }}>
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý dung lượng sản phẩm</h5>
              <button
                className="btn btn-success mb-3"
                onClick={() => setPopup({ show: true, type: 'add', priceData: { product: {}, capacity: {}, price: '' } })}
                style={{
                  marginTop: '18px', backgroundColor: '#28a745', color: '#fff', padding: '12px 30px',
                  borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
                  boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)', transition: 'all 0.3s ease',
                }}
              >
                <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
              </button>
              <button
                className="btn btn-secondary mb-3"
                onClick={handleReset}
                style={{
                  marginTop: '18px', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'
                }}
              >
                Reset
              </button>
            </div>
            <div className="card-body">
              {/* Search Input */}
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm sản phẩm..."
                style={{ marginBottom: '15px', padding: '8px', fontSize: '16px' }}
              />

              {/* Table with Sorting */}
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}
                      onClick={() => handleSortChange('product.name')}
                    >
                      Tên sản phẩm {sortBy === 'product.name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th
                      style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}
                      onClick={() => handleSortChange('capacity.name')}
                    >
                      Dung lượng {sortBy === 'capacity.name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th
                      style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}
                      onClick={handlePriceSortToggle}
                    >
                      Giá {sortBy === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={`${item.id.productId || 'default-product'}-${item.id.capacityId || 'default-capacity'}`}>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.product?.name || 'Unknown'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.capacity?.name || 'N/A'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{
                              backgroundColor: '#ffc107', color: '#fff', padding: '12px 30px', borderRadius: '8px',
                              border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
                              boxShadow: '0 5px 10px rgba(255, 193, 7, 0.3)', transition: 'all 0.3s ease',
                            }}
                          >
                            <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            style={{
                              backgroundColor: '#dc3545', color: '#fff', padding: '12px 30px', borderRadius: '8px',
                              border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
                              boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)', transition: 'all 0.3s ease', marginLeft: '10px',
                            }}
                          >
                            <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
                <span>{page}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page * pageSize >= filteredPrices.length}>Next</button>
              </div>

              {/* Page Size Selector */}
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                <label htmlFor="pageSize">Số lượng mỗi trang:</label>
                <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} style={{ marginLeft: '10px' }}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Form for Editing */}
      {popup.show && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <h3>{popup.type === 'edit' ? 'Sửa giá' : 'Thêm giá'}</h3>
            <div>
              <label htmlFor="product">Sản phẩm</label>
              <select
                id="product"
                value={popup.priceData.product.id || ''}
                onChange={(e) => setPopup({ ...popup, priceData: { ...popup.priceData, product: { id: e.target.value } } })}
              >
                <option value="">Chọn sản phẩm</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="capacity">Dung lượng</label>
              <select
                id="capacity"
                value={popup.priceData.capacity.id || ''}
                onChange={(e) => setPopup({ ...popup, priceData: { ...popup.priceData, capacity: { id: e.target.value } } })}
              >
                <option value="">Chọn dung lượng</option>
                {capacities.map(capacity => (
                  <option key={capacity.id} value={capacity.id}>{capacity.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price">Giá</label>
              <input
                id="price"
                type="number"
                value={popup.priceData.price || ''}
                onChange={(e) => setPopup({ ...popup, priceData: { ...popup.priceData, price: e.target.value } })}
              />
            </div>
            <div>
              <button type="submit">{popup.type === 'edit' ? 'Cập nhật' : 'Thêm mới'}</button>
              <button type="button" onClick={closePopup}>Hủy</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductsPriceTable;
