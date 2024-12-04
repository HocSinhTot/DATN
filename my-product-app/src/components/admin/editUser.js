import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUserPage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    birthday: "",
    phone: "",
    role: false,
    gender: true,
    image: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success state for the update
  const [file, setFile] = useState(null); // For file upload
  const navigate = useNavigate();
  const { id } = useParams(); // Get the user ID from URL

  useEffect(() => {
    // Fetch user data by user ID
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${id}`);
        setUser(response.data);
      } catch (err) {
        console.log(err);
        setError("Lỗi khi tải dữ liệu người dùng.");
      }
    };

    fetchUserData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Thêm dữ liệu user vào formData
    formData.append("user", JSON.stringify({
      username: user.username,
      email: user.email,
      name: user.name,
      birthday: user.birthday,
      phone: user.phone,
      role: user.role.toString(),
      gender: user.gender.toString()
    }));
  
    // Chỉ thêm file nếu có
    if (file) {
      formData.append("file", file);
    }
  
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data === "User updated successfully.") {
        setSuccess("Người dùng đã được cập nhật thành công.");
        setTimeout(() => {
          navigate(`/user/${id}`);
        }, 2000);
      } else {
        setError("Lỗi khi cập nhật người dùng.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật người dùng.");
      console.error(err);
    }
  };
  
  
  

  return (
    <div className="container">
      <h1>Chỉnh Sửa Người Dùng</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Tên người dùng</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthday">Ngày sinh</label>
          <input
            type="date"
            className="form-control"
            id="birthday"
            value={user.birthday}
            onChange={(e) => setUser({ ...user, birthday: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Vai trò</label>
          <select
            className="form-control"
            id="role"
            value={user.role.toString()}
            onChange={(e) => setUser({ ...user, role: e.target.value === 'true' })}
          >
            <option value="true">Admin</option>
            <option value="false">User</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="gender">Giới tính</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="true"
              checked={user.gender === true}
              onChange={() => setUser({ ...user, gender: true })}
            /> Nam
            <input
              type="radio"
              id="female"
              name="gender"
              value="false"
              checked={user.gender === false}
              onChange={() => setUser({ ...user, gender: false })}
            /> Nữ
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="file">Chọn ảnh</label>
          <input
            type="file"
            className="form-control"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {user.image && (
            <div>
              <img
                src={`http://localhost:8080/assets/images/${user.image}`}
                alt="User"
                width="100"
                height="100"
              />
            </div>
          )}
        </div>

        {/* Show error or success messages */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
};

export default EditUserPage;
