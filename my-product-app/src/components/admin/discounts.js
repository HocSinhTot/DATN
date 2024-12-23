import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DiscountManagement = () => {
    const [discount, setDiscount] = useState([]);
    const [popup, setPopup] = useState({ show: false, type: '', discount: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page (5, 10, 15)
    const [currentPage, setCurrentPage] = useState(1); // Current page

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/discounts')
            .then((response) => response.json())
            .then((data) => setDiscount(data))
            .catch((error) => console.error('Lỗi khi lấy dữ liệu mã giảm giá:', error));
    }, []);

    const handleDelete = (id) => {
        setPopup({ show: true, type: 'delete', discount: { id } });
    };

    const confirmDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/admin/discounts/${id}`);
            if (response.status === 200) {
                alert('Xóa mã giảm giá thành công!');
                setDiscount(discount.filter((discount) => discount.id !== id));
            }
            closePopup();
        } catch (error) {
            console.error('Lỗi khi xóa mã giảm giá:', error);
        }
    };

    const closePopup = () => {
        setPopup({ show: false, type: '', discount: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const startDate = new Date(popup.discount.startDate);
        const endDate = new Date(popup.discount.endDate);

        if (startDate < currentDate) {
            alert('Ngày bắt đầu không được nhỏ hơn ngày hiện tại.');
            return;
        }

        if (endDate < startDate) {
            alert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu.');
            return;
        }

        try {
            const discountData = {
                code: popup.discount.code,
                value: popup.discount.value,
                startDate: popup.discount.startDate,
                endDate: popup.discount.endDate,
            };

            const method = popup.type === 'edit' ? 'PUT' : 'POST';
            const url =
                popup.type === 'edit'
                    ? `http://localhost:8080/api/admin/discounts/${popup.discount.id}`
                    : 'http://localhost:8080/api/admin/discounts';

            const response = await axios({
                method,
                url,
                data: JSON.stringify(discountData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 || response.status === 201) {
                alert(popup.type === 'edit' ? 'Cập nhật mã giảm giá thành công!' : 'Thêm mã giảm giá thành công!');
            }

            const updatedData = await axios.get('http://localhost:8080/api/admin/discounts');
            setDiscount(updatedData.data);
            closePopup();
        } catch (error) {
            console.error(`Lỗi khi ${popup.type === 'edit' ? 'cập nhật' : 'thêm'} mã giảm giá:`, error);
        }
    };

    // Lọc sản phẩm theo tên hoặc mã giảm giá
    const filteredDiscounts = discount.filter((discount) =>
        discount.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sắp xếp sản phẩm theo giá trị (thấp đến cao hoặc cao đến thấp)
    const sortedDiscounts = filteredDiscounts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.value - b.value;
        } else {
            return b.value - a.value;
        }
    });

    // Hàm reset các giá trị tìm kiếm và sắp xếp
    const handleReset = () => {
        setSearchQuery('');
        setSortOrder('asc');
    };

    // Phân trang
    const totalPages = Math.ceil(sortedDiscounts.length / itemsPerPage);
    const currentDiscounts = sortedDiscounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Xử lý sự thay đổi số lượng item trên mỗi trang
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value)); // Update the items per page value
        setCurrentPage(1); // Reset to page 1 when changing items per page
    };

    return (
        <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="be-content" style={{ width: '1300px' }}>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>
                                Quản lý mã giảm giá
                            </h5>

                            <button
                                className="btn btn-success mb-3"
                                onClick={() => setPopup({ show: true, type: 'add', discount: null })}
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
                                onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
                                onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
                            >
                                <i className="bi bi-plus-circle" style={{ fontSize: '32px' }}></i>
                            </button>
                        </div>
                        <div className="card-body">

                            <div className="d-flex" style={{ alignItems: "center", gap: "10px" }}>


                                <input
                                    type="text"
                                    placeholder="Nhập tên sản phẩm..."
                                    className="form-control"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: "10px",
                                        fontSize: "16px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        width: "300px",
                                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        transition: "border 0.3s ease, box-shadow 0.3s ease",
                                    }}
                                    onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
                                    onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
                                />
                                <button className="btn btn-primary" style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)", transition: "all 0.3s ease" }}>
                                    Tìm kiếm
                                </button>

                                <button onClick={() => handleReset()} className="btn btn-secondary" style={{ backgroundColor: "#6c757d", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", transition: "all 0.3s ease" }}>
                                    Đặt lại
                                </button>





                                <div className="page-size" style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                                    <button
                                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} // Toggle between 'asc' and 'desc'
                                        style={{
                                            backgroundColor: "#6c757d",
                                            color: "#fff",
                                            padding: "11px 23px",
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        {sortOrder === "asc" ? "Sắp xếp từ thấp đến cao" : "Sắp xếp từ cao đến thấp"}
                                    </button>

                                    <label htmlFor="pageSize" style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                                        Số sản phẩm mỗi trang:
                                    </label>
                                    <select id="pageSize" value={itemsPerPage}
                                        onChange={handleItemsPerPageChange} style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ddd", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </div>



                            </div>



                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>STT</th>
                                        <th style={{ textAlign: 'center' }}>Mã giảm giá</th>
                                        <th style={{ textAlign: 'center' }}>Giá trị</th>
                                        <th style={{ textAlign: 'center' }}>Ngày bắt đầu</th>
                                        <th style={{ textAlign: 'center' }}>Ngày kết thúc</th>
                                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentDiscounts.map((discount, index) => (
                                        <tr key={discount.id}>
                                            <td style={{ textAlign: 'center' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td style={{ textAlign: 'center' }}>{discount.code}</td>
                                            <td style={{ textAlign: 'center' }}>{discount.value}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                {new Date(discount.startDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {new Date(discount.endDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setPopup({ show: true, type: 'edit', discount })}
                                                    className="btn btn-warning"
                                                >
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(discount.id)}
                                                    className="btn btn-danger"
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>





                            {/* Phân trang */}
                            <div className="pagination" style={{ width: "100%", justifyContent: "center", paddingRight: "70px" }}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}

                                    style={{
                                        width: '105px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        padding: '12px 30px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                                        transition: 'all 0.3s ease',
                                        opacity: currentPage === 1 ? '0.5' : '1'
                                    }}
                                >
                                    <i className="bi bi-caret-left-square-fill"></i>
                                </button>

                                <span
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        textAlign: 'center',
                                        margin: '0 15px',
                                        padding: '8px 15px',
                                        borderRadius: '10px',
                                        backgroundColor: '#f0f0f0',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                        display: 'inline-block',
                                        minWidth: '80px'
                                    }}
                                >
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        padding: '12px 30px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        width: '106px',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 5px 10px rgba(0, 123, 255, 0.3)',
                                        transition: 'all 0.3s ease',
                                        opacity: currentPage === totalPages ? '0.5' : '1'
                                    }}
                                >
                                    <i className="bi bi-caret-right-square-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {popup.show && (
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '9999',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '30px 40px',
                            borderRadius: '16px',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                            textAlign: 'center',
                            width: '660px',
                            maxWidth: '90%',
                        }}
                    >
                        <h3 style={{ marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                            {popup.type === 'edit'
                                ? 'Sửa mã giảm giá'
                                : popup.type === 'delete'
                                    ? 'Xác nhận xóa'
                                    : 'Thêm mã giảm giá'}
                        </h3>

                        {popup.type !== 'delete' ? (
                            // Form for Add/Edit Discount
                            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <div className="form-group">
                                    <label htmlFor="name" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Mã giảm giá
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.code : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, code: e.target.value } })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="value" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Giá trị
                                    </label>
                                    <input
                                        type="number"
                                        id="value"
                                        name="value"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.value : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, value: e.target.value } })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="startDate" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Ngày bắt đầu
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.startDate : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, startDate: e.target.value } })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="endDate" style={{ fontWeight: 600, fontSize: '20px' }}>
                                        Ngày kết thúc
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        className="form-control"
                                        value={popup.discount ? popup.discount.endDate : ''}
                                        onChange={(e) =>
                                            setPopup({ ...popup, discount: { ...popup.discount, endDate: e.target.value } })
                                        }
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary">
                                        {popup.type === 'edit' ? 'Cập nhật' : 'Thêm'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={closePopup}>
                                        Đóng
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Delete Confirmation
                            <div>
                                <p>Bạn có chắc chắn muốn xóa mã giảm giá này không?</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button className="btn btn-danger" onClick={() => confirmDelete(popup.discount.id)}>
                                        Xóa
                                    </button>
                                    <button className="btn btn-secondary" onClick={closePopup}>
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountManagement;
