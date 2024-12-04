import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    brand: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/admin/products/${id}`
        );
        const productData = response.data;
        setProduct({
          ...productData,
          brand: productData.brand.id, // Nếu API trả về một đối tượng
          category: productData.category.id, // Nếu API trả về một đối tượng
        });
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu sản phẩm.");
      }
    };
    

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/brands");
        setBrands(response.data);
      } catch (err) {
        console.error("Lỗi khi tải thương hiệu:", err);
      }
    };

    fetchProductData();
    fetchCategories();
    fetchBrands();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/products/${id}`,
        product,
        {
          headers: {
            "Content-Type": "application/json", // Đặt đúng kiểu Content-Type
          },
        }
      );
  
      if (response.data === "Product updated successfully.") {
        setSuccess("Sản phẩm đã được cập nhật thành công.");
      } else {
        setError("Lỗi khi cập nhật sản phẩm.");
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi cập nhật sản phẩm.");
    }
  };

  return (
    <div className="container">
      <h1>Chỉnh Sửa Sản Phẩm</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Số lượng</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={product.quantity}
            onChange={(e) =>
              setProduct({ ...product, quantity: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Danh mục</label>
          <select
  id="category"
  name="category"
  className="form-control"
  value={product.category || ""}
  onChange={(e) =>
    setProduct({ ...product, category: e.target.value })
  }
>
  <option value="">-- Chọn danh mục --</option>
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Thương hiệu</label>
          <select
            id="brand"
            name="brand"
            className="form-control"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          >
            <option value="">-- Chọn thương hiệu --</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Show error or success messages */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
