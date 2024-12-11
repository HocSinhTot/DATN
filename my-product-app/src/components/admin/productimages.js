import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsImageTable = () => {
  const [productsImage, setProductsImage] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProductsImage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products-images');
        setProductsImage(response.data);

        const productIds = [...new Set(response.data.map(item => item.id.productId))];
        const productPromises = productIds.map(id =>
          axios.get(`http://localhost:8080/api/admin/products/${id}`)
        );

        const productsResponse = await Promise.all(productPromises);
        const productsData = productsResponse.reduce((acc, product) => {
          acc[product.data.id] = product.data;
          return acc;
        }, {});

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products images:', error);
      }
    };

    fetchProductsImage();
  }, []);

  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/products-images/${id.productId}/${id.imageId}/${id.colorId}`);
        setProductsImage(productsImage.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting products image:', error);
      }
    }
  };

  return (
    <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
      <div className="be-content" style={{ width: '1100px' }}>
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý hình ảnh sản phẩm</h5>
            </div>
            <div className="card-body">
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Sản phẩm</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>URL</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Hình ảnh</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Màu sắc</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {productsImage.length > 0 ? (
                    productsImage.map((item) => (
                      <tr key={`${item.id.productId}-${item.id.imageId}-${item.id.colorId}`}>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{products[item.id.productId]?.name || 'Unknown'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.image?.url || 'N/A'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>
                          <img
                            src={`/assets/images/${item.image?.url}`}
                            alt="Image"
                            style={{ width: '100px', height: 'auto' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.color?.name || 'N/A'}</td>
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
                              marginRight: '10px',
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

export default ProductsImageTable;
