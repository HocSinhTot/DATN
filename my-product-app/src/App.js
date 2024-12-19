import React, { useState } from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from './components/user/index';
import Cart from './components/user/cart';
import Login from './components/accounts/login';
import Register from './components/accounts/register';
import Change from './components/accounts/change';
import Categorys from './components/user/category';
import ProductDetail from './components/user/productDetail';
import Invoice from './components/user/invoice';
import Account from './components/user/account';
import Footer from './components/layout/footer';
import Header from './components/layout/header';
import VnPay from './components/user/vnPay';
import Favorite from './components/user/favorite';
import Forgot from './components/accounts/forgot';
import Discount from './components/user/discount';

// admin imports
import Headeradmin from './components/admin/formadmin/headeradmin';
import Indexadmin from './components/admin/index';
import ProductAdmin from './components/admin/products';
import ColorAmin from './components/admin/color';
import UserAdmin from './components/admin/user';
import CategoryAmin from './components/admin/category';
import BrandsAmin from './components/admin/brands';
import CapacityAmin from './components/admin/capacity';
import ImagesAmin from './components/admin/images';
import FavouriteAmin from './components/admin/favourite';
import EvaluaesAmin from './components/admin/evaluaes';
import ProductsPrice from './components/admin/productprice';
import ProductsImage from './components/admin/productimages';
import DiscountsAmin from './components/admin/discounts';


import ThongkeAdmin from './components/admin/Thongke';


import OrderAmin from './components/admin/order';

import OrderHistory from './components/user/order';
import ProtectedRoute from './ProtectedRoute';






function App() {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Giả lập trạng thái đăng nhập



  return (
    <div className="App">
      <Routes>
        {/* Các route không yêu cầu đăng nhập */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/product/:id" element={
          <>
            <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
            <ProductDetail />
            <Footer />
          </>
        } />

        <Route path="/categorys" element={
          <>
            <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
            <Categorys keyword={keyword} categoryId={categoryId} setCategoryId={setCategoryId} />
            <Footer />
          </>
        } />
        <Route path="/" element={
          <>
            <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
            <Index />
            <Footer />
          </>
        } />

        {/* Các route yêu cầu đăng nhập */}
        <Route path="/account" element={
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Account />
              <Footer />
            </>
          </ProtectedRoute>
        } />
        {/* Các route yêu cầu đăng nhập */}

        <Route path="/change" element={
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <>
              <Change />
            </>
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <OrderHistory />
              <Footer />
            </>
          </ProtectedRoute>
        } />
        <Route path="/like" element={
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Favorite />
              <Footer />
            </>
          </ProtectedRoute>
        } />
         <Route path="/discount" element={
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Discount />
              <Footer />
            </>
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Cart />
              <Footer />
            </>
          </ProtectedRoute>
        } />
        <Route path="/invoice" element={
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Invoice />
              <Footer />
            </>
          </ProtectedRoute>
        } />
        <Route path="/vnPay" element={<ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}><VnPay /></ProtectedRoute>} />

        {/* Routes cho admin (yêu cầu quyền admin) */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <Indexadmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/nguoidung" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <UserAdmin />
            </>
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <ProductAdmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/category" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <CategoryAmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/brands" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <BrandsAmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/color" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <ColorAmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/capacity" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <CapacityAmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/images" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <ImagesAmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/order" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <OrderAmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/favourite" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <FavouriteAmin />
            </>
          </ProtectedRoute>
        } />

        <Route path="/evaluaes" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <EvaluaesAmin />
            </>
          </ProtectedRoute>
        } />
        <Route path="/products-prices" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <ProductsPrice />
            </>
          </ProtectedRoute>
        } />
        <Route path="/products-images" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <ProductsImage />
            </>
          </ProtectedRoute>
        } />
        <Route path="/discounts" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <DiscountsAmin />
            </>
          </ProtectedRoute>
        } />

        <Route path="/totalRevenue" element={
          <ProtectedRoute roles={['ROLE_ADMIN']}>
            <>
              <Headeradmin />
              <ThongkeAdmin />
            </>
          </ProtectedRoute>
        } />
      </Routes>





    </div>
  );
}

export default App;
