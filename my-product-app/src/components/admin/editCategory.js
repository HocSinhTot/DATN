import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCategoryPage  = () => {
  const [category, setCategory] = useState({
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
        const response = await axios.get(`http://localhost:8080/api/admin/category/${id}`);
        setCategory(response.data);
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
    formData.append("category", JSON.stringify({
      name: category.name,
    }));
  
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/category/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data === "Category updated successfully.") {
        setSuccess("Danh mục đã được cập nhật thành công.");
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
      <h1>Chỉnh Sửa Danh mục</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
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

export default EditCategoryPage;
