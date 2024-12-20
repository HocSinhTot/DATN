import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const Header = ({ setKeyword, setCategoryId }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [localKeyword, setLocalKeyword] = useState('');
  const [showAlert, setShowAlert] = useState(false); // Trạng thái hiển thị thông báo

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchLink, setSearchLink] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSearchButton, setShowSearchButton] = useState(false);  // Trạng thái hiển thị nút tìm kiếm sau 2 giây
  const token = sessionStorage.getItem("token"); // Lấy token từ localStorage
  let isAdmin = false;
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

  useEffect(() => {
    if (chatOpen) {
      setChatMessages([
        { text: 'Xin chào!Bạn muốn tìm sản phẩm nào?', type: 'bot' },
      ]);
      setOptions(['Điện thoại', 'Laptop', 'Máy tính bảng', 'Phụ kiện']);
    }
  }, [chatOpen]);

  useEffect(() => {
    if (searchLink) {
      // Sau 2 giây, hiển thị nút tìm kiếm
      const timer = setTimeout(() => {
        setShowSearchButton(true);
      }, 2000); // 2 giây

      return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }
  }, [searchLink]);



  //kiểm tra vai trò
  if (token) {
    try {
      const decoded = jwtDecode(token); // Giải mã token
      isAdmin = decoded.roles === "ROLE_ADMIN"; // Kiểm tra vai trò

    } catch (error) {
      console.error("Token không hợp lệ:", error);
    }
  }
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchLink || localKeyword) {
      const keywordToSearch = searchLink || localKeyword; // Chọn từ khóa tìm kiếm từ searchLink hoặc localKeyword
      setKeyword(keywordToSearch);
      setLoading(true);
      setErrorMessage('');

      try {
        const result = await fetch(`/api/search?query=${keywordToSearch}`);
        if (result.ok) {
          navigate('/categorys');
        } else {
          setErrorMessage('Không tìm thấy sản phẩm phù hợp.');
        }
      } catch (error) {
        setErrorMessage('Đã xảy ra lỗi khi tìm kiếm.');
      } finally {
        setLoading(false);
      }
    }
  };


  const handleOptionClick = (option) => {
    let newMessages = [...chatMessages];

    // Thêm lựa chọn của người dùng vào
    newMessages.push({ text: option, type: 'user' });

    if (option === 'Phụ kiện.') {
      setOptions(['Phụ kiện']);
      newMessages.push({ text: 'Chức năng này chưa có.', type: 'bot' });
    } else if (option === 'Điện thoại') {
      setOptions(['Apple', 'Samsung', 'Oppo', 'Xiaomi']);
      newMessages.push({ text: 'Vui lòng chọn hãng điện thoại bạn muốn tìm:', type: 'bot' });
    } else if (option === 'Laptop') {
      setOptions(['Acer', 'Asus', 'Dell', 'HP', 'MSI']);
      newMessages.push({ text: 'Vui lòng chọn hãng laptop bạn muốn tìm:', type: 'bot' });

    }
    //điện thoại
    else if (option === 'Apple') {
      setSearchLink('iPhone');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',

        type: 'bot',
      });
    } else if (option === 'Samsung') {
      setSearchLink('Samsung');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });
    } else if (option === 'Oppo') {
      setSearchLink('Oppo'); setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });
    } else if (option === 'Xiaomi') {
      setSearchLink('Xiaomi');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });



      //laptop
    } else if (option === 'Acer') {
      setSearchLink('Acer');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });
    } else if (option === 'Asus') {
      setSearchLink('Asus');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });
    } else if (option === 'Dell') {
      setSearchLink('Dell');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });
    } else if (option === 'HP') {
      setSearchLink('HP');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });
    } else if (option === 'MSI') {
      setSearchLink('MSI');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });

      //phụ kiện

    } else if (option === 'Phụ kiện') {
      setSearchLink('Phụ kiện');
      setOptions([]); // Ẩn các nút khi đã chọn
      newMessages.push({
        text: 'Đã tìm thành công. Vui lòng ấn vào đây để xem chi tiết.',
        type: 'bot',
      });


    } else {
      setOptions([]); // Ẩn các nút nếu không có lựa chọn hợp lệ
    }

    // Cập nhật lại các tin nhắn
    setChatMessages(newMessages);
  };

  // Reset lại trạng thái của trang
  // Hàm reset lại chat
  const handleResetChat = () => {
    setChatMessages([{ text: 'Xin chào! Tôi có thể giúp gì cho bạn?', type: 'bot' }]);
    setOptions(['Sản phẩm', 'Hỗ trợ']);
    setSearchLink('');
    setShowSearchButton(false);
  };

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setChatMessages(prevMessages => [
        ...prevMessages,
        { text: userMessage, type: 'user' }
      ]);
      setUserMessage('');
    }
  };







  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'vi-VN'; // Set the language for recognition (Vietnamese)
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setLocalKeyword(transcript);
      setKeyword(transcript);
      navigate('/categorys');
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };
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
  <Link to="/discount" className="menu-item">
    <i className="icon fa fa-gift"></i> Mã giảm giá
  </Link>
