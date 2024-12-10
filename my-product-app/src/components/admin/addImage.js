import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddImageForm = () => {
  const [formData, setFormData] = useState({
    url: '',
  });

  const [errors, setErrors] = useState({});
  const [stars, setStars] = useState([]);

  // Fetch brands and categories
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
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    try {
      const formDataToSend = new FormData();
      const imagePayload = {
        name: formData.name,
      };

      formDataToSend.append('image', JSON.stringify(imagePayload));

      const response = await axios.post(
        'http://localhost:8080/api/admin/images',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('Hình ảnh đã được thêm thành công!');
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
      <h1 className="text-center mb-4">Thêm Hình Ảnh</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Url</label>
          <input
            type="text"
            id="url"
            name="url"
            className="form-control"
            value={formData.url}
            onChange={handleChange}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
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
  );
};

export default AddImageForm;
