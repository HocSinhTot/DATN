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
  const [success, setSuccess] = useState("");  // Trạng thái thành công
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL

  useEffect(() => {
    // Lấy dữ liệu người dùng từ API theo ID người dùng
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
    // Append từng trường của user vào formData
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("name", user.name);
    formData.append("birthday", user.birthday);
    formData.append("phone", user.phone);
    formData.append("role", user.role.toString()); // Đảm bảo gửi dưới dạng chuỗi
    formData.append("gender", user.gender.toString()); // Đảm bảo gửi dưới dạng chuỗi
    if (file) formData.append("file", file);

    try {
      // Sử dụng PUT để cập nhật người dùng
      const response = await axios.put(`http://localhost:8080/api/users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === "User updated successfully.") {
        setSuccess("Người dùng đã được cập nhật thành công.");
        setTimeout(() => {
          navigate(`/user/${id}`);
        }, 2000); // Chuyển trang sau 2 giây
      } else {
        setError("Lỗi khi cập nhật người dùng.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật người dùng.");
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
            value={user.role}
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

        {/* Hiển thị lỗi hoặc thành công */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary">Cập nhật</button>
      </form>
    </div>
  );
};

export default EditUserPage;
