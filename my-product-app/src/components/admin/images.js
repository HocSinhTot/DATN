import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ImageManagement = () => {
    const [images, setImages] = useState([]);
    const [popup, setPopup] = useState({ show: false, type: '', image: null });
    const [formData, setFormData] = useState({ url: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/images')
            .then((response) => response.json())
            .then((data) => setImages(data))
            .catch((error) => console.error('Error fetching image data:', error));
    }, []);

    useEffect(() => {
        if (popup.type === 'edit') {
            setFormData({ url: popup.image.url });
        }
    }, [popup]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            fetch(`http://localhost:8080/api/admin/images/${id}`, {
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

    const handleEdit = (image) => {
        setPopup({ show: true, type: 'edit', image: image });
    };

    const handleAdd = () => {
        setPopup({ show: true, type: 'add', image: null });
    };

    const closeModal = () => {
        setPopup({ show: false, type: '', image: null });
        setFormData({ url: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newImage = {
            ...formData,
        };

        const url = popup.type === 'edit'
            ? `http://localhost:8080/api/admin/images/${popup.image.id}`
            : 'http://localhost:8080/api/admin/images';
        const method = popup.type === 'edit' ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newImage),
        })
            .then((response) => {
                if (response.ok) {
                    const updatedImage = {
                        ...newImage,
                        id: popup.type === 'edit' ? popup.image.id : Date.now(),
                    };
                    if (popup.type === 'edit') {
                        setImages(images.map(image => (image.id === popup.image.id ? updatedImage : image)));
                    } else {
                        setImages([...images, updatedImage]);
                    }
                    closeModal();
                }
            })
            .catch((error) => console.error('Error updating image:', error));
    };

    return (
        <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="be-content" style={{ width: '1100px' }}>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý hình ảnh</h5>
                            <button onClick={handleAdd} className="btn btn-success mb-3" style={{
                                backgroundColor: '#28a745', color: '#fff', padding: '12px 30px', borderRadius: '8px',
                                border: 'none', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)',
                                transition: 'all 0.3s ease', cursor: 'pointer'
                            }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}>
                                <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
                            </button>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>STT</th>
                                        <th style={{ textAlign: 'center' }}>Url</th>
                                        <th style={{ textAlign: 'center' }}>Ảnh</th>
                                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {images.length > 0 ? (
                                        images.map((image, index) => (
                                            <tr key={image.id}>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{image.url}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <img
                                                        src={`/assets/images/${image.url}`}
                                                        alt="Image"
                                                        style={{ width: '100px', height: 'auto' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleEdit(image)}
                                                        style={{
                                                            backgroundColor: '#ffc107', color: '#fff', padding: '12px 30px',
                                                            borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                            fontSize: '16px', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(255, 193, 7, 0.3)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#e0a800'; }}
                                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#ffc107'; }}
                                                    >
                                                        <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(image.id)}
                                                        style={{
                                                            marginLeft: '60px', backgroundColor: '#dc3545', color: '#fff', padding: '12px 30px',
                                                            borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
                                                            boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)', transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => { e.target.style.backgroundColor = '#a71d2a'; }}
                                                        onMouseOut={(e) => { e.target.style.backgroundColor = '#dc3545'; }}
                                                    >
                                                        <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                                                    </button>
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

            {/* Modal Popup */}
            {popup.show && (
                <div style={{
                    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: '9999',
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '30px 40px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center', width: '660px', maxWidth: '90%',
                    }}>
                        <h3 style={{ marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                            {popup.type === 'edit' ? 'Sửa hình ảnh' : 'Thêm mới hình ảnh'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <div className="form-group">
                                <label htmlFor="url" style={{ fontWeight: 600, fontSize: '20px' }}>Url</label>
                                <input
                                    type="text"
                                    id="url"
                                    name="url"
                                    className="form-control"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <button type="submit" style={{
                                    backgroundColor: '#28a745', color: '#fff', padding: '12px 30px', borderRadius: '8px',
                                    border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                                    boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)', transition: 'all 0.3s ease'
                                }}>
                                    {popup.type === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button type="button" onClick={closeModal} style={{
                                    backgroundColor: '#dc3545', color: '#fff', padding: '12px 30px', borderRadius: '8px',
                                    border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                                    boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)', transition: 'all 0.3s ease'
                                }}>
                                    Đóng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageManagement;
