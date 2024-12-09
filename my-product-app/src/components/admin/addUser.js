import React, { useState } from 'react';
import axios from 'axios';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    birthday: '',
    phone: '',
    role: 'false', // default to 'User'
    gender: 'true', // default to 'Male'
    file: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new FormData object to send multipart data
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Send the data to the backend (adjust the URL as needed)
      const response = await axios.post('http://localhost:8080/api/admin/users', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      if (response.status === 200) {
        alert('User added successfully!');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        setErrors(error.response.data.errors || {});  // Handle validation errors from backend
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <h1 className="text-center mb-4">Thêm Người Dùng</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Tên người dùng</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Tên</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="birthday">Ngày sinh</label>
          <input
            type="date"
            className="form-control"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
          {errors.birthday && <div className="text-danger">{errors.birthday}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Vai trò</label>
          <select
            className="form-control"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="true">Admin</option>
            <option value="false">User</option>
          </select>
        </div>

        <div className="form-group">
          <label>Giới tính</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="true"
              checked={formData.gender === 'true'}
              onChange={handleChange}
            /> Nam
            <input
              type="radio"
              id="female"
              name="gender"
              value="false"
              checked={formData.gender === 'false'}
              onChange={handleChange}
            /> Nữ
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="file">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>

        <div className="d-flex justify-content-between">
          <a href="/nguoidung" className="btn btn-danger">Quay lại</a>
          <button type="submit" className="btn btn-primary">Thêm</button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
