import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderManagement = () => {
  const [orderList, setOrderList] = useState([]);
  const [statuses, setStatuses] = useState([]); // Make sure this is an array
  const [filteredOrders, setFilteredOrders] = useState([]); // State cho đơn hàng đã lọc
  const [statusCount, setStatusCount] = useState({}); // Đếm số lượng đơn hàng theo từng trạng thái
  useEffect(() => {
    // Fetch all orders and statuses from the API
    fetch("http://localhost:8080/api/orders") // API URL for orders
      .then((response) => response.json())
      .then((data) => {
        setOrderList(data);
        setFilteredOrders(data); // Mặc định là hiển thị tất cả đơn hàng
        updateStatusCount(data); // Cập nhật số lượng đơn hàng theo trạng thái
      })
      .catch((error) => console.error("Error fetching orders:", error));
      fetch("http://localhost:8080/api/orders/orderStatuses") // API URL for order statuses
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
    // Cập nhật API để gửi đúng URL với orderId
    fetch(`http://localhost:8080/api/orders/${orderId}/updateStatus`, {
        method: "POST",
        body: JSON.stringify({ statusId }), // Chỉ gửi statusId
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => {
            if (response.ok) {
                alert("Order status updated successfully!");
                setOrderList(
                    orderList.map((order) =>
                        order.id === orderId
                            ? { ...order, orderStatus: { id: statusId } }
                            : order
                    )
                );
            }
        })
        .catch((error) => console.error("Error updating order status:", error));
};
// Cập nhật số lượng đơn hàng theo từng trạng thái
const updateStatusCount = (orders) => {
  const count = {};
  orders.forEach((order) => {
    count[order.orderStatus.id] = (count[order.orderStatus.id] || 0) + 1;
  });
  setStatusCount(count);
};

// Hàm lọc đơn hàng theo trạng thái
const filterOrdersByStatus = (statusId) => {
  if (statusId === "all") {
    setFilteredOrders(orderList); // Nếu chọn "Tất cả", hiển thị tất cả đơn hàng
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
              <Link to="/order/add" className="btn btn-light">
                Thêm mới
              </Link>
            </div>
            <div className="card-body">
              {/* Hiển thị các ô trạng thái */}
              <div className="status-filters">
                <button onClick={() => filterOrdersByStatus("all")}>
                  Tất cả ({orderList.length})
                </button>
                {statuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => filterOrdersByStatus(status.id)}
                  >
                    {status.status} ({statusCount[status.id] || 0})
                  </button>
                ))}
              </div>

              {/* Hiển thị bảng đơn hàng */}
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
                        <td>{order.date}</td>
                        <td>{order.total}</td>
                        <td>{order.address}</td>
                        <td>{order.paymentMethod.methods}</td>
                        <td>
                          <select
                            value={order.orderStatus.id} // Hiển thị trạng thái hiện tại
                            onChange={(e) =>
                              handleUpdateStatus(order.id, parseInt(e.target.value))
                            }
                            className="form-control"
                          >
                            {Array.isArray(statuses) && statuses.length > 0 ? (
                              statuses.map((status) => (
                                <option key={status.id} value={status.id}>
                                  {status.status}
                                </option>
                              ))
                            ) : (
                              <option value="">No statuses available</option>
                            )}
                          </select>
                        </td>
                        <td>
                          <Link
                            to={`/order/${order.id}/details`}
                            className="btn btn-info"
                          >
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

export default OrderManagement;
