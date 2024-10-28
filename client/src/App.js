import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbarComponents/Navbar';
import HomePage from './components/homeComponents/HomePage';
import PredictionPage from './components/predictionComponents/PredictionPage';
import ProductPage from './components/productComponents/ProductPage';
import CustomerPage from './components/customerComponents/CustomerPage';
import DelivererPage from './components/delivererComponents/DelivererPage';
import OrderForm from './components/orderComponents/OrderForm';
import OrderCard from './components/orderComponents/OrderCard';
import UserPage from './components/userComponents/UserPage';
import UserProfile from './components/profileComponents/UserProfile';
import NotificationPage from './components/notificationComponents/NotificationPage';
import LoginPage from './components/loginComponents/loginPage';
import RegisterPage from './components/loginComponents/registerPage';

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && <><Navbar /><div style={{ marginTop: '100px' }}></div></>}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/prediction" element={<PredictionPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/deliverer" element={<DelivererPage />} />
        <Route path="/order-form" element={<OrderForm />} />
        <Route path="/order-list" element={<OrderCard />} />
        <Route path="/order-list/:customerId" element={<OrderCard />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/notification" element={<NotificationPage />} />
      </Routes>
    </>
  );
};

export default App;
