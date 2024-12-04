import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProductForm = () => {
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

  // Fetch brands and categories
  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // In các giá trị form trước khi gửi lên backend
    console.log("Form data before submit:");
    console.log("Product Name: ", formData.name);
    console.log("Description: ", formData.description);
    console.log("Price: ", formData.price);
    console.log("Quantity: ", formData.quantity);
    console.log("Brand ID: ", formData.brand);
    console.log("Category ID: ", formData.category);

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

      const response = await axios.post(
        'http://localhost:8080/api/admin/products',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('Sản phẩm đã được thêm thành công!');
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <h1 className="text-center mb-4">Thêm Sản Phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên sản phẩm</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <div className="text-danger">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <div className="text-danger">{errors.price}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Số lượng</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="form-control"
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
        </div>


        <div className="form-group">
          <label htmlFor="categoriid">Danh mục</label>
          <select
            id="category"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <div className="text-danger">{errors.category}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="brand">Thương hiệu</label>
          <select
            id="brand"
            name="brand"
            className="form-control"
            value={formData.brand}
            onChange={handleChange}
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brand && <div className="text-danger">{errors.brand}</div>}
        </div>

        <div className="d-flex justify-content-between">
          <a href="/nguoidung" className="btn btn-danger">
            Quay lại
          </a>
          <button type="submit" className="btn btn-primary">
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
