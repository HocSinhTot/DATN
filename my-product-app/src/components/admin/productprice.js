import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPriceTable = () => {
  const [productsPrices, setProductsPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [popup, setPopup] = useState({ show: false, type: '', priceData: { product: {}, capacity: {}, price: '' } });

  useEffect(() => {
    // Fetch products prices
    const fetchProductsPrices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products-price');
        setProductsPrices(response.data);
      } catch (error) {
        console.error('Error fetching products prices:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products');
        console.log('Products response:', response.data);  // Kiểm tra dữ liệu trả về
        if (Array.isArray(response.data.content)) {
          setProducts(response.data.content); // Lấy dữ liệu từ content và lưu vào state
        } else {
          console.error('Data returned is not an array:', response.data.content);
          setProducts([]); // Nếu không phải mảng, set giá trị mặc định là mảng rỗng
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Nếu có lỗi, set giá trị mặc định là mảng rỗng
      }
    };



    // Fetch capacities
    const fetchCapacities = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/capacity');
        setCapacities(response.data);
      } catch (error) {
        console.error('Error fetching capacities:', error);
      }
    };

    fetchProductsPrices();
    fetchProducts();
    fetchCapacities();
  }, []);

  const handleEdit = (item) => {
    setPopup({ show: true, type: 'edit', priceData: item });
  };

  const handleDelete = (item) => {
    setPopup({ show: true, type: 'delete', priceData: item });
  };

  const confirmDelete = async () => {
    const { product, capacity } = popup.priceData;
    console.log('Product ID:', product.id);  // In ra ID của sản phẩm
    console.log('Capacity ID:', capacity.id);  // In ra ID của dung lượng

    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/products-price/${product.id}/${capacity.id}`);
      if (response.status === 200) {
        alert('Deleted product price successfully!');
        setProductsPrices(productsPrices.filter(item =>
          !(item.product.id === product.id && item.capacity.id === capacity.id)
        ));
      }
      closePopup();
    } catch (error) {
      console.error('Error deleting product price:', error);
      alert('Không thể xóa biến thể này.');
    }
  };



  const closePopup = () => {
    setPopup({ show: false, type: '', priceData: { product: {}, capacity: {}, price: '' } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { priceData, type } = popup;

    // Kiểm tra xem giá và id của product, capacity có hợp lệ không
    const price = parseFloat(priceData.price); // Chuyển đổi sang số

    if (isNaN(price) || price < 0 || !priceData.product.id || !priceData.capacity.id) {
      alert('Vui lòng nhập dữ liệu hợp lệ.');
      return;
    }

    const url = type === 'edit'
      ? `http://localhost:8080/api/admin/products-price/${priceData.product.id}/${priceData.capacity.id}`
      : 'http://localhost:8080/api/admin/products-price';

    try {
      const response = await axios({
        method: type === 'edit' ? 'PUT' : 'POST',
        url: url,
        data: {
          product: {
            id: priceData.product.id // chỉ cần id của sản phẩm
          },
          capacity: {
            id: priceData.capacity.id // chỉ cần id của dung lượng
          },
          price: price  // Đảm bảo giá không phải là null
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle response here (e.g., update state or show a message)
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Thêm biến thể thành công '); // Hiển thị thông báo cho người dùng
      closePopup();
    }
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
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Tên sản phẩm</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Dung lượng</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Giá</th>
                    <th style={{ textAlign: 'center', padding: '12px', backgroundColor: '#007bff', color: '#fff' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {productsPrices.length > 0 ? (
                    productsPrices.map((item) => (
                      <tr key={`${item.id.productId || 'default-product'}-${item.id.capacityId || 'default-capacity'}`}>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.product?.name || 'Unknown'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>{item.capacity?.name || 'N/A'}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>  {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}



                        </td>


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
              {popup.type === 'edit' ? 'Cập nhật biến thể' : popup.type === 'delete' ? 'Confirm Deletion' : 'Thêm biến thể'}
            </h3>

            {popup.type !== 'delete' ? (
              <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Product Select */}
                <div className="form-group">
                  <label htmlFor="productName" style={{ fontWeight: '600', fontSize: '16px' }}>
                    Chọn sản phẩm
                  </label>
                  <select
                    id="productName"
                    value={popup.priceData?.product?.id || ''}
                    onChange={(e) =>
                      setPopup((prevState) => ({
                        ...prevState,
                        priceData: { ...prevState.priceData, product: { id: e.target.value } },
                      }))
                    }
                    className="form-control"
                    required
                    style={{ marginBottom: '15px' }}
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No products available
                      </option>
                    )}
                  </select>


                </div>

                {/* Capacity Select */}
                <div className="form-group">
                  <label htmlFor="capacity" style={{ fontWeight: '600', fontSize: '16px' }}>
                    Chọn dung lương
                  </label>
                  <select
                    id="capacity"
                    value={popup.priceData?.capacity?.id || ''}
                    onChange={(e) =>
                      setPopup((prevState) => ({
                        ...prevState,
                        priceData: { ...prevState.priceData, capacity: { id: e.target.value } },
                      }))
                    }
                    className="form-control"
                    required
                    style={{ marginBottom: '15px' }}
                  >
                    <option value="">Chọn dung lượng</option>
                    {capacities.length > 0 ? (
                      capacities.map((capacity) => (
                        <option key={capacity.id} value={capacity.id}>
                          {capacity.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No capacities available
                      </option>
                    )}
                  </select>
                </div>

                {/* Product Price */}
                <div className="form-group">
                  <label htmlFor="price" style={{ fontWeight: '600', fontSize: '16px' }}>
                    Giá
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

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary">
                    {popup.type === 'edit' ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closePopup}>
                    Đóng
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: '16px', fontWeight: '600' }}>Bạn có chắc chắn muốn xóa biến thể này</p>
                <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={confirmDelete}
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
                    }}
                  >
                    Xóa
                  </button>
                  <button
                    onClick={closePopup}
                    style={{
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      boxShadow: '0 5px 10px rgba(108, 117, 125, 0.3)',
                      marginLeft: '15px',
                    }}
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPriceTable;