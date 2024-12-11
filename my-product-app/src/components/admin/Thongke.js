import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0); // Thêm state cho tổng số sản phẩm
    const [monthlyRevenue, setMonthlyRevenue] = useState([]); // Thêm state cho doanh thu hàng tháng
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        // Fetch total orders
        axios.get("http://localhost:8080/api/orders/total")
            .then((response) => {
                setTotalOrders(response.data);
            })
            .catch((error) => {
                console.error("Error fetching total orders:", error);
                setError("Failed to fetch total orders.");
            });

        // Fetch total customers
        axios.get("http://localhost:8080/api/orders/total-customers")
            .then((response) => {
                setTotalCustomers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching total customers:", error);
                setError("Failed to fetch total customers.");
            });

        // Fetch total users
        axios.get("http://localhost:8080/api/orders/total-users")
            .then((response) => {
                setTotalUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching total users:", error);
                setError("Failed to fetch total users.");
            });

        // Fetch total products
        axios.get("http://localhost:8080/api/orders/total-products")
            .then((response) => {
                setTotalProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching total products:", error);
                setError("Failed to fetch total products.");
            });

        // Fetch monthly revenue data
        axios.get("http://localhost:8080/api/orders/monthly-revenue")
            .then((response) => {
                const revenueData = new Array(12).fill(0); // Default to 0 for all months
                response.data.forEach((item) => {
                    const monthIndex = item[1] - 1; // Assuming month is in 1-12 range
                    revenueData[monthIndex] = item[2]; // Store the revenue in the corresponding month
                });
                setMonthlyRevenue(revenueData); // Update state with mapped revenue data
            })
            .catch((error) => {
                console.error("Error fetching monthly revenue:", error);
                setError("Failed to fetch monthly revenue.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    // Prepare chart data
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Monthly Revenue",
                data: monthlyRevenue.length === 12 ? monthlyRevenue : new Array(12).fill(0),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Revenue for the Year',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `Revenue: $${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Dashboard</h1>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : (
                <div>
                    <h2 style={{ textAlign: 'center' }}>Total Orders: {totalOrders}</h2>
                    <h2 style={{ textAlign: 'center' }}>Total Users: {totalUsers}</h2>
                    <h2 style={{ textAlign: 'center' }}>Total Products: {totalProducts}</h2>
                </div>
            )}

            <h3 style={{ textAlign: 'center' }}>Monthly Revenue (Bar Chart)</h3>
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

            <div className="chart-container" style={{ width: '80%', margin: '0 auto', height: '400px' }}>
                {monthlyRevenue.length === 12 ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <p style={{ textAlign: 'center', color: 'red' }}>No Data Available for Monthly Revenue</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
