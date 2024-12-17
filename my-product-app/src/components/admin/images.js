import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ImageManagement = () => {
  const [image, setImage] = useState([]);
  const [popup, setPopup] = useState({ show: false, type: "", image: null });
  const [products, setProducts] = useState([]); // Khởi tạo là mảng rỗng

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesRes, productRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/images"),
          axios.get("http://localhost:8080/api/admin/products"),
        ]);
  
        setImage(imagesRes.data);
        setProducts(Array.isArray(productRes.data) ? productRes.data : []); // Kiểm tra nếu dữ liệu là mảng
        console.log("Products:", productRes.data); // Kiểm tra xem dữ liệu sản phẩm có đầy đủ không
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDelete = (id) => {
    setPopup({ show: true, type: "delete", image: { id } });
  };

  const confirmDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/admin/images/${id}`
      );
      if (response.status === 200) {
        alert("Xóa hình ảnh thành công!");
        setImage(image.filter((image) => image.id !== id));
      }
      closePopup();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const closePopup = () => {
    setPopup({ show: false, type: "", image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("product_id", popup.image.product.id); // Thêm product_id
      formData.append("image", popup.image.file);

      const method = popup.type === "edit" ? "PUT" : "POST";
      const url =
        popup.type === "edit"
          ? `http://localhost:8080/api/admin/images/${popup.image.id}`
          : "http://localhost:8080/api/admin/images";

      const response = await axios({ method, url, data: formData });
      if (response.status === 200 || response.status === 201) {
        alert(
          popup.type === "edit"
            ? "Cập nhật hình ảnh thành công!"
            : "Thêm hình ảnh thành công!"
        );
      }

      const updatedData = await axios.get("http://localhost:8080/api/admin/images");
      setImage(updatedData.data);
      closePopup();
    } catch (error) {
      console.error(
        `Error ${popup.type === "edit" ? "updating" : "adding"} image:`,
        error
      );
    }
  };

  return (
    <div
      className="be-wrapper be-fixed-sidebar"
      style={{ justifyContent: "center", display: "flex" }}
    >
      <div className="be-content" style={{ width: "1100px" }}>
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5
                className="card-title m-0"
                style={{ fontSize: "30px", fontWeight: "700" }}
              >
                Quản lý hình ảnh
              </h5>
              <button
                className="btn btn-success mb-3"
                onClick={() =>
                  setPopup({ show: true, type: "add", image: null })
                }
                style={{
                  marginTop: "18px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "12px 30px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0 5px 10px rgba(40, 167, 69, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#218838")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
              >
                <i className="bi bi-plus-circle" style={{ fontSize: "32px" }}></i>
              </button>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>STT</th>
                    <th style={{ textAlign: "center" }}>Url</th>
                    <th style={{ textAlign: "center" }}>Hình ảnh</th>
                    <th style={{ textAlign: "center" }}>Sản phẩm</th>
                    <th style={{ width: "500px", textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {image.length > 0 ? (
                    image.map((image, index) => (
                      <tr key={image.id}>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          {image.url}
                        </td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          {image.product ? image.product.name : "N/A"}
                        </td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          <img
                            src={`/assets/images/${image.url}`}
                            alt="Image"
                            style={{ width: "100px", height: "auto" }}
                          />
                        </td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          <button
                            onClick={() =>
                              setPopup({ show: true, type: "edit", image })
                            }
                            style={{
                              backgroundColor: "#ffc107",
                              color: "#fff",
                              padding: "12px 30px",
                              borderRadius: "10px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: "bold",
                              boxShadow: "0 5px 10px rgba(255, 193, 7, 0.3)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = "#e0a800";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = "#ffc107";
                            }}
                          >
                            <i
                              className="bi bi-pencil"
                              style={{ fontSize: "20px" }}
                            ></i>
                          </button>

                          <button
                            onClick={() => handleDelete(image.id)}
                            style={{
                              marginLeft: "60px",
                              backgroundColor: "#dc3545",
                              color: "#fff",
                              padding: "12px 30px",
                              borderRadius: "10px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                              fontWeight: "bold",
                              boxShadow: "0 5px 10px rgba(220, 53, 69, 0.3)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = "#a71d2a";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = "#dc3545";
                            }}
                          >
                            <i
                              className="bi bi-trash"
                              style={{ fontSize: "20px" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        Không tìm thấy hình ảnh
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Popup for Add / Edit / Delete Image */}
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
              {popup.type === "edit"
                ? "Sửa hình ảnh"
                : popup.type === "delete"
                ? "Xác nhận xóa"
                : "Thêm hình ảnh"}
            </h3>

            {popup.type !== "delete" ? (
              <form
                onSubmit={handleSubmit}
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                <div className="form-group">
                  <label
                    htmlFor="image"
                    style={{ fontWeight: 600, fontSize: "20px" }}
                  >
                    Chọn hình ảnh
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPopup({ ...popup, image: { ...popup.image, file } });
                      }
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="product"
                    style={{ fontWeight: 600, fontSize: "20px" }}
                  >
                    Chọn sản phẩm
                  </label>
                  <select
  id="product"
  className="form-control"
  value={popup.image && popup.image.product ? popup.image.product.id : ""} // Đảm bảo đúng value
  onChange={(e) => {
    const selectedProduct = products.find(
      (product) => product.id === Number(e.target.value)  // Sử dụng Number() thay vì parseInt
    );
    setPopup({
      ...popup,
      image: { ...popup.image, product: selectedProduct }, // Cập nhật sản phẩm đã chọn
    });
  }}
  required
>
  <option value="">Chọn sản phẩm</option>
  {Array.isArray(products) &&
    products.map((product) => (
      <option key={product.id} value={product.id}>
        {product.name}
      </option>
    ))}
</select>

                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <button type="submit" className="btn btn-success">
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closePopup}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p>Bạn có chắc chắn muốn xóa hình ảnh này không?</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={() => confirmDelete(popup.image.id)}
                    className="btn btn-danger"
                  >
                    Xóa
                  </button>
                  <button
                    type="button"
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
  );
};

export default ImageManagement;
