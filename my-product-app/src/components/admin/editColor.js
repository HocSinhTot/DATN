import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditColorPage  = () => {
  const [color, setColor] = useState({
    name: "",
  
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success state for the update
  const navigate = useNavigate();
  const { id } = useParams(); // Get the user ID from URL

  useEffect(() => {
    // Fetch user data by user ID
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/colors/${id}`);
        setColor(response.data);
      } catch (err) {
        console.log(err);
        setError("Lỗi khi tải dữ liệu màu sắc.");
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Thêm dữ liệu user vào formData
    formData.append("color", JSON.stringify({
      name: color.name,
    }));
  
    try {
      const response = await axios.put(`http://localhost:8080/api/colors/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data === "Color updated successfully.") {
        setSuccess("Màu sắc đã được cập nhật thành công.");
      } else {
        setError("Lỗi khi cập nhật màu sắc.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật màu sắc.");
      console.error(err);
    }
  };
  
  
  

  return (
    <div className="container">
      <h1>Chỉnh Sửa Màu Sắc</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên màu sắc</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={color.name}
            onChange={(e) => setColor({ ...color, name: e.target.value })}
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

export default EditColorPage;
