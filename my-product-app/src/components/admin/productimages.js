import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsImageTable = () => {
  const [productsImage, setProductsImage] = useState([]);
  const [products, setProducts] = useState({}); // Để lưu thông tin sản phẩm theo ID

  // Fetch data khi component được render
  useEffect(() => {
    const fetchProductsImage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/products-images');
        console.log(response.data); // Kiểm tra dữ liệu phản hồi
        setProductsImage(response.data);

        // Lấy thông tin sản phẩm từ API khác nếu cần
        const productIds = response.data.map(item => item.id.productId);
        const uniqueProductIds = [...new Set(productIds)];

        const productPromises = uniqueProductIds.map(id =>
          axios.get(`http://localhost:8080/api/admin/products/${id}`) // Giả sử có API trả về thông tin sản phẩm
        );

        const productsResponse = await Promise.all(productPromises);
        const productsData = productsResponse.reduce((acc, product) => {
          acc[product.data.id] = product.data; // Lưu thông tin sản phẩm vào state theo ID
          return acc;
        }, {});
        setProducts(productsData); // Lưu thông tin sản phẩm
      } catch (error) {
        console.error('Error fetching products images:', error);
      }
    };

    fetchProductsImage();
  }, []);

  const handleEdit = (item) => {
    // Thêm logic chỉnh sửa
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
    <div className="container">
      <style>
        {`
          .container {
            padding: 20px;
          }

          h2 {
            text-align: center;
            margin-bottom: 20px;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th,
          .table td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
          }

          .table th {
            background-color: #007bff;
          }

          .table .btn {
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          }

          .table .btn-primary {
            background-color: #007bff;
            color: white;
          }

          .table .btn-danger {
            background-color: #dc3545;
            color: white;
          }

          .table .btn:hover {
            opacity: 0.9;
          }
        `}
      </style>
      <h2>Products Image</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Url</th>
            <th>Image</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {productsImage.length > 0 ? (
            productsImage.map((item) => (
              <tr key={`${item.id.productId}-${item.id.imageId}-${item.id.colorId}`}>
                <td>{products[item.id.productId]?.name || 'Unknown'}</td>
                <td>{item.image?.url || 'N/A'}</td>
                <td>
                                                        <img
                                                            src={`/assets/images/${item.image?.url}`} 
                                                            alt="Image"
                                                            style={{ width: '100px', height: 'auto' }}
                                                        />
                                                    </td>
                <td>{item.color?.name || 'N/A'}</td>
                
                <td>
                  <button onClick={() => handleEdit(item)} className="btn btn-primary">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsImageTable;
