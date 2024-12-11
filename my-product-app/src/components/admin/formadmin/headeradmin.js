import React from "react";
import { Helmet } from "react-helmet";

export default function App() {
	const username = "Túpac Amaru"; // Define username here
	return (
		<div className="be-wrapper be-fixed-sidebar">
			<Helmet>
				{/* Metadata */}
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
				<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				<meta name="description" content="" />
				<meta name="author" content="" />
				<link rel="shortcut icon" href="assets/img/logo-fav.png" />

				<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" />



				<title>Beagle</title>

				{/* CSS Libraries */}
				<link rel="stylesheet" type="text/css" href="assets/lib/perfect-scrollbar/css/perfect-scrollbar.css" />
				<link rel="stylesheet" type="text/css"
					href="assets/lib/material-design-icons/css/material-design-iconic-font.min.css" />
				<link rel="stylesheet" type="text/css" href="assets/lib/jquery.vectormap/jquery-jvectormap-1.2.2.css" />
				<link rel="stylesheet" type="text/css" href="assets/lib/jqvmap/jqvmap.min.css" />
				<link rel="stylesheet" type="text/css" href="assets/lib/datetimepicker/css/bootstrap-datetimepicker.min.css" />
				<link rel="stylesheet" href="assets/css/app.css" type="text/css" />
				{/* Custom CSS */}
				<style jsx="true">
					{`
           body {
			background-color: #f8f9fa;
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 0;
		}

		.container {
			display: flex;
			flex-direction: row;
		}

		.sidebar {
			width: 250px;
			background-color: #343a40;
			padding-top: 60px;
			color: #fff;
			transition: width 0.3s;
		}

		.sidebar a {
			padding: 10px 20px;
			display: block;
			color: #fff;
			text-decoration: none;
			transition: all 0.3s ease;
		}

		.sidebar a:hover {
			background-color: #495057;
		}

		.content {
			flex-grow: 1;
			padding: 20px;
			transition: margin-left 0.3s;
		}

		.card {
			margin-bottom: 30px;
			border: none;
			border-radius: 10px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}

		.card-header {
			background-color: #007bff;
			color: #fff;
			border-radius: 10px 10px 0 0;
			padding: 15px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.card-body {
			padding: 20px;
		}

		.btn-primary,
		.btn-warning,
		.btn-danger {
			border-radius: 5px;
			transition: all 0.3s ease;
			background-color: #007bff;
			color: #fff;
			border: none;
			padding: 5px 10px;
			cursor: pointer;
			text-decoration: none;
			display: inline-block;
		}

		.btn-primary:hover,
		.btn-warning:hover,
		.btn-danger:hover {
			filter: brightness(90%);
		}

		table {
			width: 100%;
			border-collapse: collapse;
		}

		th,
		td {
			border: 1px solid #ddd;
			padding: 8px;
			text-align: left;
		}

		th {
			background-color: #007bff;
			color: #fff;
		}

		tbody tr:hover {
			background-color: #e2e6ea;
		}

		tbody tr:nth-child(even) {
			background-color: #f8f9fa;
		}

		tbody tr:nth-child(odd) {
			background-color: #e9ecef;
		}

		.table-row-hover:hover {
			transform: scale(1.05);
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			border-radius: 10px;
			transition: all 0.3s ease;
		}

		.user-img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			object-fit: cover;
		}

		.submenu {
			display: none;
			list-style: none;
			padding-left: 15px;
		}

		.has-submenu:hover .submenu {
			display: block;
			/* Hiển thị submenu khi di chuột vào mục có submenu */
		}

		.has-submenu>a {
			cursor: pointer;
		}
          `}
				</style>
			</Helmet>

			<div class="be-wrapper be-fixed-sidebar">

				<nav class="navbar navbar-expand fixed-top be-top-header">
					<div class="container-fluid">
						<div class="be-navbar-header">
							<a class="navbar-brand" href="/admin"></a>

							<div className="logo">

								<img style={{
									width: '120px',
									height: '111px', marginRight: "100px"
								}} src="/assets/images/banners/logo1.jpg" alt="logo" />

							</div>
						</div>
						<div class="page-title">
							<a class="navbar-brand" href="/admin">Bảng Thống Kê</a>
						</div>
						<div class="be-right-navbar">
							<ul class="nav navbar-nav float-right be-user-nav">
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" role="button" aria-expanded="false">
										<img src="assets/img/avatar.png" alt="Avatar" />
										<span className="user-name">{username || 'Túpac Amaru'}</span>
									</a>
									<div className="dropdown-menu" role="menu">
										<div className="user-info">
											{username && <div>Xin chào, <span>{username}</span>!</div>}
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
							<ul class="nav navbar-nav float-right be-icons-nav">
								<li class="nav-item dropdown"><a class="nav-link be-toggle-right-sidebar" href="#" role="button"
									aria-expanded="false"> <span class="icon mdi mdi-settings"></span>
								</a></li>
								<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#"
									data-toggle="dropdown" role="button" aria-expanded="false"> <span
										class="icon mdi mdi-notifications"></span> <span class="indicator"></span>
								</a>
									<ul class="dropdown-menu be-notifications">
										<li>
											<div class="title">
												Thông báo<span class="badge badge-pill">3</span>
											</div>
											<div class="list">
												<div class="be-scroller-notifications">
													<div class="content">
														<ul>
															<li class="notification notification-unread"><a href="#">
																<div class="image">
																	<img src="assets/img/avatar2.png" alt="Avatar" />
																</div>
																<div class="notification-info">
																	<div class="text">
																		<span class="user-name">Jessica
																			Caruso</span> đã
																		chấp
																		nhận lời mời của bạn tham gia nhóm.
																	</div>
																	<span class="date">2 phút trước</span>
																</div>
															</a></li>
															<li class="notification"><a href="#">
																<div class="image">
																	<img src="assets/img/avatar3.png" alt="Avatar" />
																</div>
																<div class="notification-info">
																	<div class="text">
																		<span class="user-name">Joel King</span>
																		đang theo
																		dõi
																		bạn
																	</div>
																	<span class="date">2 ngày trước</span>
																</div>
															</a></li>

														</ul>
													</div>
												</div>
											</div>
											<div class="footer">
												<a href="#">Xem tất cả thông báo</a>
											</div>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
			<div class="be-left-sidebar">
				<div class="left-sidebar-wrapper">
					<a class="left-sidebar-toggle" href="#">Bảng thống kê</a>
					<div class="left-sidebar-spacer">
						<div class="left-sidebar-scroll">
							<div class="left-sidebar-content">
								<ul class="sidebar-elements">
									<li class="divider">Menu</li>
									<li class="active"><a href="/admin"><i class="icon mdi mdi-home"></i><span>Trang
										chủ</span></a></li>
									<li><a href="/nguoidung"><i class="icon mdi mdi-view-list"></i><span>Quản lý người
										dùng</span></a></li>
									<li class="has-submenu"><a href="#"><i class="icon mdi mdi-view-list"></i><span>Quản
										lý sản
										phẩm</span></a>
										<ul class="submenu">
											<li><a href="/products"><span>Quản lý sản phẩm</span></a></li>
											<li><a href="/products-prices"><span>Quản lý sản phẩm dung lượng</span></a></li>
											<li><a href="/products-images"><span>Quản lý sản phẩm hình ảnh</span></a></li>
											<li><a href="/category"><span>Quản lý danh mục</span></a></li>
											<li><a href="/brands"><span>Quản lý thương hiệu</span></a></li>
											<li><a href="/color"><span>Quản lý màu</span></a></li>
											<li><a href="/capacity"><span>Quản lý dung
												lượng</span></a></li>
											<li><a href="/images"><span>Quản lý hình ảnh</span></a></li>
										</ul>
									</li>
									<li><a href="/order"><i class="icon mdi mdi-view-list"></i><span>Quản
										lý đơn hàng</span></a></li>
									<li><a href="evaluaes"><i class="icon mdi mdi-view-list"></i><span>Quản
										lý đánh giá</span></a></li>
									<li><a href="favourite"><i class="icon mdi mdi-view-list"></i><span>Quản
										lý yêu thích</span></a></li>
									<li class="divider">Thống kê</li>
									<li><a href="totalRevenue"><i class="icon mdi mdi-chart-donut"></i><span>Doanh
										thu</span></a></li>
									<li><a href="#"><i class="icon mdi mdi-chart-donut"></i><span>Tồn
										kho</span></a></li>
								</ul>

							</div>
						</div>
					</div>
					<div class="progress-widget">
						<div class="progress-data">
							<span class="progress-value">60%</span> <span class="name">Đã
								hoàn thành</span>
						</div>
						<div class="progress">
							<div class="progress-bar progress-bar-primary"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
