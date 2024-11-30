import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ImageManagement = () => {
    const [images, setImages] = useState([]);

    // Fetch images from API
    useEffect(() => {
        fetch('http://localhost:8080/api/images')  // Replace with the correct API endpoint
            .then((response) => response.json())
            .then((data) => setImages(data))
            .catch((error) => console.error('Error fetching image data:', error));
    }, []);

    // Delete image
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            fetch(`http://localhost:8080/api/images/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Image deleted successfully!');
                        setImages(images.filter(image => image.id !== id));
                    }
                })
                .catch((error) => console.error('Error deleting image:', error));
        }
    };

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0">Quản lý hình ảnh</h5>
                                <Link to="/images/add" className="btn btn-light">Thêm mới</Link>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Url</th>
                                            <th>Ảnh</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {images.length > 0 ? (
                                            images.map((image, index) => (
                                                <tr key={image.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{image.url}</td>
                                                    <td>
                                                        <img
                                                            src={`/assets/images/${image.url}`} 
                                                            alt="Image"
                                                            style={{ width: '100px', height: 'auto' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Link to={`/images/edit/${image.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                                                        <button onClick={() => handleDelete(image.id)} className="btn btn-danger btn-sm">Xóa</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy hình ảnh nào</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageManagement;
