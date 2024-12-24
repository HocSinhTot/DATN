import React, { useState, useEffect } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Popup from './Popup';

const EvaluateManagement = () => {
    const [evaluateList, setEvaluateList] = useState([]);
    const [filteredEvaluates, setFilteredEvaluates] = useState([]);
    const [popup, setPopup] = useState({ show: false, message: '', onConfirm: null });
    const [filterStar, setFilterStar] = useState(null);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'star', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/evaluaes')
            .then((response) => response.json())
            .then((data) => {
                setEvaluateList(data);
                setFilteredEvaluates(data);
            })
            .catch((error) => console.error('Error fetching evaluate data:', error));
    }, []);

    const openPopup = (message, onConfirm) => {
        setPopup({ show: true, message, onConfirm });
    };

    const handleBlock = (id) => {
        openPopup('Bạn có chắc chắn đóng đánh giá này không?', () => {
            // Implement blocking functionality...
        });
    };

    const handleUnblock = (id) => {
        openPopup('Bạn có chắc chắn muốn duyệt đánh giá này không?', () => {
            // Implement unblocking functionality...
        });
    };

    const filterEvaluates = (star) => {
        // Implement filtering logic...
    };

    const handleSearch = (event) => {
        // Implement search functionality...
    };

    const handleSort = (key) => {
        // Implement sorting functionality...
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedEvaluates = filteredEvaluates.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate pagination numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredEvaluates.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // The button style definition
    const buttonStyle = {
        backgroundColor: "#404040",
        color: "#fff",
        padding: "5px 8px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)",
        transition: "all 0.3s ease",
    };

    return (
        <>
            {popup.show && (
                <Popup
                    message={popup.message}
                    onClose={() => setPopup({ show: false, message: '', onConfirm: null })}
                    onConfirm={popup.onConfirm}
                />
            )}
            <div className="be-wrapper be-fixed-sidebar">
                <div className="be-content">
                    <div className="container-fluid">
                        <div className="content">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>
                                        Quản lý đánh giá
                                    </h5>

                                    <div style={{ marginTop: '20px' }}>
                                        <button onClick={() => filterEvaluates("all")} style={buttonStyle}>Tất cả</button>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} onClick={() => filterEvaluates(star)} style={buttonStyle}>
                                                {star} Sao
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="card-body">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={handleSearch}
                                        placeholder="Tìm kiếm theo tên sản phẩm "
                                        style={{
                                            padding: "10px",
                                            fontSize: "16px",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd",
                                            width: "300px",
                                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                            transition: "border 0.3s ease, box-shadow 0.3s ease",
                                        }}
                                    />
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('id')} style={{ padding: '15px', textAlign: 'center' }}>
                                                    STT
                                                    {sortConfig.key === 'id' && (
                                                        <span>{sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('star')} style={{ padding: '15px', textAlign: 'center' }}>
                                                    Sao
                                                    {sortConfig.key === 'star' && (
                                                        <span>{sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />}</span>
                                                    )}
                                                </th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Hình ảnh</th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Bình luận</th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Tên sản phẩm</th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Tên người dùng</th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Trạng thái</th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedEvaluates.length > 0 ? (
                                                displayedEvaluates.map((evaluate) => (
                                                    <tr key={evaluate.id}>
                                                        <td>{evaluate.id}</td>
                                                        <td>{Array.from({ length: evaluate.star }, (_, i) => <i key={i} className="fa fa-star"></i>)}</td>
                                                        <td><img src={`${evaluate.img}`} alt="Product" width="100" height="100" /></td>
                                                        <td>{evaluate.comment}</td>
                                                        <td>{evaluate.product.name}</td>
                                                        <td>{evaluate.user.name}</td>
                                                        <td>{evaluate.status ? 'Mở' : 'Khóa'}</td>
                                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                                            {evaluate.status ? (
                                                                <button onClick={() => handleBlock(evaluate.id)} style={buttonStyle}>
                                                                    <i className="fa fa-lock" style={{ fontSize: '20px' }}></i>
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => handleUnblock(evaluate.id)} style={buttonStyle}>
                                                                    <i className="fa fa-unlock" style={{ fontSize: '20px' }}></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: 'center' }}>Không có đánh giá nào</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    
                                    {/* Pagination */}
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <nav>
                                            <ul className="pagination">
                                                {pageNumbers.map((number) => (
                                                    <li key={number} className="page-item">
                                                        <button
                                                            className="page-link"
                                                            onClick={() => paginate(number)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {number}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EvaluateManagement;