import React, { useState, useEffect } from 'react';
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
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 10 }).map((_, index) => ({
      id: index,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

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

  const styles = {
    body: {
      background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      margin: 0,
    },
    stars: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    star: {
      position: 'absolute',
      width: '3px',
      height: '3px',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '50%',
      animation: 'starAnimation 2s infinite',
    },
    container: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      maxWidth: '500px',
      width: '100%',
      zIndex: 10,
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.stars}>
        {stars.map(star => (
          <div
            key={star.id}
            style={{
              ...styles.star,
              top: star.top,
              left: star.left,
              animationDelay: star.animationDelay,
            }}
          ></div>
        ))}
      </div>

      <div style={styles.container}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Thêm Người Dùng</h1>
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

          {/* Add other input fields here */}

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
              style={{
                padding: '13px 23px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '5px',
                marginLeft: '20px',
              }}
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
