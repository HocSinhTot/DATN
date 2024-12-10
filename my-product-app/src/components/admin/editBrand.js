import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBrandPage  = () => {
  const [brand, setBrand] = useState({
    name: "",
  
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success state for the update
  const [file, setFile] = useState(null); // For file upload
  const navigate = useNavigate();
  const { id } = useParams(); // Get the user ID from URL

  useEffect(() => {
    // Fetch user data by user ID
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/brands/${id}`);
        setBrand(response.data);
      } catch (err) {
        console.log(err);
        setError("Lỗi khi tải dữ liệu danh mục.");
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Thêm dữ liệu user vào formData
    formData.append("brand", JSON.stringify({
      name: brand.name,
    }));
  
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/brands/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data === "Brand updated successfully.") {
        setSuccess("Thương hiệu đã được cập nhật thành công.");
      } else {
        setError("Lỗi khi cập nhật danh mục.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật danh mục.");
      console.error(err);
    }
  };
  
  
  

  return (
    <div className="container">
      <h1>Chỉnh Sửa Thương Hiệu</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên thương hiệu</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={brand.name}
            onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            required
          />
        </div>

        {/* Show error or success messages */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
};

export default EditBrandPage;
