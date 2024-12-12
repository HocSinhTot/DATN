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

    // Fetch total data
    axios.get("http://localhost:8080/api/orders/total")
      .then((response) => {
        setTotalOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total orders:", error);
        setError("Unable to fetch total orders.");
      });

    axios.get("http://localhost:8080/api/orders/total-users")
      .then((response) => {
        setTotalUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total users:", error);
        setError("Unable to fetch total users.");
      });

    axios.get("http://localhost:8080/api/orders/total-products")
      .then((response) => {
        setTotalProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total products:", error);
        setError("Unable to fetch total products.");
      });

    axios.get("http://localhost:8080/api/orders/total-revenue")
      .then((response) => {
        setTotalRevenue(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total revenue:", error);
        setError("Unable to fetch total revenue.");
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
        <title>Dashboard</title>
      </Helmet>

      <div className="container mt-5">

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="row mb-4">
            {/* Card for Orders */}
            <div className="col-md-3 mb-4">
              <div className="card shadow-lg p-4 text-center bg-gradient text-primary" style={{ width: '200px' }}>
                <i className="bi bi-cart-fill mb-3" style={{ fontSize: "2rem" }}></i>
                <h5 className="card-title">Tổng số đơn hàng</h5>
                <p className="card-text">{totalOrders}</p>
              </div>
            </div>
            {/* Card for Users */}
            <div className="col-md-3 mb-4">
              <div className="card shadow-lg p-4 text-center bg-gradient text-info" style={{ width: '200px' }}>
                <i className="bi bi-person-fill mb-3" style={{ fontSize: "2rem" }}></i>
                <h5 className="card-title">Tổng người dùng</h5>
                <p className="card-text">{totalUsers}</p>
              </div>
            </div>
            {/* Card for Products */}
            <div className="col-md-3 mb-4">
              <div className="card shadow-lg p-4 text-center bg-gradient text-warning" style={{ width: '200px' }}>
                <i className="bi bi-box-fill mb-3" style={{ fontSize: "2rem" }}></i>
                <h5 className="card-title">Tổng số sản phẩm</h5>
                <p className="card-text">{totalProducts}</p>
              </div>
            </div>
            {/* Card for Revenue */}
            <div className="col-md-3 mb-4">
              <div className="card shadow-lg p-4 text-center bg-gradient text-success">
                <i className="bi bi-currency-dollar mb-3" style={{ fontSize: "2rem" }}></i>
                <h5 className="card-title">Tổng doanh thu</h5>
                <p className="card-text">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .card {
          transition: all 0.3s ease;
          border-radius: 12px;
          background-color: #ffffff;
        }

        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }

        .card-title {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }

        .card-text {
          font-size: 24px;
          font-weight: 700;
        }

        .bg-gradient {
          background: linear-gradient(145deg, #f7f7f7, #e9e9e9);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .container {
          padding: 30px;
        }

        h1 {
          font-size: 36px;
          font-weight: bold;
          color: #34495e;
        }

        .spinner-border {
          color: #2ecc71;
        }

        .text-center {
          color: #2c3e50;
        }

        .row {
          margin-top: 30px;
        }

        .col-md-3 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
