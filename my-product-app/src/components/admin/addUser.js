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
      // Tạo FormData và thêm dữ liệu
      const formDataToSend = new FormData();
      const userPayload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        name: formData.name,
        birthday: formData.birthday,
        phone: formData.phone,
        role: formData.role === 'true',
        gender: formData.gender === 'true',
      };

      formDataToSend.append('user', JSON.stringify(userPayload));
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      // Gửi dữ liệu đến backend
      const response = await axios.post('http://localhost:8080/api/users', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('User added successfully!');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>


      <div
        style={{
          width: '1000px',
          maxWidth: '600px',
          marginTop: '50px',
          backgroundColor: '#f9f9f9',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          Thêm Người Dùng
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Tên người dùng
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                borderRadius: '5px',
                border: '1px solid #ccc',
                padding: '10px',
                width: '100%',
                transition: 'border-color 0.3s ease',
              }}
            />
            {errors.username && <div style={{ color: '#dc3545', fontSize: '14px' }}>{errors.username}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Mật khẩu
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                borderRadius: '5px',
                border: '1px solid #ccc',
                padding: '10px',
                width: '100%',
                transition: 'border-color 0.3s ease',
              }}
            />
            {errors.password && <div style={{ color: '#dc3545', fontSize: '14px' }}>{errors.password}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                borderRadius: '5px',
                border: '1px solid #ccc',
                padding: '10px',
                width: '100%',
                transition: 'border-color 0.3s ease',
              }}
            />
            {errors.email && <div style={{ color: '#dc3545', fontSize: '14px' }}>{errors.email}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Tên
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                borderRadius: '5px',
                border: '1px solid #ccc',
                padding: '10px',
                width: '100%',
                transition: 'border-color 0.3s ease',
              }}
            />
            {errors.name && <div style={{ color: '#dc3545', fontSize: '14px' }}>{errors.name}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="birthday" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Ngày sinh
            </label>
            <input
              type="date"
              className="form-control"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              style={{
                borderRadius: '5px',
                border: '1px solid #ccc',
                padding: '10px',
                width: '100%',
                transition: 'border-color 0.3s ease',
              }}
            />
            {errors.birthday && <div style={{ color: '#dc3545', fontSize: '14px' }}>{errors.birthday}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="phone" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Số điện thoại
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                borderRadius: '5px',
                border: '1px solid #ccc',
                padding: '10px',
                width: '100%',
                transition: 'border-color 0.3s ease',
              }}
            />
            {errors.phone && <div style={{ color: '#dc3545', fontSize: '14px' }}>{errors.phone}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="role" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Vai trò
            </label>
            <select
              className="form-control"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                borderRadius: '5px',
                border: '1px solid #ccc',

                width: '100%',
              }}
            >
              <option value="true">Admin</option>
              <option value="false">User</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Giới tính
            </label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="true"
                checked={formData.gender === 'true'}
                onChange={handleChange}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor="male" style={{ marginRight: '20px' }}>Nam</label>

              <input
                type="radio"
                id="female"
                name="gender"
                value="false"
                checked={formData.gender === 'false'}
                onChange={handleChange}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor="female">Nữ</label>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="file" style={{ fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '8px' }}>
              Hình ảnh
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              onChange={handleFileChange}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                height: '43px',
              }}
            />
          </div>

          <div className="d-flex" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => alert('Chức năng quay lại')}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '5px',
              }}
            >
              Quay lại
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
