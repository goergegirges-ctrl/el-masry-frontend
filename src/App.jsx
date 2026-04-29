import React, { useState, lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import { useTheme } from './context/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import useScrollReveal from './hooks/useScrollReveal'
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs'
import MobileNavbar from './components/MobileNavbar/MobileNavbar'
import { Helmet } from 'react-helmet-async'
import { StoreContext } from './context/StoreContext'
import { useContext } from 'react'

const Cart = lazy(() => import('./pages/Cart/Cart'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const ProductDetails = lazy(() => import('./pages/ProductDetails/ProductDetails'))
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'))
const Login = lazy(() => import('./pages/Login/Login'))
const Register = lazy(() => import('./pages/Register/Register'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const Search = lazy(() => import('./pages/Search/Search'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess/OrderSuccess'))
const MyOrders = lazy(() => import('./pages/MyOrders/MyOrders'))
const OrderDetail = lazy(() => import('./pages/OrderDetail/OrderDetail'))
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'))
const AuthCallback = lazy(() => import('./pages/AuthCallback/AuthCallback'))

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  useScrollReveal();
  const { theme } = useTheme();

  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
      <Helmet>
        <title>El-Masry Electronics | Leading Parts & Tech Store</title>
        <meta name="description" content="Shop the best electronics, auto parts, and tech components at El-Masry Egypt." />
      </Helmet>
      <div className='app reveal-on-scroll'>
        <Navbar setSelectedProduct={setSelectedProduct} />
        <Breadcrumbs />
        <Suspense fallback={<div className="page-spinner" />}>
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
            <Route path='/auth/callback' element={<AuthCallback />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <MobileNavbar />
    </>
  )
}

export default App
