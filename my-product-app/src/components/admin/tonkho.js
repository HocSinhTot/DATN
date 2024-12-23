import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/products/stock"; // URL API backend

const Tonkho = () => {
    const [products, setProducts] = useState([]); // Danh sách sản phẩm
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Lỗi
    const [popup, setPopup] = useState({
        show: false,
        type: "",
        product: { id: "", name: "", quantity: "" }
    }); // Popup state
    const [searchTerm, setSearchTerm] = useState(""); // Dữ liệu tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [pageSize, setPageSize] = useState(5); // Số sản phẩm mỗi trang
    const [sortOrder, setSortOrder] = useState("asc"); // Mặc định là sắp xếp tăng dần

    // Lấy dữ liệu tồn kho với phân trang, tìm kiếm và sắp xếp
    const fetchProductsInStock = async () => {
        try {
            const response = await axios.get(`${API_URL}?page=${currentPage - 1}&size=${pageSize}&searchTerm=${searchTerm}&sortOrder=${sortOrder}`);
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setError("Không thể lấy dữ liệu sản phẩm tồn kho.");
            console.error("Lỗi tải dữ liệu:", error);
            alert("Lỗi tải dữ liệu sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    // Hàm tìm kiếm
    const handleSearch = () => {
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
        fetchProductsInStock();
    };

    // Đặt lại tìm kiếm
    const handleReset = () => {
        setSearchTerm("");
        setPageSize(5);
        setSortOrder("asc");
        setCurrentPage(1);
    };

    // Chuyển đổi thứ tự sắp xếp
    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    // Thay đổi số lượng sản phẩm mỗi trang
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset về trang đầu khi thay đổi số lượng sản phẩm mỗi trang
    };

    useEffect(() => {
        fetchProductsInStock();
    }, [currentPage, searchTerm, pageSize, sortOrder]); // Khi trang, tìm kiếm, số lượng sản phẩm mỗi trang hoặc sắp xếp thay đổi, gọi lại API

    // Cập nhật sản phẩm
    const updateProduct = async (updatedProduct) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/products/${updatedProduct.id}`, updatedProduct);
            setProducts(products.map((p) => (p.id === updatedProduct.id ? response.data : p)));
            setPopup({ show: false });
            alert("Cập nhật sản phẩm thành công!");
        } catch (error) {
            alert("Không thể cập nhật sản phẩm!");
        }
    };

    // Xóa sản phẩm
    const deleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`);
            setProducts(products.filter((product) => product.id !== id));
            setPopup({ show: false });
            alert("Xóa sản phẩm thành công!");
        } catch (error) {
            alert("Không thể xóa sản phẩm!");
        }
    };

    // Kiểm tra dữ liệu đang tải
    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    // Đóng popup
    const closePopup = () => {
        setPopup({ show: false });
    };

    return (
        <div className="be-wrapper be-fixed-sidebar" style={{ justifyContent: 'center', display: 'flex' }}>
            <div className="be-content" style={{ width: '1300px' }}>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title m-0" style={{ fontSize: '30px', fontWeight: '700' }}>Quản lý Tồn Kho</h5>

                            {/* Tìm kiếm */}

                        </div>

                        {/* Hiển thị lỗi nếu có */}
                        {error && <p style={{ color: "red" }}>{error}</p>}

                        {/* Bảng sản phẩm */}
                        <div className="card-body">
                            <div className="d-flex" style={{ alignItems: "center", gap: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Nhập tên sản phẩm..."
                                    className="form-control"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                <button onClick={handleSearch} className="btn btn-primary" style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(0, 123, 255, 0.3)", transition: "all 0.3s ease" }}>
                                    Tìm kiếm
                                </button>
                                <button onClick={() => handleReset()} className="btn btn-secondary" style={{ backgroundColor: "#6c757d", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", transition: "all 0.3s ease" }}>
                                    Đặt lại
                                </button>




                                <div className="page-size" style={{ display: "flex", alignItems: "center", gap: "10px" }}>


                                    <button onClick={toggleSortOrder} style={{ backgroundColor: "#6c757d", color: "#fff", padding: "11px 23px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold", boxShadow: "0 5px 10px rgba(108, 117, 125, 0.3)", transition: "all 0.3s ease" }}>
                                        {sortOrder === "asc" ? "Sắp xếp từ thấp đến cao" : "Sắp xếp từ cao đến thấp"}
                                    </button>

                                    <label htmlFor="pageSize" style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                                        Số sản phẩm mỗi trang:
                                    </label>
                                    <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} style={{ padding: "10px", fontSize: "16px", borderRadius: "8px", border: "1px solid #ddd", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", cursor: "pointer" }}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </div>
                            </div>
                            <table className="table mt-3">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.id}</td>
                                                <td>{product.name}</td>
                                                <td>{product.quantity}</td>
                                                <td>



                                                    <button
                                                        onClick={() => setPopup({ show: true, type: "edit", product })}


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
                                                        onMouseOver={(e) => {
                                                            e.target.style.backgroundColor = '#e0a800';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.backgroundColor = '#ffc107';
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil" style={{ fontSize: '20px' }}></i>
                                                    </button>

                                                    <button
                                                        onClick={() => setPopup({ show: true, type: "delete", product })}
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
                                                        onMouseOver={(e) => {
                                                            e.target.style.backgroundColor = '#a71d2a';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.backgroundColor = '#dc3545';
                                                        }}
                                                    >
                                                        <i className="bi bi-trash" style={{ fontSize: '20px' }}></i>
                                                    </button>


                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">Không có sản phẩm nào trong kho.</td>
                                        </tr>
                                    )}
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

                            {/* Popup */}
                            {popup.show && (
                                <div
                                    style={{
                                        position: "fixed",
                                        top: "0",
                                        left: "0",
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: "9999",
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: "#fff",
                                            padding: "30px 40px",
                                            borderRadius: "16px",
                                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                                            textAlign: "center",
                                            width: "660px",
                                            maxWidth: "90%",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                marginBottom: "25px",
                                                fontSize: "22px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {popup.type === "edit" ? "Sửa sản phẩm" : "Xóa sản phẩm"}
                                        </h3>

                                        {popup.type === "edit" && (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    updateProduct(popup.product);
                                                }}
                                                style={{ maxWidth: "600px", margin: "0 auto" }}
                                            >
                                                <div className="form-group">
                                                    <label htmlFor="name" style={{ fontWeight: 600, fontSize: "20px" }}>
                                                        Tên sản phẩm
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        className="form-control"
                                                        value={popup.product.name}
                                                        onChange={(e) =>
                                                            setPopup({
                                                                ...popup,
                                                                product: { ...popup.product, name: e.target.value },
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="quantity" style={{ fontWeight: 600, fontSize: "20px" }}>
                                                        Số lượng
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="quantity"
                                                        className="form-control"
                                                        value={popup.product.quantity}
                                                        onChange={(e) =>
                                                            setPopup({
                                                                ...popup,
                                                                product: { ...popup.product, quantity: e.target.value },
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    <button type="submit" className="btn btn-success">
                                                        Cập nhật
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={closePopup}
                                                    >
                                                        Đóng
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {popup.type === "delete" && (
                                            <div>
                                                <p>
                                                    Bạn có chắc chắn muốn xóa sản phẩm{" "}
                                                    <strong>{popup.product.name}</strong> không?
                                                </p>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => deleteProduct(popup.product.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={closePopup}
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tonkho;
