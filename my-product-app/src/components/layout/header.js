import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ setKeyword, setCategoryId }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [localKeyword, setLocalKeyword] = useState(''); // Local state cho keyword
  const navigate = useNavigate();
  // Get the username from localStorage when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(localKeyword);  // Truyền keyword từ Header xuống Category
    navigate('/categorys'); // Chuyển đến trang Category mà không thay đổi URL với tham số query
  };

  // Logout function
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      // Make API request to log out
      const response = await axios.post("http://localhost:8080/api/auth/logout");
      if (response.data.success) {
        // Clear the localStorage and update state
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername('');
        // Redirect to login page
        navigate("/login");
      } else {
        alert("Đăng xuất không thành công.");
      }
    } catch (error) {
      alert("Lỗi khi đăng xuất.");
    }
  };
  const handleCategoryClick = (categoryId) => {
    // Gọi hàm setKeyword nếu muốn truyền thêm từ khóa khi chọn danh mục
    setCategoryId(categoryId);
    navigate(`/categorys`);
  };
  return (
    <header className="header-style-1">
      <div className="top-bar animate-dropdown">
        <div className="container">
          <div className="header-top-inner">
            <div className="cnt-account">
              <ul className="list-unstyled">
                <li><Link to="/account"><i className="icon fa fa-user"></i>Tài khoản</Link></li>
                <li><Link to="/like"><i className="icon fa fa-heart"></i>Yêu thích</Link></li>
                <li><Link to="/cart"><i className="icon fa fa-shopping-cart"></i>Giỏ hàng</Link></li>
                <li><Link to="/history"><i className="icon fa fa-check"></i>Đơn hàng</Link></li>

                {/* Hiển thị tên người dùng nếu đã đăng nhập */}
                {username && (
                  <>
                    <li style={{ color: 'white' }}>
                      Xin chào, <span>{username}</span>!
                    </li>
                    <li><Link to="/change">Đổi mật khẩu</Link></li>
                    <li><a href="/" onClick={handleLogout}>Đăng xuất</a></li>
                  </>
                )}

                {/* Hiển thị đăng nhập nếu chưa đăng nhập */}
                {!username && (
                  <li><Link to="/login"><i className="icon fa fa-lock"></i> Đăng nhập</Link></li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-3 logo-holder">
              <div className="logo">
                <Link to="/">
                  <img style={{ width: '45%', height: '90%',marginTop:"-25px",marginRight:"100px" }} src="/assets/images/banners/logo1.jpg" alt="logo" />
                </Link>
              </div>
            </div>

            <div className="col-xs-12 col-sm-12 col-md-6 top-search-holder">
            <div className="search-area">
          <form onSubmit={handleSearch}> {/* Gọi hàm handleSearch khi người dùng nhấn Enter */}
              <input
                className="search-field"
                placeholder="Tìm kiếm..."
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)} // Cập nhật giá trị từ khóa tìm kiếm
              />
              <button className="search-button" type="submit" style={{height:"45px"}}></button>
          </form>
        </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-3 top-search">
            <button> <Link to="/cart"><i className="icon fa fa-shopping-cart"></i>Giỏ hàng</Link></button>
            </div>
          </div>
        </div>
      </div>

      <div className="header-nav animate-dropdown">
        <div className="container">
          <div className="yamm navbar navbar-default" role="navigation">
            <div className="navbar-header">
              <button data-target="#mc-horizontal-menu-collapse" data-toggle="collapse" className="navbar-toggle collapsed" type="button">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="nav-bg-class">
              <div className="navbar-collapse collapse" id="mc-horizontal-menu-collapse">
                <div className="nav-outer">
                  <ul className="nav navbar-nav">
                    <li className="active dropdown yamm-fw"><Link to="/" className="dropdown-toggle">Trang chủ</Link></li>
                    <li className="dropdown yamm mega-menu"><Link to="/categorys" onClick={() => handleCategoryClick(1)} className="dropdown-toggle" data-toggle="dropdown">Điện thoại di động</Link></li>
                    <li className="dropdown mega-menu"><Link to="/categorys" onClick={() => handleCategoryClick(2)} className="dropdown-toggle" data-toggle="dropdown">Laptop</Link></li>
                    <li className="dropdown mega-menu"><Link to="/categorys"  onClick={() => handleCategoryClick(3)} className="dropdown-toggle" data-toggle="dropdown">Máy tính bảng</Link></li>
                    <li className="dropdown mega-menu"><Link to="/categorys" onClick={() => handleCategoryClick(4)} className="dropdown-toggle" data-toggle="dropdown">Phụ kiện</Link></li>
                    <li className="dropdown yamm-fw"><Link to="/introduce" className="dropdown-toggle">Giới thiệu</Link></li>
                    <li className="dropdown yamm-fw"><Link to="/contact" className="dropdown-toggle">Liên hệ</Link></li>
                    <li className="dropdown yamm-fw"><Link to="/categorys" onClick={() => handleCategoryClick()} className="dropdown-toggle">Sản phẩm</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;