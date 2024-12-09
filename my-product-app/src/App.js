import React, { useState } from 'react';  // Thêm useState vào đây
import './App.css';
import { Route, Routes } from 'react-router-dom';  // Import các thành phần của React Router
import Index from './components/user/index';
import Cart from './components/user/cart';
import Login from './components/accounts/login';
import Register from './components/accounts/register';
import Change from './components/accounts/change';
import Categorys from './components/user/category';
import ProductDetail from './components/user/productDetail';
import Invoice from './components/user/invoice'
import Account from './components/user/account';
import Footer from './components/layout/footer';
import Head from './components/layout/head';
import Header from './components/layout/header';
import VnPay from './components/user/vnPay';
import Favorite from './components/user/favorite'



//admin


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


import OrderAmin from './components/admin/order';
import EditCategoryAmin from './components/admin/editCategory';
import EditBrandAmin from './components/admin/editBrand';
import EditCapacityAmin from './components/admin/editCapacity';
import EditImageAmin from './components/admin/editImage';

import OrderHistory from './components/user/order';
import AddCategoryAmin from './components/admin/addCategory';
import AddBrandAmin from './components/admin/addBrand';

import AddCapacityAmin from './components/admin/addCapacity';
import AddImageAmin from './components/admin/addImage';


function App() {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  return (
    <div className="App">
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change" element={<Change />} />





        <Route path="/category/add" element={<AddCategoryAmin />} />
        <Route path="/category/edit/:id" element={<EditCategoryAmin />} />

        <Route path="/brands/add" element={<AddBrandAmin />} />
        <Route path="/brands/edit/:id" element={<EditBrandAmin />} />



        <Route path="/capacity/add" element={<AddCapacityAmin />} />
        <Route path="/capacity/edit/:id" element={<EditCapacityAmin />} />

        <Route path="/images/add" element={<AddImageAmin />} />
        <Route path="/images/edit/:id" element={<EditImageAmin />} />


        <Route
          path="/product/:id"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <ProductDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Account />
              <Footer />
            </>
          }
        />
        <Route
          path="/history"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <OrderHistory />
              <Footer />
            </>
          }
        />
        <Route
          path="/like"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Favorite />
              <Footer />
            </>
          }
        />
        <Route
          path="/categorys"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Categorys keyword={keyword}
                categoryId={categoryId}
                setCategoryId={setCategoryId} />
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />

              <Cart />
              <Footer />
            </>
          }
        />
        <Route
          path="/invoice"
          element={
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />

              <Invoice />
              <Footer />
            </>
          }
        />
        <Route
          path="/vnPay"
          element={
            <>
              <VnPay />
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
              <Header setKeyword={setKeyword} setCategoryId={setCategoryId} />
              <Index />
              <Footer />
            </>
          }
        />



        <Route
          path="/admin"
          element={
            <>
              <Headeradmin />
              <Indexadmin />
            </>
          }
        />
        <Route
          path="/nguoidung"
          element={
            <>
              <Headeradmin />
              <UserAdmin />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <Headeradmin />
              <ProductAdmin />
            </>
          }
        />

        <Route
          path="/category"
          element={
            <>
              <Headeradmin />
              <CategoryAmin />
            </>
          }
        />

        <Route
          path="/brands"
          element={
            <>
              <Headeradmin />
              <BrandsAmin />
            </>
          }
        />



        <Route
          path="/color"
          element={
            <>
              <Headeradmin />
              <ColorAmin />
            </>
          }
        />

        <Route
          path="/capacity"
          element={
            <>
              <Headeradmin />
              <CapacityAmin />
            </>
          }
        />


        <Route
          path="/images"
          element={
            <>
              <Headeradmin />
              <ImagesAmin />
            </>
          }
        />

        <Route
          path="/order"
          element={
            <>
              <Headeradmin />
              <OrderAmin />
            </>
          }
        />

        <Route
          path="/favourite"
          element={
            <>
              <Headeradmin />
              <FavouriteAmin />
            </>
          }
        />
        <Route
          path="/evaluaes"
          element={
            <>
              <Headeradmin />
              <EvaluaesAmin />
            </>
          }
        />
        <Route
          path="/products-prices"
          element={
            <>
              <Headeradmin />
              <ProductsPrice />
            </>
          }
        />
        <Route
          path="/products-images"
          element={
            <>
              <Headeradmin />
              <ProductsImage />
            </>
          }
        />


      </Routes>


    </div>
  );
}

export default App;