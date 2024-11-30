import React, { useState, useEffect } from 'react';

const SideMenu = () => {
  // Giả sử danh mục được lấy từ API hoặc là dữ liệu mẫu
  const [categories, setCategories] = useState([]);

  // Dữ liệu mẫu cho categories
  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API (thay thế bằng gọi API thực tế)
    const fetchedCategories = [
      { name: 'iPhone', products: ['iPhone9', 'iPhoneX', 'iPhone11', 'iPhone12', 'iPhone13', 'iPhone14', 'iPhone15'] },
      { name: 'Galaxy', products: ['Galaxy M', 'Galaxy A', 'Galaxy S', 'Galaxy Z'] },
      { name: 'OPPO', products: ['OPPO Find N', 'OPPO A', 'OPPO Reno'] },
      { name: 'Xiaomi', products: ['Xiaomi Mi', 'Xiaomi Redmi', 'Redmi 12', 'Redmi Note 13'] },
    ];
    setCategories(fetchedCategories);
  }, []);

  return (
    <div className="side-menu animate-dropdown outer-bottom-xs">
      <div className="head">
        <i className="icon fa fa-align-justify fa-fw"></i> Danh mục
      </div>
      <nav className="yamm megamenu-horizontal">
        <ul className="nav">
          {/* Lặp qua các category */}
          {categories.map((category, index) => (
            <li className="dropdown menu-item" key={index}>
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                {category.name}
              </a>
              <ul className="dropdown-menu mega-menu">
                <li className="yamm-content">
                  <div className="row">
                    {/* Hiển thị các sản phẩm của mỗi category */}
                    <div className="col-sm-12 col-md-3">
                      <ul className="links list-unstyled">
                        {category.products.map((product, idx) => (
                          <li key={idx}>
                            <a href="#">{product}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li> {/* /.yamm-content */}
              </ul> {/* /.dropdown-menu */}
            </li>
          ))}
        </ul> {/* /.nav */}
      </nav> {/* /.megamenu-horizontal */}
    </div>
  );
};

export default SideMenu;
