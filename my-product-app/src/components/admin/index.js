import React from "react";

const index = () => {
  return (
    <div className="be-wrapper be-fixed-sidebar">
      {/* Header */}
      <nav className="navbar navbar-expand fixed-top be-top-header">
        <div className="container-fluid">
          <div className="be-navbar-header">
            <a className="navbar-brand" href="/admin"></a>
          </div>
          <div className="page-title">
            <a className="navbar-brand" href="/admin">
              Bảng Thống Kê
            </a>
          </div>
          <div className="be-right-navbar">
            <ul className="nav navbar-nav float-right be-user-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-toggle="dropdown"
                  role="button"
                  aria-expanded="false"
                >
                  <span className="user-name">Tên người dùng</span>
                </a>
                <div className="dropdown-menu" role="menu">
                  <div className="user-info">
                    <div style={{ color: "white" }}>
                      Xin chào, <span>Tên người dùng</span>!
                    </div>
                  </div>
                  <a className="dropdown-item" href="pages-profile.html">
                    <span className="icon mdi mdi-face"></span>Tài khoản
                  </a>
                  <a className="dropdown-item" href="#">
                    <span className="icon mdi mdi-settings"></span>Cài đặt
                  </a>
                  <a className="dropdown-item" href="/logoutadmin">
                    <span className="icon mdi mdi-power"></span>Đăng xuất
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="be-content">
        <div className="main-content container-fluid">
          <div className="row">
            <div className="col-12 col-lg-6 col-xl-3">
              <div className="widget widget-tile">
                <div className="chart sparkline" id="spark1"></div>
                <div className="data-info">
                  <div className="desc">Người dùng Mới</div>
                  <div className="value">
                    <span className="indicator indicator-equal mdi mdi-chevron-right"></span>
                    <span className="number">113</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Thêm các widget khác ở đây */}
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="widget widget-fullwidth be-loading">
                <div className="widget-head">
                  <span className="title">Chuyển động Gần đây</span>
                </div>
                <div className="widget-chart-container">
                  <div id="main-chart" style={{ height: "260px" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng */}
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="card card-table">
                <div className="card-header">
                  <div className="title">Mua hàng</div>
                </div>
                <div className="card-body table-responsive">
                  <table className="table table-striped table-borderless">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th className="number">Giá</th>
                        <th>Ngày</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Sony Xperia M4</td>
                        <td className="number">$149</td>
                        <td>23 Tháng 8, 2018</td>
                        <td className="text-success">Higi</td>
                      </tr>
                      {/* Thêm các hàng khác */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Thêm bảng khác nếu cần */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