</li>

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
                    {isAdmin && (
                      <li>
                        <Link to="/admin" className="menu-item">Quản lý</Link>
                      </li>
                    )}
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
        width: '1567px'
      }}>
        <div className="container">
          <div className="row" style={{ width: '1330px' }}>
            <div className="col-xs-12 col-sm-12 col-md-3 logo-holder">
              <div className="logo">
                <Link to="/">
                  <img style={{
                    width: '120px',
                    height: '111px', marginRight: "100px"
                  }} src="/assets/images/banners/logo1.jpg" alt="logo" />
                </Link>
              </div>
            </div>

            <div className="col-xs-12 col-sm-12 col-md-6 top-search-holder">
              <div className="search-area" style={{ width: '620px' }}>
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


                  {/* Voice search button */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className="btn btn-warning d-flex align-items-center justify-content-center rounded-circle"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
                      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                      <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
                    </svg>
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
                  <ul className="nav navbar-nav" style={{ height: '55px', paddingLeft: '120px' }}>
                    <li className="active dropdown yamm-fw"><Link style={{ padding: '15px 20px 0 20px', height: '54px' }} to="/" className="dropdown-toggle">Trang chủ</Link></li>
                    <li className="dropdown yamm mega-menu"><Link style={{ padding: '15px 20px 0 20px', height: '54px' }} to="/categorys" onClick={() => handleCategoryClick(1)} className="dropdown-toggle" data-toggle="dropdown">Điện thoại di động</Link></li>
                    <li className="dropdown mega-menu"><Link style={{ padding: '15px 20px 0 20px', height: '54px' }} to="/categorys" onClick={() => handleCategoryClick(2)} className="dropdown-toggle" data-toggle="dropdown">Laptop</Link></li>
                    <li className="dropdown mega-menu"><Link style={{ padding: '15px 20px 0 20px', height: '54px' }} to="/categorys" onClick={() => handleCategoryClick(3)} className="dropdown-toggle" data-toggle="dropdown">Máy tính bảng</Link></li>
                    <li className="dropdown mega-menu"><Link style={{ padding: '15px 20px 0 20px', height: '54px' }} to="/categorys" onClick={() => handleCategoryClick(4)} className="dropdown-toggle" data-toggle="dropdown">Phụ kiện</Link></li>
                    <li className="dropdown yamm-fw"><Link style={{ padding: '15px 20px 0 20px', height: '54px' }} to="/categorys" onClick={() => handleCategoryClick()} className="dropdown-toggle">Sản phẩm</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <header className="header-style-1 container-fluid bg-light py-3">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-3 top-search">
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="btn btn-primary"
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span role="img" aria-label="chat">💬</span>
              </button>
            </div>
          </div>
        </div>

        {chatOpen && (
          <div className="chat-box" style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            width: '350px', // Increase width
            height: '500px', // Increase height
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Add smooth shadow
            padding: '20px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Arial, sans-serif',
          }}>
            <div className="chat-pointer" style={{
              position: 'absolute',
              bottom: '-10px', // Position below the chat box
              right: '20px', // Align with the chat button
              width: '0',
              height: '0',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #fff', // Color of the triangle (pointing downwards)
            }} />


            <div className="chat-header" style={{
              marginBottom: '20px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              borderBottom: '2px solid #007bff',
              paddingBottom: '10px',
            }}>
              Chat với chúng tôi
            </div>

            <div className="chat-messages" style={{
              height: '75%', // Adjust height for message area
              overflowY: 'auto',
              borderBottom: '1px solid #ddd',
              paddingBottom: '10px',
              marginBottom: '15px',
            }}>
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '12px',
                    opacity: 0,
                    animation: `fadeIn 0.3s ease-out forwards ${index * 0.2}s`,
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: msg.type === 'user' ? '#0066cc' : '#444',
                      backgroundColor: msg.type === 'user' ? '#e0f7fa' : '#f4f4f4',
                      borderRadius: '15px',
                      padding: '10px 15px',
                      maxWidth: '80%',
                      fontWeight: msg.type === 'user' ? 'bold' : 'normal',
                      textAlign: msg.type === 'user' ? 'right' : 'left',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}

              {options.length > 0 && (
                <div className="chat-options" style={{
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between', // Align options in a row
                  flexWrap: 'wrap', // Allow options to wrap if needed
                }}>
                  {options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="btn btn-secondary"
                      style={{
                        padding: '6px 12px', // Smaller button size
                        fontSize: '12px', // Smaller font size
                        borderRadius: '8px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        marginBottom: '5px',
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {searchLink && !loading && showSearchButton && (
                <a
                  href="#"
                  onClick={handleSearch}
                  className="btn btn-info"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                    color: '#007bff',
                    border: 'none',
                    padding: '0',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'color 0.3s ease',
                  }}
                >
                  Tìm kiếm
                </a>
              )}

              {loading && <div className="text-center" style={{ color: '#007bff' }}>Đang tìm kiếm...</div>}
              {errorMessage && <div className="text-danger text-center">{errorMessage}</div>}
            </div>

            {/* Reset button */}
            <button
              onClick={handleResetChat}
              className="btn btn-danger"
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
              </svg>
              <span style={{ marginLeft: '8px' }}>Làm mới</span>
            </button>
          </div>
        )}
      </header>

    </header>



  );
};

export default Header;