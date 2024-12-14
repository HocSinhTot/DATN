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
			background-color:rgb(226, 234, 231);
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

/* Hover effect for li */
.left-sidebar-wrapper .sidebar-elements li:hover {
  background-color: #34495e !important; /* Màu xám đậm sang trọng khi hover vào li */
}

/* Hover effect for a inside li */
.left-sidebar-wrapper .sidebar-elements li a:hover {
  background-color: #2c3e50 !important; /* Màu xám xanh đậm khi hover vào a */
  color: #ecf0f1 !important; /* Màu chữ trắng nhạt (gần trắng ngà) */
}

/* Hover effect for active li and a */
.left-sidebar-wrapper .sidebar-elements li.active:hover {
  background-color: #1abc9c !important; /* Màu xanh ngọc nhạt khi hover vào li.active */
}

/* Transition cho hiệu ứng */
.left-sidebar-wrapper .sidebar-elements li, 
.left-sidebar-wrapper .sidebar-elements li a {
  transition: background-color 0.3s ease !important, color 0.3s ease !important;
}
.be-content{
padding-top:100px;}

.card-header{
background: linear-gradient(90deg, rgb(44, 62, 80), rgb(52, 73, 94));
}

th{
background: linear-gradient(90deg, rgb(44, 62, 80), rgb(52, 73, 94));}


		
          `}
				</style>
			</Helmet>

			<div class="be-wrapper be-fixed-sidebar">

				<nav className="navbar navbar-expand fixed-top be-top-header" style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
					<div className="container-fluid" style={{ background: 'linear-gradient(90deg, #2c3e50, #34495e)', color: 'white' }}>
						{/* Logo */}
						<div className="be-navbar-header d-flex align-items-center">
							<a className="navbar-brand" href="/admin"></a>
							<div className="logo">
								<img
									style={{
										width: '100px',
										height: '100px',
										marginRight: '20px',
										borderRadius: '50%',
										objectFit: 'cover',
									}}
									src="/assets/images/banners/logo1.jpg"
									alt="logo"
								/>
							</div>
						</div>

						{/* Title */}
						<div className="page-title text-center">
							<a
								className="navbar-brand"
								href="/admin"
								style={{ fontSize: '24px', color: 'white', fontWeight: '700', textTransform: 'uppercase' }}
							>
								Chào mừng đến với trang Admin
							</a>
						</div>

						{/* User Info */}
						<div className="be-right-navbar">
							<ul className="nav navbar-nav float-right be-user-nav">
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										href="#"
										data-toggle="dropdown"
										role="button"
										aria-expanded="false"
										style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}
									>
										<img
											src="assets/img/avatar.png"
											alt="Avatar"
											style={{ width: '40px', height: '40px', borderRadius: '50%' }}
										/>
										<span className="user-name" style={{ fontSize: '16px', fontWeight: '500' }}>{username || 'Túpac Amaru'}</span>
									</a>
									<div className="dropdown-menu dropdown-menu-right" role="menu">
										<div className="user-info p-3" style={{ backgroundColor: '#34495e', color: 'white', textAlign: 'center' }}>
											{username && <div>Xin chào, <span>{username}</span>!</div>}
										</div>
										<a className="dropdown-item" href="pages-profile.html" style={{ color: '#2c3e50' }}>
											<span className="icon mdi mdi-face"></span> Tài khoản
										</a>
										<a className="dropdown-item" href="#" style={{ color: '#2c3e50' }}>
											<span className="icon mdi mdi-settings"></span> Cài đặt
										</a>
										<a className="dropdown-item" href="/logoutadmin" style={{ color: '#c0392b' }}>
											<span className="icon mdi mdi-power"></span> Đăng xuất
										</a>
									</div>
								</li>
							</ul>

							{/* Notifications */}
							<ul className="nav navbar-nav float-right be-icons-nav">
								<li className="nav-item dropdown">
									<a
										className="nav-link be-toggle-right-sidebar"
										href="#"
										role="button"
										aria-expanded="false"
										style={{ color: 'white' }}
									>
										<span className="icon mdi mdi-settings"></span>
									</a>
								</li>
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										href="#"
										data-toggle="dropdown"
										role="button"
										aria-expanded="false"
										style={{ color: 'white' }}
									>
										<span className="icon mdi mdi-notifications"></span>
										<span className="indicator" style={{ backgroundColor: '#e74c3c', borderRadius: '50%', padding: '2px 6px' }}>
											3
										</span>
									</a>
									<ul className="dropdown-menu be-notifications">
										<li>
											<div className="title p-2" style={{ backgroundColor: '#34495e', color: 'white' }}>
												Thông báo <span className="badge badge-pill">3</span>
											</div>
											<div className="list">
												<div className="be-scroller-notifications">
													<div className="content">
														<ul>
															<li className="notification notification-unread">
																<a href="#" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
																	<img src="assets/img/avatar2.png" alt="Avatar" style={{ width: '40px', borderRadius: '50%' }} />
																	<div className="notification-info">
																		<div className="text">
																			<span className="user-name">Jessica Caruso</span> đã chấp nhận lời mời của bạn tham gia nhóm.
																		</div>
																		<span className="date" style={{ color: '#7f8c8d' }}>2 phút trước</span>
																	</div>
																</a>
															</li>
															<li className="notification">
																<a href="#" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
																	<img src="assets/img/avatar3.png" alt="Avatar" style={{ width: '40px', borderRadius: '50%' }} />
																	<div className="notification-info">
																		<div className="text">
																			<span className="user-name">Joel King</span> đang theo dõi bạn
																		</div>
																		<span className="date" style={{ color: '#7f8c8d' }}>2 ngày trước</span>
																	</div>
																</a>
															</li>
														</ul>
													</div>
												</div>
											</div>
											<div className="footer text-center p-2" style={{ backgroundColor: '#34495e' }}>
												<a href="#" style={{ color: 'white' }}>Xem tất cả thông báo</a>
											</div>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</nav>

			</div>
			<div className="be-left-sidebar">
				<div className="left-sidebar-wrapper" style={{ width: '250px', backgroundColor: '#2c3e50', height: '100vh' }}>
					<a className="left-sidebar-toggle" href="#" style={{ color: 'black', padding: '10px 15px', fontSize: '16px', fontWeight: 'bold' }}>Bảng thống kê</a>
					<div className="left-sidebar-spacer">
						<div className="left-sidebar-scroll">
							<div className="left-sidebar-content" style={{ backgroundColor: 'rgb(44, 62, 80)' }}>
								<ul className="sidebar-elements" style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
									<li className="divider" style={{ color: '#ecf0f1', fontWeight: 'bold', fontSize: '18px', padding: '10px 15px' }}>Menu</li>

									<li className="active" style={{ borderRadius: '5px', backgroundColor: '#1abc9c', transition: 'background-color 0.3s ease' }}>
										<a href="/admin" style={{ color: 'black', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
											<i className="icon mdi mdi-home" style={{ fontSize: '24px', marginRight: '10px' }}></i>
											<span>Trang chủ</span>
										</a>
									</li>

									<li style={{ borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
										<a href="/nguoidung" style={{ color: 'black', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
											<i className="bi bi-person-circle" style={{ fontSize: '24px', marginRight: '10px' }}></i>
											<span>Quản lý người dùng</span>
										</a>
									</li>

									<li className="has-submenu" style={{ borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
										<a href="#" style={{ color: 'black', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
											<i className="bi bi-phone-fill" style={{ fontSize: '24px', marginRight: '10px' }}></i>
											<span>Quản lý sản phẩm</span>
										</a>
										<ul className="submenu" style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
											<li><a href="/products" style={{ color: 'black', textDecoration: 'none', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}><span>Quản lý sản phẩm</span></a></li>
											<li><a href="/products-prices" style={{ color: 'black', textDecoration: 'none', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}><span>Quản lý sản phẩm dung lượng</span></a></li>
											<li><a href="/category" style={{ color: 'black', textDecoration: 'none', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}><span>Quản lý danh mục</span></a></li>
											<li><a href="/brands" style={{ color: 'black', textDecoration: 'none', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}><span>Quản lý thương hiệu</span></a></li>
											<li><a href="/color" style={{ color: 'black', textDecoration: 'none', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}><span>Quản lý màu</span></a></li>
											<li><a href="/capacity" style={{ color: 'black', textDecoration: 'none', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}><span>Quản lý dung lượng</span></a></li>
											<li><a href="/images" style={{ color: 'black', textDecoration: 'none', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}><span>Quản lý hình ảnh</span></a></li>
										</ul>
									</li>

									<li style={{ borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
										<a href="/order" style={{ color: 'black', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
											<i className="bi bi-cart-fill" style={{ fontSize: '24px', marginRight: '10px' }}></i>
											<span>Quản lý đơn hàng</span>
										</a>
									</li>

									<li style={{ borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
										<a href="evaluaes" style={{ color: 'black', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
											<i className="bi bi-star-fill" style={{ fontSize: '24px', marginRight: '10px' }}></i>
											<span>Quản lý đánh giá</span>
										</a>
									</li>

									<li style={{ borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
										<a href="favourite" style={{ color: 'black', textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
											<i className="bi bi-heart-fill" style={{ fontSize: '24px', marginRight: '10px' }}></i>
											<span>Quản lý yêu thích</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>


		</div>
	);
}
