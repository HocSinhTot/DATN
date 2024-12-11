import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Lấy tổng số đơn hàng
    axios.get("http://localhost:8080/api/orders/total")
      .then((response) => {
        setTotalOrders(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy tổng số đơn hàng:", error);
        setError("Không thể lấy tổng số đơn hàng.");
      });

    // Lấy tổng số người dùng
    axios.get("http://localhost:8080/api/orders/total-users")
      .then((response) => {
        setTotalUsers(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy tổng số người dùng:", error);
        setError("Không thể lấy tổng số người dùng.");
      });

    // Lấy tổng số sản phẩm
    axios.get("http://localhost:8080/api/orders/total-products")
      .then((response) => {
        setTotalProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy tổng số sản phẩm:", error);
        setError("Không thể lấy tổng số sản phẩm.");
      });

    // Lấy tổng doanh thu
    axios.get("http://localhost:8080/api/orders/total-revenue")
      .then((response) => {
        setTotalRevenue(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy tổng doanh thu:", error);
        setError("Không thể lấy tổng doanh thu.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Format the revenue to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="be-wrapper be-fixed-sidebar">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <link rel="shortcut icon" href="assets/img/logo-fav.png" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />
        <title>Bảng điều khiển Beagle</title>
      </Helmet>

      <div className="container mt-5">
        <h1 className="text-center mb-5" style={{ fontSize: '36px', color: '#333' }}>Trang Quản lý</h1>

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="row mb-4">
              {/* Card for Orders */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm p-4 text-center">
                  <h5 className="card-title">Tổng số đơn hàng</h5>
                  <p className="card-text">{totalOrders}</p>
                </div>
              </div>
              {/* Card for Users */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm p-4 text-center">
                  <h5 className="card-title">Tổng số người dùng</h5>
                  <p className="card-text">{totalUsers}</p>
                </div>
              </div>
              {/* Card for Products */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm p-4 text-center">
                  <h5 className="card-title">Tổng số sản phẩm</h5>
                  <p className="card-text">{totalProducts}</p>
                </div>
              </div>
              {/* Card for Revenue */}
              <div className="col-md-3 mb-4">
                <div className="card shadow-sm p-4 text-center" style={{
                  width: '214px',
                  height: '107px'
                }}>
                  <h5 className="card-title">Tổng doanh thu</h5>
                  <p className="card-text">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .card {
          transition: all 0.3s ease;
          border-radius: 12px;
        }

        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        h1 {
          font-size: 36px;
          font-weight: bold;
          color: #2c3e50;
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
          color: #34495e;
        }

        .card-shadow {
          box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        }

        .container {
          padding: 40px;
        }

        .spinner-border {
          color: #4CAF50;
        }

        .card-text {
          font-size: 26px;
          font-weight: 700;
          color: #1abc9c;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
