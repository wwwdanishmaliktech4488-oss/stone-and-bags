import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop'; // <-- NEW IMPORT
import ProductDetail from './pages/ProductDetail'; // <-- NEW IMPORT
import About from './pages/About';
import TrackOrder from './pages/TrackOrder';
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout'; 
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders'; 
import AdminSettings from './pages/AdminSettings';
import AdminPages from './pages/AdminPages';
import AdminReviews from './pages/AdminReviews'; // <-- NEW IMPORT

function App() {
  const isAuthenticated = !!localStorage.getItem('adminToken');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} /> {/* <-- NEW ROUTE */}
      <Route path="/product/:id" element={<ProductDetail />} /> {/* <-- NEW ROUTE */}
      <Route path="/about" element={<About />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
      <Route path="/admin/products" element={isAuthenticated ? <AdminProducts /> : <Navigate to="/admin/login" replace />} />
      <Route path="/admin/orders" element={isAuthenticated ? <AdminOrders /> : <Navigate to="/admin/login" replace />} />
      <Route path="/admin/reviews" element={isAuthenticated ? <AdminReviews /> : <Navigate to="/admin/login" replace />} /> {/* <-- NEW ROUTE */}
      <Route path="/admin/settings" element={isAuthenticated ? <AdminSettings /> : <Navigate to="/admin/login" replace />} />
      <Route path="/admin/pages" element={isAuthenticated ? <AdminPages /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default App;