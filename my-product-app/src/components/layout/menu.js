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
    
    </div>
  );
};

export default SideMenu;
