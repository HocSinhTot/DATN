import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CapacityManagement = () => {
    const [capacityList, setCapacityList] = useState([]);
    const [popup, setPopup] = useState({ show: false, type: '', capacity: null });
    const [formData, setFormData] = useState({ name: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Loading state for form submission

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/capacity')
            .then((response) => response.json())
            .then((data) => setCapacityList(data))
            .catch((error) => console.error('Error fetching capacity data:', error));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this capacity?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/capacity/${id}`);
                alert('Capacity deleted successfully!');
                setCapacityList(capacityList.filter((capacity) => capacity.id !== id));
            } catch (error) {
                console.error('Error deleting capacity:', error);
            }
        }
    };

    const handlePopupOpen = (type, capacity = {}) => {
        setPopup({ show: true, type, capacity });
        setFormData({ name: capacity.name || '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { name } = formData;
        try {
            if (popup.type === 'edit') {
                await axios.put(`http://localhost:8080/api/admin/capacity/${popup.capacity.id}`, { name });
                alert('Capacity updated successfully!');
            } else {
                await axios.post('http://localhost:8080/api/admin/capacity', { name });
                alert('Capacity added successfully!');
            }
            setPopup({ show: false, type: '', capacity: {} });
            setFormData({ name: '' });
            fetch('http://localhost:8080/api/admin/capacity')
                .then((response) => response.json())
                .then((data) => setCapacityList(data));
        } catch (error) {
            setErrors({ name: 'Error saving capacity!' });
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setPopup({ show: false, type: '', capacity: {} });
        setErrors({});
    };

    return (
        <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="be-content" style={{ width: '1100px' }}>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý dung lượng</h5>
                            <button
                                className="btn btn-success mb-3"
                                onClick={() => handlePopupOpen('add')}
                                style={{
                                    marginTop: '18px',
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    padding: '12px 30px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 5px 10px rgba(40, 167, 69, 0.3)',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                            >
                                <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
                            </button>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>STT</th>
                                        <th style={{ textAlign: 'center' }}>Tên dung lượng</th>
                                        <th style={{ width: '500px', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {capacityList.length > 0 ? (
                                        capacityList.map((capacity, index) => (
                                            <tr key={capacity.id}>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>{capacity.name}</td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handlePopupOpen('edit', capacity)}
                                                        style={{
                                                            backgroundColor: '#ffc107',
                                                            color: '#fff',
                                                            padding: '12px 30px',
                                                            borderRadius: '10px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '16px',
                                                            fontWeight: 'bold',
                                                            boxShadow: '0 5px 10px rgba(255, 193, 7, 0.3)',
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                        onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
                                                        onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
                                                    >
                                                        <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(capacity.id)}
                                                        style={{
                                                            marginLeft: '60px',
                                                            backgroundColor: '#dc3545',
                                                            color: '#fff',
                                                            padding: '12px 30px',
                                                            borderRadius: '10px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '16px',
                                                            fontWeight: 'bold',
                                                            boxShadow: '0 5px 10px rgba(220, 53, 69, 0.3)',
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                        onMouseOver={(e) => e.target.style.backgroundColor = '#a71d2a'}
                                                        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                                                    >
                                                        <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
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
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
                    }}>
                        <div style={{
                            backgroundColor: '#fff', padding: '30px 40px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)', textAlign: 'center', width: '660px', maxWidth: '90%'
                        }}>
                            <h3>{popup.type === 'edit' ? 'Edit Capacity' : 'Add Capacity'}</h3>
                            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <div className="form-group">
                                    <label htmlFor="name">Capacity Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary">
                                        {popup.type === 'edit' ? 'Update' : 'Add'}
                                    </button>
                                    <button type="button" onClick={closeModal} className="btn btn-secondary">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default CapacityManagement;
