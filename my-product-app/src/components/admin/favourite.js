import React, { useState, useEffect } from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa'; // Thêm icon mũi tên

const UserManagement = () => {
    const [favouriteList, setFavouriteList] = useState([]);
    const [filteredFavourites, setFilteredFavourites] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');  // asc: ascending, desc: descending
    const [sortField, setSortField] = useState(''); // Trường sắp xếp

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/favourite') // API URL for fetching favourite list
            .then((response) => response.json())
            .then((data) => {
                setFavouriteList(data);
                setFilteredFavourites(data);  // Default to show all favourites
            })
            .catch((error) => console.error('Error fetching favourite data:', error));
    }, []);

    // Hàm tìm kiếm
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = favouriteList.filter((fav) => 
            fav.product.name.toLowerCase().includes(term.toLowerCase()) || 
            fav.user.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredFavourites(filtered);
        setCurrentPage(1);  // Reset to first page when search term changes
    };

    // Hàm sắp xếp
    const handleSort = (field) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setSortField(field);

        const sorted = [...filteredFavourites].sort((a, b) => {
            if (field === 'product') {
                return newSortOrder === 'asc'
                    ? a.product.name.localeCompare(b.product.name)
                    : b.product.name.localeCompare(a.product.name);
            }
            if (field === 'likes') {
                return newSortOrder === 'asc'
                    ? calculateLikes(a.product.id).count - calculateLikes(b.product.id).count
                    : calculateLikes(b.product.id).count - calculateLikes(a.product.id).count;
            }
            return 0;
        });
        setFilteredFavourites(sorted);
    };

    // Tính số lượng lượt thích và danh sách người dùng yêu thích mỗi sản phẩm
    const calculateLikes = (productId) => {
        const users = favouriteList.filter(fav => fav.product.id === productId);
        return {
            count: users.length,
            users: users.map(fav => fav.user.name).join(', ')  // Danh sách người dùng thích sản phẩm
        };
    };

    // Phân trang: Xác định các sản phẩm cần hiển thị trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFavourites.slice(indexOfFirstItem, indexOfLastItem);

    // Hàm chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Tổng số trang
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredFavourites.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="be-wrapper be-fixed-sidebar">
            <div className="be-content">
                <div className="container-fluid">
                    <div className="content">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý yêu thích</h5>
                            </div>
                            {/* Tìm kiếm ở dưới header */}
                            <div className="card-body">
                                <input
                                    type="text"
                                    value={searchTerm}
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
                                            <th style={{ padding: '15px', textAlign: 'center' }}>STT</th>
                                            <th 
                                                style={{ padding: '15px', textAlign: 'center', cursor: 'pointer' }}
                                                onClick={() => handleSort('product')}
                                            >
                                                Tên sản phẩm 
                                                {sortField === 'product' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                                            </th>
                                            <th 
                                                style={{ padding: '15px', textAlign: 'center', cursor: 'pointer' }}
                                                onClick={() => handleSort('likes')}
                                            >
                                                Số lượng lượt thích 
                                                {sortField === 'likes' && (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                                            </th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Danh sách người dùng thích</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.length > 0 ? (
                                            [...new Set(filteredFavourites.map(fav => fav.product.id))].map((productId, index) => {
                                                const { count, users } = calculateLikes(productId);
                                                const product = filteredFavourites.find(fav => fav.product.id === productId).product;
                                                
                                                return (
                                                    <tr key={productId}>
                                                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                                        <td>{product.name}</td>
                                                        <td style={{ textAlign: 'center' }}>{count}</td>
                                                        <td>{users || 'Không có người dùng thích'}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy yêu thích nào</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Phân trang */}
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
    );
};

export default UserManagement;
