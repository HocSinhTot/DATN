import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductsPriceTable = () => {
  const [productsPrices, setProductsPrices] = useState([]);

  // Fetch data khi component được render
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
    // Thêm logic chỉnh sửa
    console.log('Edit item:', item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/products-price/${id.productId}/${id.capacityId}/${id.colorId}`);
        setProductsPrices(productsPrices.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Error deleting products price:', error);
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
      <h2>Products Prices</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Color</th>
            <th>Capacity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsPrices.length > 0 ? (
            productsPrices.map((item) => (
              <tr key={`${item.id.productId}-${item.id.capacityId}-${item.id.colorId}`}>
                <td>{item.product?.name || 'Unknown'}</td>
                <td>{item.color?.name || 'N/A'}</td>
                <td>{item.capacity?.name || 'N/A'}</td>
                <td>{item.price}</td>
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

export default ProductsPriceTable;
