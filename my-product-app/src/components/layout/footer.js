import React from 'react';

const Footer = () => {
  return (
    <footer id="footer" className="footer color-bg">
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            {/* Liên hệ với chúng tôi */}
            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="module-heading">
                <h4 className="module-title">Liên hệ với chúng tôi</h4>
              </div>
              <div className="module-body">
                <ul className="toggle-footer">
                  <li className="media">
                    <div className="pull-left">
                      <span className="icon fa-stack fa-lg">
                        <i className="fa fa-map-marker fa-stack-1x fa-inverse"></i>
                      </span>
                    </div>
                    <div className="media-body">
                      <p>Toà nhà FPT Polytechnic, đường số 22, phường Thường Thạnh, quận Cái Răng, TP Cần Thơ</p>
                    </div>
                  </li>
                  <li className="media">
                    <div className="pull-left">
                      <span className="icon fa-stack fa-lg">
                        <i className="fa fa-mobile fa-stack-1x fa-inverse"></i>
                      </span>
                    </div>
                    <div className="media-body">
                      <p>098 388 1100 <br /> 091 2823 492</p>
                    </div>
                  </li>
                  <li className="media">
                    <div className="pull-left">
                      <span className="icon fa-stack fa-lg">
                        <i className="fa fa-envelope fa-stack-1x fa-inverse"></i>
                      </span>
                    </div>
                    <div className="media-body">
                      <span><a href="mailto:caodang@fpt.edu.vn">caodang@fpt.edu.vn</a></span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Dịch vụ khách hàng */}
            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="module-heading">
                <h4 className="module-title">DỊCH VỤ KHÁCH HÀNG</h4>
              </div>
              <div className="module-body">
                <ul className="list-unstyled">
                  <li><a href="#">Tài khoản của tôi</a></li>
                  <li><a href="#">Lịch sử đặt hàng</a></li>
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#">Đặc biệt</a></li>
                  <li><a href="#">Trung tâm trợ giúp</a></li>
                </ul>
              </div>
            </div>

            {/* Công ty */}
            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="module-heading">
                <h4 className="module-title">Công ty</h4>
              </div>
              <div className="module-body">
                <ul className="list-unstyled">
                  <li><a href="#">Về chúng tôi</a></li>
                  <li><a href="#">Chăm sóc khách hàng</a></li>
                  <li><a href="#">Quan hệ nhà đầu tư</a></li>
                  <li><a href="#">Tìm kiếm nâng cao</a></li>
                </ul>
              </div>
            </div>

            {/* Tại sao chọn chúng tôi */}
            <div className="col-xs-12 col-sm-6 col-md-3">
              <div className="module-heading">
                <h4 className="module-title">Tại sao chọn chúng tôi</h4>
              </div>
              <div className="module-body">
                <ul className="list-unstyled">
                  <li><a href="#">Hướng dẫn mua hàng</a></li>
                  <li><a href="#">Tin tức</a></li>
                  <li><a href="#">Công ty</a></li>
                  <li><a href="#">Quan hệ nhà đầu tư</a></li>
                  <li><a href="#">Liên hệ với chúng tôi</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="copyright-bar">
        <div className="container">
          <div className="col-xs-12 col-sm-6 no-padding social">
            <ul className="link">
              <li className="fb pull-left"><a href="#" title="Facebook" target="_blank" rel="nofollow"></a></li>
              <li className="tw pull-left"><a href="#" title="Twitter" target="_blank" rel="nofollow"></a></li>
              <li className="googleplus pull-left"><a href="#" title="GooglePlus" target="_blank" rel="nofollow"></a></li>
              <li className="rss pull-left"><a href="#" title="RSS" target="_blank" rel="nofollow"></a></li>
              <li className="pintrest pull-left"><a href="#" title="PInterest" target="_blank" rel="nofollow"></a></li>
              <li className="linkedin pull-left"><a href="#" title="Linkedin" target="_blank" rel="nofollow"></a></li>
              <li className="youtube pull-left"><a href="#" title="Youtube" target="_blank" rel="nofollow"></a></li>
            </ul>
          </div>
          <div className="col-xs-12 col-sm-6 no-padding">
            <div className="clearfix payment-methods">
              <ul>
                <li><img src="/assets/images/payments/1.png" alt="Payment Method 1" /></li>
                <li><img src="/assets/images/payments/2.png" alt="Payment Method 2" /></li>
                <li><img src="/assets/images/payments/3.png" alt="Payment Method 3" /></li>
                <li><img src="/assets/images/payments/4.png" alt="Payment Method 4" /></li>
                <li><img src="/assets/images/payments/5.png" alt="Payment Method 5" /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
