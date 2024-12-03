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
            <ul style={{ listStyle: 'none', padding: '0', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
  <li style={{ marginBottom: '10px',fontSize:'14px',padding:'5px 20px 0px 20px' }}>
    <Link to="/account" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <i className="icon fa fa-user" style={{ marginRight: '8px', fontSize: '1.5rem' }}></i>
      Tài khoản
    </Link>
  </li>
  <li style={{ marginBottom: '10px' ,fontSize:'14px',padding:'5px 20px 0px 20px' }}>
    <Link to="/like" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <i className="icon fa fa-heart" style={{ marginRight: '8px', fontSize: '1.5rem' }}></i>
      Yêu thích
    </Link>
  </li>
  <li style={{ marginBottom: '10px' ,fontSize:'14px',padding:'5px 20px 0px 20px'}}>
    <Link to="/cart" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <i className="icon fa fa-shopping-cart" style={{ marginRight: '8px', fontSize: '1.5rem' }}></i>
      Giỏ hàng
    </Link>
  </li>
  <li style={{ marginBottom: '10px',fontSize:'14px',padding:'5px 20px 0px 20px' }}>
    <Link to="/history" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <i className="icon fa fa-check" style={{ marginRight: '8px', fontSize: '1.5rem' }}></i>
      Đơn hàng
    </Link>
  </li>
  {username && (
    <>
      <li style={{ fontSize: '1.5rem', marginBottom: '10px' ,fontSize:'14px',padding:'5px 20px 0px 20px'}}>
        Xin chào, <span style={{ fontWeight: 'bold' }}>{username}</span>!
      </li>
      <li style={{ marginBottom: '10px' ,fontSize:'14px',padding:'5px 20px 0px 20px'}}>
        <Link to="/change" style={{ textDecoration: 'none' }}>Đổi mật khẩu</Link>
      </li>
      <li style={{ marginBottom: '10px' ,fontSize:'14px',padding:'5px 20px 0px 20px'}}>
        <a href="/" onClick={handleLogout} style={{ textDecoration: 'none' }}>Đăng xuất</a>
      </li>
    </>
  )}
  {!username && (
    <li style={{ marginBottom: '10px' ,fontSize:'14px',padding:'5px 20px 0px 20px'}}>
      <Link to="/login" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <i className="icon fa fa-lock" style={{ marginRight: '8px', fontSize: '1.5rem' }}></i>
        Đăng nhập
      </Link>
    </li>
  )}
</ul>


            </div>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container">
          <div className="row" style={{width: '1330px'}}>
            <div className="col-xs-12 col-sm-12 col-md-3 logo-holder">
              <div className="logo">
                <Link to="/">
                  <img style={{ width: '45%', height: '90%',marginTop:"-25px",marginRight:"100px" }} src="/assets/images/banners/logo1.jpg" alt="logo" />
                </Link>
              </div>
            </div>

            <div className="col-xs-12 col-sm-12 col-md-6 top-search-holder">
            <div className="search-area" style={{    width: '620px'}}>
            <form
  onSubmit={handleSearch}
  style={{
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",  // Form chiếm toàn bộ chiều rộng
    maxWidth: "100%",
    margin: "50px auto",
    height: "56px",
    background: "transparent",  // Không có nền
    border: "none",
    boxShadow: "none",
  }}
>
  <input
    placeholder="Tìm kiếm..."
    value={localKeyword}
    onChange={(e) => setLocalKeyword(e.target.value)}
    style={{
      flex: 1,
      backgroundColor: "#05071b",
      border: "none",  // Không có viền
      height: "100%",
      paddingLeft: "20px",
      fontSize: "16px",
      color: "#a9c7ff",
      outline: "none",
      borderRadius: "0",  // Không bo góc
    }}
  />
  <button
    type="submit"
    style={{
      width: "56px",  // Chiều rộng bằng với chiều rộng của input
      height: "56px",  // Chiều cao đầy đủ
      background: "linear-gradient(180deg, #1c2452, #2a3875)",
      border: "none",  // Không có viền
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0",  // Không bo góc
      padding: "0",  // Loại bỏ padding
    }}
  >
    🔍
  </button>
</form>

<div className="galaxy"></div>

<div id="search-container">
  <div className="starfield"></div>
  <div className="nebula"></div>
  <div className="stardust"></div>
  <div className="cosmic-ring"></div>
</div>

<style>
{`
  .galaxy {
    height: 800px;
    width: 800px;
    background-image: radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: 0 0, 25px 25px;
    position: absolute;
    z-index: -1;
    animation: twinkle 5s infinite;
  }

  .stardust,
  .cosmic-ring,
  .starfield,
  .nebula {
    max-height: 70px;
    max-width: 314px;
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: -1;
    filter: blur(3px);
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  #search-container:focus-within > .starfield::before {
    transform: translate(-50%, -50%) rotate(442deg);
    transition: all 4s;
  }

  #search-container:focus-within > .nebula::before {
    transform: translate(-50%, -50%) rotate(420deg);
    transition: all 4s;
  }

  #search-container:focus-within > .stardust::before {
    transform: translate(-50%, -50%) rotate(443deg);
    transition: all 4s;
  }

  #search-container:focus-within > .cosmic-ring::before {
    transform: translate(-50%, -50%) rotate(430deg);
    transition: all 4s;
  }

  .nebula {
    overflow: hidden;
    filter: blur(30px);
    opacity: 0.4;
    max-height: 130px;
    max-width: 354px;
  }

  .nebula:before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 999px;
    height: 999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(#000, #4d6dff 5%, #000 38%, #000 50%, #6e8cff 60%, #000 87%);
    transition: all 2s;
  }
`}
</style>


        </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-3 top-search" style={{ paddingTop: '58px' }}>
  <Link to="/cart">
    <i className="icon fa fa-shopping-cart" style={{ fontSize: '42px', color: 'white' }}></i>
  </Link>
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