import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ setKeyword, setCategoryId }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [localKeyword, setLocalKeyword] = useState('');
  const [showAlert, setShowAlert] = useState(false); // Trạng thái hiển thị thông báo
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const alertDisplayed = localStorage.getItem("alertDisplayed");

    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
      if (!alertDisplayed) {
        setShowAlert(true); // Hiển thị thông báo chỉ lần đầu
        setTimeout(() => setShowAlert(false), 3000); // Tự động ẩn thông báo sau 3 giây
        localStorage.setItem("alertDisplayed", "true");
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(localKeyword);
    navigate('/categorys');
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/logout");
      if (response.data.success) {
        // Clear the localStorage and update state
        sessionStorage.removeItem('rememberMe');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem("username");
        localStorage.removeItem("alertDisplayed"); // Xóa trạng thái thông báo khi đăng xuất
        setIsLoggedIn(false);
        setUsername('');
        navigate("/login");
      } else {
        alert("Đăng xuất không thành công.");
      }
    } catch (error) {
      alert("Lỗi khi đăng xuất.");
    }
  };

  const handleCategoryClick = (categoryId) => {
    setCategoryId(categoryId);
    navigate(`/categorys`);
  };


  return (
    <header className="header-style-1 container-fluid bg-light py-3">
      <div className="top-bar animate-dropdown" style={{ paddingLeft: '371px' }}>
        <div className="container">
          <div className="header-top-inner">
            <div className="cnt-account">
              <ul className="account-menu">
                <li>
                  <Link to="/account" className="menu-item">
                    <i className="icon fa fa-user"></i> Tài khoản
                  </Link>
                </li>
                <li>
                  <Link to="/like" className="menu-item">
                    <i className="icon fa fa-heart"></i> Yêu thích
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="menu-item">
                    <i className="icon fa fa-check"></i> Đơn hàng
                  </Link>
                </li>
                {username ? (
                  <>
                    <li>
                      Xin chào, <span className="username">{username}</span>!
                    </li>
                    <li>
                      <Link to="/change" className="menu-item">Đổi mật khẩu</Link>
                    </li>
                    <li>
                      <a href="/" onClick={handleLogout} className="menu-item">Đăng xuất</a>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login" className="menu-item">
                      <i className="icon fa fa-lock"></i> Đăng nhập
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hiệu ứng vòng tròn */}
      <div className={`alert ${showAlert ? 'show' : ''}`} style={{
        position: 'fixed',
        top: '30px',
        left: '85%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
        color: 'white',
        padding: '8px 25px',
        width: '350px',
        borderRadius: '8px',
        fontSize: '12px',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        opacity: showAlert ? 1 : 0,
        transform: showAlert ? 'translate(-50%, 0)' : 'translateY(-50px)',
        transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className="containers" style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          height: '30px',
          width: '30px',
          animation: 'rotate_3922 1.2s linear infinite',
          backgroundColor: '#9b59b6',
          backgroundImage: 'linear-gradient(#9b59b6, #84cdfa, #5ad1cd)',
          overflow: 'hidden',
        }}>
          {/* Lỗ tròn ở giữa */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            backgroundColor: 'white',
            borderRadius: '50%',
          }}></div>
        </div>
        <p style={{ marginLeft: '50px' }}>Đăng nhập thành công! Chào mừng bạn!</p>
      </div>
      
      <style>
        {`
          @keyframes rotate_3922 {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        `}
      </style>

      <div className="main-header" style={{
    width: '1410px'}}>
        <div className="container">
          <div className="row" style={{width: '1330px'}}>
            <div className="col-xs-12 col-sm-12 col-md-3 logo-holder">
              <div className="logo">
                <Link to="/">
                  <img style={{ width: '120px',
    height: '111px',marginRight:"100px" }} src="/assets/images/banners/logo1.jpg" alt="logo" />
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
            <div className="col-xs-12 col-sm-12 col-md-3 top-search" style={{ paddingTop: '9px', paddingLeft: '79px' }}>
  <Link to="/cart" style={{
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    backgroundColor: '#0f6cb2',  // Màu nền của ô vuông
    padding: '10px 20px',      // Khoảng cách bên trong ô vuông
    borderRadius: '5px',       // Bo tròn các góc của ô vuông
    color: 'white',            // Màu chữ
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '158px',  // Đổ bóng nhẹ cho ô vuông
  }}>
    <i className="icon fa fa-shopping-cart" style={{ fontSize: '36px', marginRight: '10px' }}></i>
    <span style={{ fontSize: '12px', fontWeight: '500' }}>Xem giỏ hàng</span>
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
                  <ul className="nav navbar-nav" style={{height:'55px'}}>
                    <li className="active dropdown yamm-fw"><Link style={{    padding: '15px 20px 0 20px', height: '54px'}} to="/" className="dropdown-toggle">Trang chủ</Link></li>
                    <li className="dropdown yamm mega-menu"><Link style={{    padding: '15px 20px 0 20px',height: '54px'}} to="/categorys" onClick={() => handleCategoryClick(1)} className="dropdown-toggle" data-toggle="dropdown">Điện thoại di động</Link></li>
                    <li className="dropdown mega-menu"><Link style={{    padding: '15px 20px 0 20px',height: '54px'}} to="/categorys" onClick={() => handleCategoryClick(2)} className="dropdown-toggle" data-toggle="dropdown">Laptop</Link></li>
                    <li className="dropdown mega-menu"><Link style={{    padding: '15px 20px 0 20px',height: '54px'}} to="/categorys"  onClick={() => handleCategoryClick(3)} className="dropdown-toggle" data-toggle="dropdown">Máy tính bảng</Link></li>
                    <li className="dropdown mega-menu"><Link style={{    padding: '15px 20px 0 20px',height: '54px'}} to="/categorys" onClick={() => handleCategoryClick(4)} className="dropdown-toggle" data-toggle="dropdown">Phụ kiện</Link></li>
                    <li className="dropdown yamm-fw"><Link style={{    padding: '15px 20px 0 20px',height: '54px'}} to="/introduce" className="dropdown-toggle">Giới thiệu</Link></li>
                    <li className="dropdown yamm-fw"><Link style={{    padding: '15px 20px 0 20px',height: '54px'}}  to="/contact" className="dropdown-toggle">Liên hệ</Link></li>
                    <li className="dropdown yamm-fw"><Link style={{    padding: '15px 20px 0 20px',height: '54px'}} to="/categorys" onClick={() => handleCategoryClick()} className="dropdown-toggle">Sản phẩm</Link></li>
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