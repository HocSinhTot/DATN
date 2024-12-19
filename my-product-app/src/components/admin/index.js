import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Bar, Pie } from 'react-chartjs-2'; // Import Pie ở đây
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Đăng ký tất cả các thành phần của Chart.js chỉ một lần
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2023); // Default year
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalQuantityByCategory, setTotalQuantityByCategory] = useState({});

  useEffect(() => {
    setLoading(true);

    // Fetch total data
    axios.get("http://localhost:8080/api/orders/total")
      .then((response) => setTotalOrders(response.data))
      .catch((error) => {
        console.error("Error fetching total orders:", error);
        setError("Unable to fetch total orders.");
      });

    axios.get("http://localhost:8080/api/orders/total-users")
      .then((response) => setTotalUsers(response.data))
      .catch((error) => {
        console.error("Error fetching total users:", error);
        setError("Unable to fetch total users.");
      });

    axios.get("http://localhost:8080/api/orders/total-products")
      .then((response) => setTotalProducts(response.data))
      .catch((error) => {
        console.error("Error fetching total products:", error);
        setError("Unable to fetch total products.");
      });

    axios.get("http://localhost:8080/api/orders/total-revenue")
      .then((response) => setTotalRevenue(response.data))
      .catch((error) => {
        console.error("Error fetching total revenue:", error);
        setError("Unable to fetch total revenue.");
      });

    // Fetch monthly revenue data
    axios.get(`http://localhost:8080/api/orders/monthly-revenue?year=${selectedYear}`)
      .then((response) => setMonthlyRevenue(response.data))
      .catch((error) => {
        console.error("Error fetching monthly revenue:", error);
        setError("Unable to fetch monthly revenue.");
      })
      .finally(() => {
        setLoading(false);
      });



  }, [selectedYear]); // Refetch data when the selected year changes

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: monthlyRevenue.map((data) => `Tháng ${data[1]}`), // Tên tháng
    datasets: [
      {
        label: 'Tổng giá trị',
        data: monthlyRevenue.map((data) => data[3]), // Giá trị doanh thu
        backgroundColor: (context) => {
          const value = context.raw;
          return value > 500000 ? '#6a5acd' : '#f79c42'; // Thay đổi màu sắc theo giá trị
        },
        borderColor: '#ffffff', // Màu viền trắng
        borderWidth: 1.5, // Viền đẹp hơn
        hoverBackgroundColor: '#ff5733', // Màu khi hover
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2,
      },
    ],
  };


  //biểu đồ %
  const [chartDatas, setChartData] = useState({
    labels: [], // Sẽ được cập nhật từ API
    datasets: [
      {
        data: [], // Dữ liệu phần trăm sẽ được cập nhật từ API
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A6'],  // Màu sắc cho các phân đoạn

        hoverOffset: 4,
      },
    ],
  });

  // useEffect để gọi API và lấy dữ liệu khi component được mount
  useEffect(() => {
    axios.get('http://localhost:8080/api/orders/total-by-category') // Đảm bảo đúng URL của API
      .then(response => {
        const data = response.data;  // Dữ liệu nhận từ API
        const labels = data.map(item => item[0]); // Lấy tên danh mục (category) từ API
        const percentages = data.map(item => item[1]); // Lấy phần trăm từ API

        // Cập nhật chartData với dữ liệu từ API
        setChartData({
          labels: labels,  // Cập nhật labels
          datasets: [
            {
              data: percentages,  // Cập nhật dữ liệu phần trăm
              backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A6'],  // Màu sắc cho các phân đoạn
              hoverOffset: 4,
            },
          ],
        });
      }).catch(error => {
        console.error('Có lỗi xảy ra khi lấy dữ liệu:', error);
      });
  }, []); // Chỉ gọi API khi component mount // Tùy chọn cho biểu đồ
  const chartOptionss = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',  // Vị trí của legend
        labels: {
          boxWidth: 10, // Điều chỉnh kích thước hộp màu của các mục trong legend
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            // Hiển thị phần trăm trong tooltip
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
    },
  };




  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Doanh thu hàng tháng năm ${selectedYear}`,
        font: {
          size: 18,
          weight: 'bold',
          family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        color: '#2c3e50', // Màu chữ tiêu đề
      },
      tooltip: {
        backgroundColor: '#2c3e50', // Màu nền của tooltip
        titleColor: '#ffffff', // Màu tiêu đề tooltip
        bodyColor: '#ffffff', // Màu nội dung tooltip
        footerColor: '#ffffff', // Màu footer tooltip
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tháng',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          },
          color: '#2c3e50',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tổng giá trị (VND)',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          },
          color: '#2c3e50',
        },
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
          color: '#2c3e50', // Màu cho các giá trị trên trục y
        },
      },
    },
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

      <div className="container mt-5" style={{ marginRight: '120px' }}>
        {loading ? (
          <div className="d-flex justify-content-center" >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            {/* Các card thông tin */}
            <div className="row mb-4">
              <div className="col-md-3 mb-4">
                <div className="card shadow-lg p-4 text-center bg-gradient text-primary" style={{ width: '230px', height: '135px' }}>
                  <i className="bi bi-cart-fill mb-3" style={{ fontSize: "2rem" }}></i>
                  <h5 className="card-title">Tổng số đơn hàng</h5>
                  <p className="card-text">{totalOrders}</p>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card shadow-lg p-4 text-center bg-gradient text-info" style={{ width: '230px', height: '135px' }}>
                  <i className="bi bi-person-fill mb-3" style={{ fontSize: "2rem" }}></i>
                  <h5 className="card-title">Tổng người dùng</h5>
                  <p className="card-text">{totalUsers}</p>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card shadow-lg p-4 text-center bg-gradient text-warning" style={{ width: '230px', height: '135px' }}>
                  <i className="bi bi-box-fill mb-3" style={{ fontSize: "2rem" }}></i>
                  <h5 className="card-title">Tổng số sản phẩm</h5>
                  <p className="card-text">{totalProducts}</p>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="card shadow-lg p-4 text-center bg-gradient text-success" style={{ width: '230px', height: '135px' }}>
                  <i className="bi bi-currency-dollar mb-3" style={{ fontSize: "2rem" }}></i>
                  <h5 className="card-title">Tổng doanh thu</h5>
                  <p className="card-text">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </div>

            {/* Year Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="yearSelect"
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2d3436',
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  marginBottom: '8px',
                  padding: '5px 10px',
                }}
                onMouseEnter={(e) => e.target.style.color = '#f79c42'} // Màu chữ khi hover
                onMouseLeave={(e) => e.target.style.color = '#2d3436'} // Màu chữ khi bỏ chuột
              >
                Chọn năm:
              </label>
              <select
                id="yearSelect"
                className="form-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  fontSize: '14px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#333',
                  width: '200px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#f79c42'; // Viền khi hover
                  e.target.style.boxShadow = '0 8px 12px rgba(255, 152, 0, 0.3)'; // Tạo bóng đổ khi hover
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#ccc'; // Viền khi bỏ chuột
                  e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Bóng đổ nhẹ khi không hover
                }}
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <div
              className="mb-4"
              style={{
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                marginBottom: '30px',
                cursor: 'default',  // Bỏ hiệu ứng con trỏ chuột dạng pointer
                display: 'flex',  // Sử dụng Flexbox để đặt 2 biểu đồ nằm bên cạnh nhau
                justifyContent: 'space-between', // Đảm bảo các phần tử được căn đều
              }}
            >
              {/* Biểu đồ cột doanh thu hàng tháng */}
              <div
                className="mb-4"
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  padding: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  marginBottom: '30px',
                  cursor: 'default',  // Bỏ hiệu ứng con trỏ chuột dạng pointer

                  width: '73%',
                }}
              >
                <Bar data={chartData} options={chartOptions} />
              </div>


              <div className="row justify-content-center">
                <div className="col-md-12 d-flex justify-content-center" style={{ marginTop: '-29px', marginBottom: '18px' }}>

                  {/* Chỉ hiển thị biểu đồ tròn mà không hiển thị các thông tin chi tiết */}
                  <div style={{ width: '100%', height: '400px' }}>
                    <Pie data={chartDatas} optionss={chartOptionss} />
                  </div>
                </div>
              </div>
            </div>
          </div>


        )}
      </div>
      <style>{`

      /* Thẻ chứa biểu đồ */
