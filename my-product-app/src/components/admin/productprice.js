import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPriceTable = () => {
  const [productsPrices, setProductsPrices] = useState([]);
  const [popup, setPopup] = useState({ show: false, type: '', priceData: null });

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
    setPopup({ show: true, type: 'edit', priceData: item });
  };

  const handleDelete = (item) => {
    setPopup({ show: true, type: 'delete', priceData: item });
  };

  const confirmDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/products-price/${id.productId}/${id.capacityId}/${id.colorId}`);
      if (response.status === 200) {
        alert('Xóa giá sản phẩm thành công!');
        setProductsPrices(productsPrices.filter((item) => item.id !== id));
      }
      closePopup();
    } catch (error) {
      console.error('Error deleting product price:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { priceData, type } = popup;
      const url = type === 'edit'
        ? `http://localhost:8080/api/admin/products-price/${priceData.id.productId}/${priceData.id.capacityId}/${priceData.id.colorId}`
        : 'http://localhost:8080/api/admin/products-price';
      const method = type === 'edit' ? 'PUT' : 'POST';

      const response = await axios({ method, url, data: priceData });
      if (response.status === 200 || response.status === 201) {
        alert(type === 'edit' ? 'Cập nhật giá sản phẩm thành công!' : 'Thêm giá sản phẩm thành công!');
      }

      const updatedData = await axios.get('http://localhost:8080/api/admin/products-price');
      setProductsPrices(updatedData.data);
      closePopup();
    } catch (error) {
      console.error(`Error ${popup.type === 'edit' ? 'updating' : 'adding'} product price:`, error);
    }
  };

  const closePopup = () => {
    setPopup({ show: false, type: '', priceData: null });
  };

  return (
    <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
      <div className="be-content" style={{ width: '1100px' }}>
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý giá sản phẩm</h5>
              <button
                className="btn btn-success mb-3"
                onClick={() => setPopup({ show: true, type: 'add', priceData: null })}
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
              >
                <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
              </button>
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
                          >
                            <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
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

      {
        popup.show && (
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
              <h3
                style={{ marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}
              >
                {popup.type === 'edit'
                  ? 'Sửa thông tin sản phẩm'
                  : popup.type === 'delete'
                    ? 'Xác nhận xóa'
                    : 'Thêm thông tin sản phẩm'}
              </h3>

              {popup.type !== 'delete' ? (
                <form
                  onSubmit={handleSubmit}
                  style={{ maxWidth: '600px', margin: '0 auto' }}
                >
                  {/* Trường nhập Tên sản phẩm */}
                  <div className="form-group">
                    <label
                      htmlFor="productName"
                      style={{ fontWeight: '600', fontSize: '16px' }}
                    >
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      id="productName"
                      value={popup.priceData?.productName || ''}
                      onChange={(e) =>
                        setPopup((prevState) => ({
                          ...prevState,
                          priceData: { ...prevState.priceData, productName: e.target.value },
                        }))
                      }
                      className="form-control"
                      required
                      style={{ marginBottom: '15px' }}
                    />
                  </div>

                  {/* Trường nhập Dung lượng sản phẩm */}
                  <div className="form-group">
                    <label
                      htmlFor="capacity"
                      style={{ fontWeight: '600', fontSize: '16px' }}
                    >
                      Dung lượng sản phẩm
                    </label>
                    <input
                      type="text"
                      id="capacity"
                      value={popup.priceData?.capacity || ''}
                      onChange={(e) =>
                        setPopup((prevState) => ({
                          ...prevState,
                          priceData: { ...prevState.priceData, capacity: e.target.value },
                        }))
                      }
                      className="form-control"
                      required
                      style={{ marginBottom: '15px' }}
                    />
                  </div>

                  {/* Trường nhập Giá sản phẩm */}
                  <div className="form-group">
                    <label
                      htmlFor="price"
                      style={{ fontWeight: '600', fontSize: '16px' }}
                    >
                      Giá sản phẩm
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={popup.priceData?.price || ''}
                      onChange={(e) =>
                        setPopup((prevState) => ({
                          ...prevState,
                          priceData: { ...prevState.priceData, price: e.target.value },
                        }))
                      }
                      className="form-control"
                      required
                      style={{ marginBottom: '15px' }}
                    />
                  </div>

                  {/* Nút gửi form */}
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)',
                    }}
                  >
                    {popup.type === 'edit' ? 'Cập nhật' : 'Thêm'}
                  </button>
                </form>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => confirmDelete(popup.priceData)}
                    className="btn btn-danger"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                    }}
                  >
                    Xóa
                  </button>
                </div>
              )}

              {/* Nút đóng popup */}
              <button
                onClick={closePopup}
                className="btn btn-secondary"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#000',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>
          </div>
        )
      }

    </div>
  );
};

export default ProductsPriceTable;
