import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [loading, setLoading] = useState(false);  // Add loading state
  const [error, setError] = useState(null);  // Add error state

  // Initialize years and months options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    // Fetch total orders when component mounts
    setLoading(true);
    axios.get("http://localhost:8080/api/orders/total")
      .then((response) => {
        setTotalOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching total orders:", error);
        setError("Failed to fetch total orders.");
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (selectedYear && selectedMonth) {
      setLoading(true);  // Start loading when fetching monthly revenue
      axios.get(`http://localhost:8080/api/orders/monthly-revenue?year=${selectedYear}&month=${selectedMonth}`)
        .then((response) => {
          if (response.data.length === 0) {
            setIsDataAvailable(false);
          } else {
            setIsDataAvailable(true);
            setMonthlyRevenue(response.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching monthly revenue:", error);
          setIsDataAvailable(false);
          setError("Failed to fetch monthly revenue.");
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Dashboard</h1>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>  // Display loading state
      ) : (
        <h2 style={{ textAlign: 'center' }}>Total Orders: {totalOrders}</h2>
      )}

      <div style={{ textAlign: 'center' }}>
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">--Select Year--</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label htmlFor="month">Select Month: </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">--Select Month--</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      <h3 style={{ textAlign: 'center' }}>Monthly Revenue</h3>
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}  {/* Display error message */}
      {isDataAvailable ? (
        <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Year</th>
              <th>Month</th>
              <th>Monthly Revenue</th>
            </tr>
          </thead>
          <tbody>
            {monthlyRevenue.map((data, index) => (
              <tr key={index}>
                <td>{data[0]}</td>
                <td>{data[1]}</td>
                <td>{data[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: 'red' }}>No Data Available</p>
      )}
    </div>
  );
};

export default Dashboard;
