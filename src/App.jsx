import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import Footer from './components/Footer/Footer'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import useScrollReveal from './hooks/useScrollReveal'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Profile from './pages/Profile/Profile'
import Search from './pages/Search/Search'
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs'
import OrderSuccess from './pages/OrderSuccess/OrderSuccess'
import MyOrders from './pages/MyOrders/MyOrders'
import OrderDetail from './pages/OrderDetail/OrderDetail'
import Wishlist from './pages/Wishlist/Wishlist'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import MobileNavbar from './components/MobileNavbar/MobileNavbar'
import { Helmet } from 'react-helmet-async'
import { StoreContext } from './context/StoreContext'
import { useContext } from 'react'

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  useScrollReveal();

  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <Helmet>
        <title>El-Masry Electronics | Leading Parts & Tech Store</title>
        <meta name="description" content="Shop the best electronics, auto parts, and tech components at El-Masry Egypt." />
      </Helmet>
      <div className='app reveal-on-scroll'>
        <Navbar setSelectedProduct={setSelectedProduct} />
        <Breadcrumbs />
        <Routes>
          <Route path='/' element={<Home selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />} />
          <Route path='/product' element={<Navigate to="/" />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/category' element={<Navigate to="/" />} />
          <Route path='/category/:categorySlug' element={<CategoryPage />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/search' element={<Search />} />
          <Route path='/order-success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path='/my-orders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path='/orders/:id' element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
        </Routes>
      </div>
      <Footer />
      <MobileNavbar />
    </>
  )
}

export default App
