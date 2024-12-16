import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPriceTable = () => {
  const [productsPrices, setProductsPrices] = useState([]);

  // Fetch data when the component is rendered
  useEffect(() => {
    const fetchProductsPrices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products-price');
        setProductsPrices(response.data);
      } catch (error) {
        console.error('Error fetching products prices:', error);
      }
    };

    fetchProductsPrices();
  }, []);

  const handleEdit = (item) => {
    // Logic chỉnh sửa
    console.log('Edit item:', item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/products-price/${id.productId}/${id.capacityId}/${id.colorId}`);
        setProductsPrices(productsPrices.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting product price:', error);
      }
    }
  };

  return (
    <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
      <div className="be-content" style={{ width: '1100px' }}>
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý giá sản phẩm</h5>
              
            </div>
            <div className="card-body">
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Sản phẩm</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Dung lượng</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Giá</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {productsPrices.length > 0 ? (
                    productsPrices.map((item) => (
                      <tr key={`${item.id.productId}-${item.id.capacityId}-${item.id.colorId}`}>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.product?.name || 'Unknown'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.capacity?.name || 'N/A'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.price}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: '#fff',
                              padding: '12px 30px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              boxShadow: '0 5px 10px rgba(255, 193, 7, 0.3)',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
                          >
                            <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: '#fff',
                              padding: '12px 30px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                              transition: 'all 0.3s ease',
                              marginLeft: '10px',
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#a71d2a'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPriceTable;
