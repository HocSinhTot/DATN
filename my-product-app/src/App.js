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

import OrderAmin from './components/admin/order';




import EditUserAmin from './components/admin/editUser';
import EditProductAmin from './components/admin/editProduct';
import AddUserAmin from './components/admin/addUser';
import AddProductAmin from './components/admin/addProduct';
function App() {
  const [keyword, setKeyword] = useState('');
  const [ categoryId, setCategoryId] = useState('');
  return (
    <div className="App">
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change" element={<Change />} />


    

        <Route path="/nguoidung/add" element={<AddUserAmin />} />
        <Route path="/nguoidung/edit/:id" element={<EditUserAmin />} />
<<<<<<< HEAD
        

=======
        <Route path="/products/add" element={<AddProductAmin />} />
        <Route path="/products/edit/:id" element={<EditProductAmin />} />
>>>>>>> origin/sang2
        <Route
          path="/product/:id"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId}/>
              <ProductDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId}/>
              <Account/>
              <Footer />
            </>
          }
        />
         <Route
          path="/like"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId}/>
              <Favorite/>
              <Footer />
            </>
          }
        />
        <Route
          path="/categorys"
          element={
            <>

              <Header setKeyword={setKeyword} setCategoryId={setCategoryId}/>
              <Categorys   keyword={keyword} 
                categoryId={categoryId} 
                setCategoryId={setCategoryId}/>
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
 <Header setKeyword={setKeyword} setCategoryId={setCategoryId}/>
             
              <Cart />
              <Footer />
            </>
          }
        />
         <Route
          path="/invoice"
          element={
            <>
              <Invoice />
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
                <Header setKeyword={setKeyword} setCategoryId={setCategoryId}/>
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


      </Routes>

      
    </div>
  );
}

export default App;