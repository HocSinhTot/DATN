<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<link rel="shortcut icon" href="assets\img\logo-fav.png">
<title>Beagle</title>
<link rel="stylesheet" type="text/css"
	href="assets\lib\perfect-scrollbar\css\perfect-scrollbar.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\material-design-icons\css\material-design-iconic-font.min.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\jquery.vectormap\jquery-jvectormap-1.2.2.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\jqvmap\jqvmap.min.css">
<link rel="stylesheet" type="text/css"
	href="assets\lib\datetimepicker\css\bootstrap-datetimepicker.min.css">
<link rel="stylesheet" href="assets\css\app.css" type="text/css">
</head>
<body>
	<div class="be-wrapper be-fixed-sidebar">
		<jsp:include page="formadmin/header.jsp" />
		<div class="be-content">
			<div class="main-content container-fluid">
				<div class="row">
					<div class="col-12 col-lg-6 col-xl-3">
						<div class="widget widget-tile">
							<div class="chart sparkline" id="spark1"></div>
							<div class="data-info">
								<div class="desc">Người dùng Mới</div>
								<div class="value">
									<span class="indicator indicator-equal mdi mdi-chevron-right"></span><span
										class="number" data-toggle="counter" data-end="113">0</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-6 col-xl-3">
						<div class="widget widget-tile">
							<div class="chart sparkline" id="spark2"></div>
							<div class="data-info">
								<div class="desc">Doanh số Bán hàng Hàng tháng</div>
								<div class="value">
									<span class="indicator indicator-positive mdi mdi-chevron-up"></span><span
										class="number" data-toggle="counter" data-end="80"
										data-suffix="%">0</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-6 col-xl-3">
						<div class="widget widget-tile">
							<div class="chart sparkline" id="spark3"></div>
							<div class="data-info">
								<div class="desc">Số lần Hiển thị</div>
								<div class="value">
									<span class="indicator indicator-positive mdi mdi-chevron-up"></span><span
										class="number" data-toggle="counter" data-end="532">0</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-6 col-xl-3">
						<div class="widget widget-tile">
							<div class="chart sparkline" id="spark4"></div>
							<div class="data-info">
								<div class="desc">Số lượt Tải về</div>
								<div class="value">
									<span class="indicator indicator-negative mdi mdi-chevron-down"></span><span
										class="number" data-toggle="counter" data-end="113">0</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-md-12">
						<div class="widget widget-fullwidth be-loading">
							<div class="widget-head">
								<div class="tools">
									<div class="dropdown">
										<a class="dropdown-toggle" data-toggle="dropdown"><span
											class="icon mdi mdi-more-vert d-inline-block d-md-none"></span></a>
										<div class="dropdown-menu" role="menu">
											<a class="dropdown-item" href="#">Tuần</a><a
												class="dropdown-item" href="#">Tháng</a><a
												class="dropdown-item" href="#">Năm</a>
											<div class="dropdown-divider"></div>
											<a class="dropdown-item" href="#">Hôm nay</a>
										</div>
									</div>
									<span class="icon mdi mdi-chevron-down"></span><span
										class="icon toggle-loading mdi mdi-refresh-sync"></span><span
										class="icon mdi mdi-close"></span>
								</div>
								<div class="button-toolbar d-none d-md-block">
									<div class="btn-group">
										<button class="btn btn-secondary" type="button">Tuần</button>
										<button class="btn btn-secondary active" type="button">Tháng</button>
										<button class="btn btn-secondary" type="button">Năm</button>
									</div>
									<div class="btn-group">
										<button class="btn btn-secondary" type="button">Hôm
											nay</button>
									</div>
								</div>
								<span class="title">Chuyển động Gần đây</span>
							</div>
							<div class="widget-chart-container">
								<div class="widget-chart-info">
									<ul class="chart-legend-horizontal">
										<li><span data-color="main-chart-color1"></span> Mua hàng</li>
										<li><span data-color="main-chart-color2"></span> Kế hoạch</li>
										<li><span data-color="main-chart-color3"></span> Dịch vụ</li>
									</ul>
								</div>
								<div class="widget-counter-group widget-counter-group-right">
									<div class="counter counter-big">
										<div class="value">25%</div>
										<div class="desc">Mua hàng</div>
									</div>
									<div class="counter counter-big">
										<div class="value">5%</div>
										<div class="desc">Kế hoạch</div>
									</div>
									<div class="counter counter-big">
										<div class="value">5%</div>
										<div class="desc">Dịch vụ</div>
									</div>
								</div>
								<div id="main-chart" style="height: 260px;"></div>
							</div>
							<div class="be-spinner">
								<svg width="40px" height="40px" viewbox="0 0 66 66"
									xmlns="http://www.w3.org/2000/svg">
          <circle class="circle" fill="none" stroke-width="4"
										stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-lg-6">
						<div class="card card-table">
							<div class="card-header">
								<div class="tools dropdown">
									<span class="icon mdi mdi-download"></span><a
										class="dropdown-toggle" href="#" role="button"
										data-toggle="dropdown"><span
										class="icon mdi mdi-more-vert"></span></a>
									<div class="dropdown-menu" role="menu">
										<a class="dropdown-item" href="#">Hành động</a><a
											class="dropdown-item" href="#">Hành động khác</a><a
											class="dropdown-item" href="#">Một cái gì đó khác ở đây</a>
										<div class="dropdown-divider"></div>
										<a class="dropdown-item" href="#">Liên kết tách biệt</a>
									</div>
								</div>
								<div class="title">Mua hàng</div>
							</div>
							<div class="card-body table-responsive">
								<table class="table table-striped table-borderless">
									<thead>
										<tr>
											<th style="width: 40%;">Sản phẩm</th>
											<th class="number">Giá</th>
											<th style="width: 20%;">Ngày</th>
											<th style="width: 20%;">Trạng thái</th>
											<th class="actions" style="width: 5%;"></th>
										</tr>
									</thead>
									<tbody class="no-border-x">
										<tr>
											<td>Sony Xperia M4</td>
											<td class="number">$149</td>
											<td>23 Tháng 8, 2018</td>
											<td class="text-success">Hoàn thành</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-plus-circle-o"></i></a></td>
										</tr>
										<tr>
											<td>Apple iPhone 6</td>
											<td class="number">$535</td>
											<td>20 Tháng 8, 2018</td>
											<td class="text-success">Hoàn thành</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-plus-circle-o"></i></a></td>
										</tr>
										<tr>
											<td>Samsung Galaxy S7</td>
											<td class="number">$583</td>
											<td>18 Tháng 8, 2018</td>
											<td class="text-warning">Đang chờ</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-plus-circle-o"></i></a></td>
										</tr>
										<tr>
											<td>HTC One M9</td>
											<td class="number">$350</td>
											<td>15 Tháng 8, 2018</td>
											<td class="text-warning">Đang chờ</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-plus-circle-o"></i></a></td>
										</tr>
										<tr>
											<td>Sony Xperia Z5</td>
											<td class="number">$495</td>
											<td>13 Tháng 8, 2018</td>
											<td class="text-danger">Đã hủy</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-plus-circle-o"></i></a></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div class="col-12 col-lg-6">
						<div class="card card-table">
							<div class="card-header">
								<div class="tools dropdown">
									<span class="icon mdi mdi-download"></span><a
										class="dropdown-toggle" href="#" role="button"
										data-toggle="dropdown"><span
										class="icon mdi mdi-more-vert"></span></a>
									<div class="dropdown-menu dropdown-menu-right" role="menu">
										<a class="dropdown-item" href="#">Hành động</a><a
											class="dropdown-item" href="#">Hành động khác</a><a
											class="dropdown-item" href="#">Thứ gì khác ở đây</a>
										<div class="dropdown-divider"></div>
										<a class="dropdown-item" href="#">Liên kết tách biệt</a>
									</div>
								</div>
								<div class="title">Lần Commit Gần Nhất</div>
							</div>
							<div class="card-body table-responsive">
								<table class="table table-striped table-hover">
									<thead>
										<tr>
											<th style="width: 37%;">Người dùng</th>
											<th style="width: 36%;">Commit</th>
											<th>Ngày</th>
											<th class="actions"></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="user-avatar"><img
												src="assets\img\avatar6.png" alt="Avatar">Penelope
												Thornton</td>
											<td>Phong cách dropdown của Topbar</td>
											<td>16 Tháng 8, 2018</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-github-alt"></i></a></td>
										</tr>
										<tr>
											<td class="user-avatar"><img
												src="assets\img\avatar4.png" alt="Avatar">Benji Harper</td>
											<td>Điều chỉnh sidebar bên trái</td>
											<td>15 Tháng 7, 2018</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-github-alt"></i></a></td>
										</tr>
										<tr>
											<td class="user-avatar"><img
												src="assets\img\avatar5.png" alt="Avatar">Justine
												Myranda</td>
											<td>Đánh dấu cấu trúc chính</td>
											<td>28 Tháng 7, 2018</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-github-alt"></i></a></td>
										</tr>
										<tr>
											<td class="user-avatar"><img
												src="assets\img\avatar3.png" alt="Avatar">Sherwood
												Clifford</td>
											<td>Commit ban đầu</td>
											<td>30 Tháng 6, 2018</td>
											<td class="actions"><a class="icon" href="#"><i
													class="mdi mdi-github-alt"></i></a></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-12 col-lg-4">
						<div class="card">
							<div class="card-header card-header-divider pb-3">Tiến Độ
								Hiện Tại</div>
							<div class="card-body pt-5">
								<div class="row user-progress user-progress-small">
									<div class="col-lg-5">
										<span class="title">Quản trị Bootstrap</span>
									</div>
									<div class="col-lg-7">
										<div class="progress">
											<div class="progress-bar bg-success" style="width: 40%;"></div>
										</div>
									</div>
								</div>
								<div class="row user-progress user-progress-small">
									<div class="col-lg-5">
										<span class="title">Công Việc Tùy Chỉnh</span>
									</div>
									<div class="col-lg-7">
										<div class="progress">
											<div class="progress-bar bg-success" style="width: 65%;"></div>
										</div>
									</div>
								</div>
								<div class="row user-progress user-progress-small">
									<div class="col-lg-5">
										<span class="title">Mô-đun Khách Hàng</span>
									</div>
									<div class="col-lg-7">
										<div class="progress">
											<div class="progress-bar bg-success" style="width: 30%;"></div>
										</div>
									</div>
								</div>
								<div class="row user-progress user-progress-small">
									<div class="col-lg-5">
										<span class="title">Mẫu Email</span>
									</div>
									<div class="col-lg-7">
										<div class="progress">
											<div class="progress-bar bg-success" style="width: 80%;"></div>
										</div>
									</div>
								</div>
								<div class="row user-progress user-progress-small">
									<div class="col-lg-5">
										<span class="title">Mô-đun Kế Hoạch</span>
									</div>
									<div class="col-lg-7">
										<div class="progress">
											<div class="progress-bar bg-success" style="width: 45%;"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-4">
						<div class="widget be-loading">
							<div class="widget-head">
								<div class="tools">
									<span class="icon mdi mdi-chevron-down"></span><span
										class="icon mdi mdi-refresh-sync toggle-loading"></span><span
										class="icon mdi mdi-close"></span>
								</div>
								<div class="title">Doanh Số Hàng Đầu</div>
							</div>
							<div class="widget-chart-container">
								<div id="top-sales" style="height: 178px;"></div>
								<div class="chart-pie-counter">36</div>
							</div>
							<div class="chart-legend">
								<table>
									<tr>
										<td class="chart-legend-color"><span
											data-color="top-sales-color1"></span></td>
										<td>Mua Premium</td>
										<td class="chart-legend-value">125</td>
									</tr>
									<tr>
										<td class="chart-legend-color"><span
											data-color="top-sales-color2"></span></td>
										<td>Kế Hoạch Tiêu Chuẩn</td>
										<td class="chart-legend-value">1569</td>
									</tr>
									<tr>
										<td class="chart-legend-color"><span
											data-color="top-sales-color3"></span></td>
										<td>Dịch Vụ</td>
										<td class="chart-legend-value">824</td>
									</tr>
								</table>
							</div>
							<div class="be-spinner">
								<svg width="40px" height="40px" viewbox="0 0 66 66"
									xmlns="http://www.w3.org/2000/svg">
                    <circle class="circle" fill="none" stroke-width="4"
										stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                  </svg>
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-4">
						<div class="widget widget-calendar">
							<div id="calendar-widget"></div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12 col-lg-6">
						<div class="card">
							<div class="card-header">Hoạt Động Gần Đây</div>
							<div class="card-body">
								<ul class="user-timeline user-timeline-compact">
									<li class="latest">
										<div class="user-timeline-date">Vừa Xong</div>
										<div class="user-timeline-title">Tạo Trang Mới</div>
										<div class="user-timeline-description">Vestibulum lectus
											nulla, maximus in eros non, tristique.</div>
									</li>
									<li>
										<div class="user-timeline-date">Hôm Nay - 15:35</div>
										<div class="user-timeline-title">Sao Lưu Chủ Đề</div>
										<div class="user-timeline-description">Vestibulum lectus
											nulla, maximus in eros non, tristique.</div>
									</li>
									<li>
										<div class="user-timeline-date">Hôm Qua - 10:41</div>
										<div class="user-timeline-title">Thay Đổi Trong Cấu Trúc</div>
										<div class="user-timeline-description">Vestibulum lectus
											nulla, maximus in eros non, tristique.</div>
									</li>
									<li>
										<div class="user-timeline-date">Hôm Qua - 3:02</div>
										<div class="user-timeline-title">Sửa Sidebar</div>
										<div class="user-timeline-description">Vestibulum lectus
											nulla, maximus in eros non, tristique.</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="col-12 col-lg-6">
						<div class="widget be-loading">
							<div class="widget-head">
								<div class="tools">
									<span class="icon mdi mdi-chevron-down"></span><span
										class="icon mdi mdi-refresh-sync toggle-loading"></span><span
										class="icon mdi mdi-close"></span>
								</div>
								<div class="title">Chuyển Đổi</div>
							</div>
							<div class="widget-chart-container">
								<div class="widget-chart-info mb-4">
									<div class="indicator indicator-positive float-right">
										<span class="icon mdi mdi-chevron-up"></span><span
											class="number">15%</span>
									</div>
									<div class="counter counter-inline">
										<div class="value">156k</div>
										<div class="desc">Ấn Tượng</div>
									</div>
								</div>
								<div id="map-widget" style="height: 265px;"></div>
							</div>
							<div class="be-spinner">
								<svg width="40px" height="40px" viewbox="0 0 66 66"
									xmlns="http://www.w3.org/2000/svg">
                    <circle class="circle" fill="none" stroke-width="4"
										stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                  </svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>	

		<nav class="be-right-sidebar">
			<div class="sb-content">
				<div class="tab-navigation">
					<ul class="nav nav-tabs nav-justified" role="tablist">
						<li class="nav-item" role="presentation"><a
							class="nav-link active" href="#tab1" aria-controls="tab1"
							role="tab" data-toggle="tab">Trò chuyện</a></li>
						<li class="nav-item" role="presentation"><a class="nav-link"
							href="#tab2" aria-controls="tab2" role="tab" data-toggle="tab">Việc
								cần làm</a></li>
						<li class="nav-item" role="presentation"><a class="nav-link"
							href="#tab3" aria-controls="tab3" role="tab" data-toggle="tab">Cài
								đặt</a></li>
					</ul>
				</div>
				<div class="tab-panel">
					<div class="tab-content">
						<div class="tab-pane tab-chat active" id="tab1" role="tabpanel">
							<div class="chat-contacts">
								<div class="chat-sections">
									<div class="be-scroller-chat">
										<div class="content">
											<h2>Gần đây</h2>
											<div class="contact-list contact-list-recent">
												<div class="user">
													<a href="#"><img src="assets\img\avatar1.png"
														alt="Avatar">
														<div class="user-data">
															<span class="status away"></span><span class="name">Claire
																Sassu</span><span class="message">Bạn có thể chia sẻ...</span>
														</div></a>
												</div>
												<div class="user">
													<a href="#"><img src="assets\img\avatar2.png"
														alt="Avatar">
														<div class="user-data">
															<span class="status"></span><span class="name">Maggie
																jackson</span><span class="message">Tôi đã xác nhận
																thông tin.</span>
														</div></a>
												</div>
												<div class="user">
													<a href="#"><img src="assets\img\avatar3.png"
														alt="Avatar">
														<div class="user-data">
															<span class="status offline"></span><span class="name">Joel
																King </span><span class="message">Sẵn sàng cho cuộc
																họp...</span>
														</div></a>
												</div>
											</div>
											<h2>Liên lạc</h2>
											<div class="contact-list">
												<div class="user">
													<a href="#"><img src="assets\img\avatar4.png"
														alt="Avatar">
														<div class="user-data2">
															<span class="status"></span><span class="name">Mike
																Bolthort</span>
														</div></a>
												</div>
												<div class="user">
													<a href="#"><img src="assets\img\avatar5.png"
														alt="Avatar">
														<div class="user-data2">
															<span class="status"></span><span class="name">Maggie
																jackson</span>
														</div></a>
												</div>
												<div class="user">
													<a href="#"><img src="assets\img\avatar6.png"
														alt="Avatar">
														<div class="user-data2">
															<span class="status offline"></span><span class="name">Jhon
																Voltemar</span>
														</div></a>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="bottom-input">
									<input type="text" placeholder="Tìm kiếm..." name="q"><span
										class="mdi mdi-search"></span>
								</div>
							</div>
							<div class="chat-window">
								<div class="title">
									<div class="user">
										<img src="assets\img\avatar2.png" alt="Avatar">
										<h2>Maggie jackson</h2>
										<span>Hoạt động cách đây 1 giờ</span>
									</div>
									<span class="icon return mdi mdi-chevron-left"></span>
								</div>
								<div class="chat-messages">
									<div class="be-scroller-messages">
										<div class="content">
											<ul>
												<li class="friend">
													<div class="msg">Xin chào</div>
												</li>
												<li class="self">
													<div class="msg">Xin chào, bạn có khỏe không?</div>
												</li>
												<li class="friend">
													<div class="msg">Tốt, tôi cần sự hỗ trợ với máy tính
														của tôi</div>
												</li>
												<li class="self">
													<div class="msg">Dĩ nhiên, chỉ cần nói cho tôi biết
														máy tính của bạn đang gặp vấn đề gì?</div>
												</li>
												<li class="friend">
													<div class="msg">Tôi không biết, nó đột ngột tắt
														nguồn</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="chat-input">
									<div class="input-wrapper">
										<span class="photo mdi mdi-camera"></span> <input type="text"
											placeholder="Tin nhắn..." name="q" autocomplete="off"><span
											class="send-msg mdi mdi-mail-send"></span>
									</div>
								</div>
							</div>
						</div>
						<div class="tab-pane tab-todo" id="tab2" role="tabpanel">
							<div class="todo-container">
								<div class="todo-wrapper">
									<div class="be-scroller-todo">
										<div class="todo-content">
											<span class="category-title">Hôm nay</span>
											<ul class="todo-list">
												<li>
													<div
														class="custom-checkbox custom-control custom-control-sm">
														<span class="delete mdi mdi-delete"></span> <input
															class="custom-control-input" type="checkbox" checked=""
															id="tck1"> <label class="custom-control-label"
															for="tck1">Khởi tạo dự án</label>
													</div>
												</li>
												<li>
													<div
														class="custom-checkbox custom-control custom-control-sm">
														<span class="delete mdi mdi-delete"></span> <input
															class="custom-control-input" type="checkbox" id="tck2">
														<label class="custom-control-label" for="tck2">Tạo
															cấu trúc chính</label>
													</div>
												</li>
												<li>
													<div
														class="custom-checkbox custom-control custom-control-sm">
														<span class="delete mdi mdi-delete"></span> <input
															class="custom-control-input" type="checkbox" id="tck3">
														<label class="custom-control-label" for="tck3">Cập
															nhật thay đổi lên GitHub</label>
													</div>
												</li>
											</ul>
											<span class="category-title">Ngày mai</span>
											<ul class="todo-list">
												<li>
													<div
														class="custom-checkbox custom-control custom-control-sm">
														<span class="delete mdi mdi-delete"></span> <input
															class="custom-control-input" type="checkbox" id="tck4">
														<label class="custom-control-label" for="tck4">Khởi
															tạo dự án</label>
													</div>
												</li>
												<li>
													<div
														class="custom-checkbox custom-control custom-control-sm">
														<span class="delete mdi mdi-delete"></span> <input
															class="custom-control-input" type="checkbox" id="tck5">
														<label class="custom-control-label" for="tck5">Tạo
															cấu trúc chính</label>
													</div>
												</li>
												<li>
													<div
														class="custom-checkbox custom-control custom-control-sm">
														<span class="delete mdi mdi-delete"></span> <input
															class="custom-control-input" type="checkbox" id="tck6">
														<label class="custom-control-label" for="tck6">Cập
															nhật thay đổi lên GitHub</label>
													</div>
												</li>
												<li>
													<div
														class="custom-checkbox custom-control custom-control-sm">
														<span class="delete mdi mdi-delete"></span> <input
															class="custom-control-input" type="checkbox" id="tck7">
														<label class="custom-control-label" for="tck7"
															title="Nhiệm vụ này quá dài để hiển thị trong không gian bình thường!">Nhiệm
															vụ này quá dài để hiển thị trong không gian bình thường!</label>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="bottom-input">
									<input type="text" placeholder="Tạo nhiệm vụ mới..." name="q"><span
										class="mdi mdi-plus"></span>
								</div>
							</div>
							
						</div>
						<div class="tab-pane tab-settings" id="tab3" role="tabpanel">
							<div class="settings-wrapper">
								<div class="be-scroller-settings">
									<span class="category-title">Chung</span>
									<ul class="settings-list">
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" checked="" name="st1" id="st1"><span>
													<label for="st1"></label>
												</span>
											</div>
											<span class="name">Có sẵn</span>
										</li>
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" checked="" name="st2" id="st2"><span>
													<label for="st2"></label>
												</span>
											</div>
											<span class="name">Bật thông báo</span>
										</li>
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" checked="" name="st3" id="st3"><span>
													<label for="st3"></label>
												</span>
											</div>
											<span class="name">Đăng nhập bằng Facebook</span>
										</li>
									</ul>
									<span class="category-title">Thông báo</span>
									<ul class="settings-list">
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" name="st4" id="st4"><span>
													<label for="st4"></label>
												</span>
											</div>
											<span class="name">Thông báo qua email</span>
										</li>
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" checked="" name="st5" id="st5"><span>
													<label for="st5"></label>
												</span>
											</div>
											<span class="name">Cập nhật dự án</span>
										</li>
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" checked="" name="st6" id="st6"><span>
													<label for="st6"></label>
												</span>
											</div>
											<span class="name">Bình luận mới</span>
										</li>
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" name="st7" id="st7"><span>
													<label for="st7"></label>
												</span>
											</div>
											<span class="name">Tin nhắn trò chuyện</span>
										</li>
									</ul>
									<span class="category-title">Luồng làm việc</span>
									<ul class="settings-list">
										<li>
											<div class="switch-button switch-button-sm">
												<input type="checkbox" name="st8" id="st8"><span>
													<label for="st8"></label>
												</span>
											</div>
											<span class="name">Triển khai khi commit</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</nav>


		<script src="assets\lib\jquery\jquery.min.js" type="text/javascript"></script>
		<script src="assets\lib\perfect-scrollbar\js\perfect-scrollbar.min.js"
			type="text/javascript"></script>
		<script src="assets\lib\bootstrap\dist\js\bootstrap.bundle.min.js"
			type="text/javascript"></script>
		<script src="assets\js\app.js" type="text/javascript"></script>
		<script src="assets\lib\jquery-flot\jquery.flot.js"
			type="text/javascript"></script>
		<script src="assets\lib\jquery-flot\jquery.flot.pie.js"
			type="text/javascript"></script>
		<script src="assets\lib\jquery-flot\jquery.flot.time.js"
			type="text/javascript"></script>
		<script src="assets\lib\jquery-flot\jquery.flot.resize.js"
			type="text/javascript"></script>
		<script src="assets\lib\jquery-flot\plugins\jquery.flot.orderBars.js"
			type="text/javascript"></script>
		<script src="assets\lib\jquery-flot\plugins\curvedLines.js"
			type="text/javascript"></script>
		<script src="assets\lib\jquery-flot\plugins\jquery.flot.tooltip.js"
			type="text/javascript"></script>
		<script src="assets\lib\jquery.sparkline\jquery.sparkline.min.js"
			type="text/javascript"></script>
		<script src="assets\lib\countup\countUp.min.js" type="text/javascript"></script>
		<script src="assets\lib\jquery-ui\jquery-ui.min.js"
			type="text/javascript"></script>
		<script src="assets\lib\jqvmap\jquery.vmap.min.js"
			type="text/javascript"></script>
		<script src="assets\lib\jqvmap\maps\jquery.vmap.world.js"
			type="text/javascript"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				//-initialize the javascript
				App.init();
				App.dashboard();

			});
		</script>
</body>
</html>