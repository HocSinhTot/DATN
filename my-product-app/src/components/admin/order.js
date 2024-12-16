import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderManagement = () => {
  const [orderList, setOrderList] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const token = sessionStorage.getItem('token');

  // Set up headers for API requests
  const fetchOptions = (method, body = null) => ({
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Send token for authorization
    },
    body: body ? JSON.stringify(body) : null,
  });

  useEffect(() => {
    // Fetch orders and statuses
    fetch("http://localhost:8080/api/admin/orders", fetchOptions('GET'))
      .then((response) => response.json())
      .then((data) => {
        setOrderList(data);
        setFilteredOrders(data); // By default, show all orders
        updateStatusCount(data);
      })
      .catch((error) => console.error("Error fetching orders:", error));

    fetch("http://localhost:8080/api/admin/orders/orderStatuses")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStatuses(data);
        } else {
          console.error("Expected an array for statuses");
        }
      })
      .catch((error) => console.error("Error fetching order statuses:", error));
  }, []);

  const handleUpdateStatus = (orderId, statusId) => {
    // Gửi yêu cầu API để cập nhật trạng thái
    fetch(`http://localhost:8080/api/admin/orders/${orderId}/updateStatus`, fetchOptions('POST', { 
      orderId: orderId,
      statusId: statusId 
    }))
      .then((response) => {
        if (response.ok) {
          alert("Order status updated successfully!");
          
          // Cập nhật trạng thái mới ngay lập tức trong orderList (UI)
          const updatedOrders = orderList.map((order) =>
            order.id === orderId ? { ...order, orderStatus: { id: statusId } } : order
          );
          setOrderList(updatedOrders);
          
          // Cập nhật lại count trạng thái và filteredOrders
          updateStatusCount(updatedOrders);
          setFilteredOrders(updatedOrders);
        }
      })
      .catch((error) => console.error("Error updating order status:", error));
  };

  // Update status count for filter buttons
  const updateStatusCount = (orders) => {
    const count = {};
    orders.forEach((order) => {
      count[order.orderStatus.id] = (count[order.orderStatus.id] || 0) + 1;
    });
    setStatusCount(count);
  };

  // Filter orders by status
  const filterOrdersByStatus = (statusId) => {
    if (statusId === "all") {
      setFilteredOrders(orderList);
    } else {
      const filtered = orderList.filter((order) => order.orderStatus.id === statusId);
      setFilteredOrders(filtered);
    }
  };

  return (
    <div className="be-wrapper be-fixed-sidebar">
      <div className="be-content">
        <div className="container-fluid">
          <div className="content">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title m-0">Quản lý đơn hàng</h5>
              </div>
              <div className="card-body">
                {/* Filter Buttons */}
                <div className="status-filters">
                  <button onClick={() => filterOrdersByStatus("all")} style={buttonStyle}>
                    Tất cả ({orderList.length})
                  </button>
                  {statuses.map((status) => (
                    <button 
                      key={status.id}
                      onClick={() => filterOrdersByStatus(status.id)}
                      style={buttonStyle}
                    >
                      {status.status} ({statusCount[status.id] || 0})
                    </button>
                  ))}
                </div>

                {/* Orders Table */}
                <table className="table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên người dùng</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền</th>
                      <th>Địa chỉ</th>
                      <th>Phương thức thanh toán</th>
                      <th>Trạng thái</th>
                      <th>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order, index) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.user.name}</td>
                          <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                          <td>{order.total}</td>
                          <td>{order.address}</td>
                          <td>{order.paymentMethod.methods}</td>
                          <td>
  <select
    value={order.orderStatus.id}
    onChange={(e) => handleUpdateStatus(order.id, parseInt(e.target.value))}
    className="form-control"
  >
    {statuses.map((status) => {
      // Nếu trạng thái id <= trạng thái hiện tại thì không hiển thị
      // Đảm bảo luôn hiển thị trạng thái hiện tại của đơn hàng
      if (status.id === order.orderStatus.id) {
        return (
          <option key={status.id} value={status.id} disabled>
            {status.status} (Hiện tại)
          </option>
        );
      }
      // Hiển thị các trạng thái có thể thay đổi
      if (status.id > order.orderStatus.id) {
        return (
          <option key={status.id} value={status.id}>
            {status.status}
          </option>
        );
      }
      return null; // Ẩn các trạng thái đã qua
    })}
  </select>
</td>

                          <td>
                            <Link to={`/order/${order.id}/details`} className="btn btn-info">
                              Xem chi tiết
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          Không tìm thấy đơn hàng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button styling to avoid repetition
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

export default OrderManagement;
