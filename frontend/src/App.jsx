import React, { useContext } from 'react'
import "./App.css";
import { Routes,Route } from 'react-router-dom'
import useScrollToTop from './hooks/useScrollToTop'
import Home from './pages/Home/Home'
import Collections from './pages/Collections/Collections'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Product from './pages/Product/Product'
import Cart from './pages/Cart/Cart'
import Login from './pages/Login/Login'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Orders from './pages/Orders/Orders'
import Navbar from './components/Navbar'
import Women from './pages/Women/Women'
import Men from './pages/Men/Men.jsx';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import PromoNewsletter from './components/PromoNewsletter';
import { ToastContainer } from 'react-toastify';
import Verify from './pages/Verify/Verify.jsx';
import ReWearDashboard from './pages/Rewear/ReWearDashboard.jsx';
import RewearUpload from './pages/RewearUpload/RewearUpload.jsx';
import Profile from './pages/Profile/Profile.jsx';
import ForgotPassword from './pages/Login/ForgotPassword.jsx';
import FAQ from './pages/FAQ/FAQ.jsx';
import SearchResults from './pages/SearchResults/SearchResults.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginModal from './components/LoginModal.jsx';
import { StoreContext } from './context/StoreContext.jsx';
import WishlistPage from './pages/Wishlist/WishlistPage.jsx';


const App = () => {
  useScrollToTop();
  const { showLoginModal, setShowLoginModal } = useContext(StoreContext);

  return (
    <div id="root">
      <ToastContainer />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      <div className="main-content">
        <Routes>
          {/* Routes with Navbar */}
          <Route path='/' element={<><Navbar /><Home /></>} />
          <Route path='/collection' element={<><Navbar /><Breadcrumbs /><Collections /><PromoNewsletter /></>} />
          <Route path='/about' element={<><Navbar /><Breadcrumbs /><About /></>} />
          <Route path='/contact' element={<ProtectedRoute><Navbar /><Breadcrumbs /><Contact /></ProtectedRoute>} />
          <Route path='/product/:productId' element={<><Navbar /><Breadcrumbs /><Product /></>} />
          <Route path='/cart' element={<ProtectedRoute><Navbar /><Breadcrumbs /><Cart /></ProtectedRoute>} />
          <Route path='/place-order' element={<ProtectedRoute><Navbar /><PlaceOrder /></ProtectedRoute>} />
          <Route path='/orders' element={<ProtectedRoute><Navbar /><Breadcrumbs /><Orders /></ProtectedRoute>} />
          <Route path='/women' element={<><Navbar /><Breadcrumbs /><Women /></>} />
          <Route path='/men' element={<><Navbar /><Breadcrumbs /><Men /></>} />
          <Route path='/verify' element={<ProtectedRoute><Navbar /><Breadcrumbs /><Verify /> </ProtectedRoute>} />
          <Route path='/rewear' element={<ProtectedRoute><Navbar /><Breadcrumbs /><ReWearDashboard /> </ProtectedRoute>} />
          <Route path='/rewear/upload' element={<ProtectedRoute><Navbar /><Breadcrumbs /> <RewearUpload /> </ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Navbar /><Breadcrumbs /> <Profile /> </ProtectedRoute>} />
          <Route path='/wishlist' element={<ProtectedRoute><Navbar /><Breadcrumbs /> <WishlistPage /> </ProtectedRoute>} />
          <Route path='/faq' element={<><Navbar /><Breadcrumbs /> <FAQ /> </>} />
          <Route path='/search' element={<><Navbar /><Breadcrumbs /><SearchResults /></>} />
          <Route path='/forgot-password' element={<ForgotPassword />} />

          {/* Route without Navbar */}
          <Route path='/login-or-signup' element={<Login />} />

          {/* 404 Not Found Route - Must be last */}
          <Route path='*' element={<><Navbar /><NotFound /></>} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