.row {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.col-md-12 {
  width: 100%;
  max-width: 400px; /* Giới hạn kích thước chiều rộng tối đa của biểu đồ */
  padding: 20px;
  background: linear-gradient(135deg, #ffffff, #f7f7f7); /* Gradient nền đẹp */
  border-radius: 15px; /* Bo góc */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  transition: all 0.3s ease; /* Hiệu ứng chuyển động khi hover */
}

.col-md-12:hover {
  transform: scale(1.05); /* Phóng to khi hover */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Tăng bóng khi hover */
}

.col-md-12 .chart-container {
  width: 100%;
  height: 250px; /* Tăng chiều cao biểu đồ */
  border-radius: 10px; /* Bo góc cho biểu đồ */
  background: #ffffff; /* Nền trắng cho biểu đồ */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ cho biểu đồ */
  display: flex;
  justify-content: center;
  align-items: center; /* Căn giữa biểu đồ */
}

/* Biểu tượng hoặc hình ảnh có thể được thêm vào trước biểu đồ */
.bi-boxes {
  color: #FF5733; /* Màu sắc cho biểu tượng */
  font-size: 2.5rem; /* Kích thước lớn cho biểu tượng */
  margin-bottom: 15px;
  transition: transform 0.3s ease; /* Hiệu ứng quay khi hover */
}

.bi-boxes:hover {
  transform: rotate(360deg); /* Quay khi hover */
}

/* Phần padding và khoảng cách giữa các phần tử */
.mb-4 {
  margin-bottom: 25px;
}

        .card {
          transition: all 0.3s ease;
          border-radius: 12px;
          background-color: #ffffff;
        }

        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }

        .card-title {
          font-size: 18px;
          font-weight: bold;
          color: #ffffff;
        }

        .card-text {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }

        .text-primary {
          background: linear-gradient(145deg, #4facfe, #00f2fe);
          color: #ffffff;
        }

        .text-info {
          background: linear-gradient(145deg, #43e97b, #38f9d7);
          color: #ffffff;
        }

        .text-warning {
          background: linear-gradient(145deg, #fbc2eb, #a6c1ee);
          color: #ffffff;
        }

        .text-success {
          background: linear-gradient(145deg, #f7971e, #ffd200);
          color: #ffffff;
        }

        .bg-gradient {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .container {
          padding: 30px;
        }

        h1 {
          font-size: 36px;
          font-weight: bold;
          color: #2d3436;
        }

        .spinner-border {
          color: #27ae60;
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
