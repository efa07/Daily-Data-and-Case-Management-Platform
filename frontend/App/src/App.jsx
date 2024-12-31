import React, { useEffect, useState } from 'react';
import NavBar from "./components/Nav/NavBar";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const LazyContact = React.lazy(() => import("./pages/Contact"));
const LazyNotFound = React.lazy(() => import('./pages/NotFound'));
const LazyAbout = React.lazy(() => import('./pages/About'));
import axios from 'axios';
import Login from "./components/Login/Login";
import UserDashboard from "./components/Dashboard/UserDashboard";
import CoffeeChart from "./components/Service/CoffeeChart";
import CryptoCurrencyInfo from "./pages/CryptoPage";
import CommodityInfo from "./pages/Commodity";
import FinancialInfo from "./pages/Financialinfo";
import CaseManagement from './pages/CaseManagement';
import Signup from "./pages/Singup";
import ProtectedRoute from './components/Auth/ProtectedRoute';
import "./app.css";
import "./index.css"

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [animateArrow, setAnimateArrow] = useState(true);
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';
  const isNotFoundRoute = location.pathname === '*' || !([
    '/', '/about', '/contact', '/case', '/stock', 
    '/financialchart', '/crypto', '/commodities',
    '/login', '/signup'
  ].includes(location.pathname));
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateArrow(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);
  const shouldHideNav = isAuthRoute || isNotFoundRoute;
  const [token] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (location.pathname === '/' && !token) {
      navigate('/login');
    }
  }, [location.pathname, token, navigate]);

useEffect(() => {
  const fetchCases = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/cases');
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  }
  fetchCases();
}
, []);
const handleNotificationClick = (id) => {
  setNotifications((prevNotifications) =>
    prevNotifications.filter(notification => notification.id !== id)
  );
  navigate('/case'); 
}
  return (
    <div className="App" style={{ display: 'flex' }}>
      {/* Sidebar */}
      {!shouldHideNav && (
        <div className="sidebar">
          <div className="sidebar-toggle">
            <button 
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}>
              {'←'} 
            </button>
          </div>
          
          <div className="sidebar-links">
            <a href="/" style={linkStyle}>Dashboard</a>
            <a href="/crypto" style={linkStyle}>Crypto</a>
            <a href="/commodities" style={linkStyle}>Commodities</a>
            <a href="/financialchart" style={linkStyle}>Financial Chart</a>
            <a href='/case' style={linkStyle}>Case Management</a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ 
        marginLeft: shouldHideNav ? '0' : '60px',
        flex: 1,
        transition: 'all 0.3s ease',
        width: '100vw',
      }}>
        
        {/* Only render NavBar if not on auth routes or unknown routes */}
        {!shouldHideNav && <NavBar
          notifications={notifications}
          onNotificationClick={handleNotificationClick} 
        />
      }
      
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route element={<ProtectedRoute />}>
            <Route path='/' element={<UserDashboard />} />
              <Route path='about' element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <LazyAbout />
                </React.Suspense>
              } />
              <Route path='contact' element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <LazyContact />
                </React.Suspense>
              } />
              <Route path='case' element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <CaseManagement />
                </React.Suspense>
              } />
              <Route path='stock' element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <CoffeeChart />
                </React.Suspense>
              } />
              <Route path='financialchart' element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <FinancialInfo />
                </React.Suspense>
              } />
              <Route path='crypto' element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <CryptoCurrencyInfo />
                </React.Suspense>
              } />
              <Route path='commodities' element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <CommodityInfo />
                </React.Suspense>
              } />
              
            </Route>
            
            <Route path='*' element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <LazyNotFound />
              </React.Suspense>
            } />
          </Routes>

        </div>
      </div>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '0.8rem',
  fontSize: '1.3rem',
  borderRadius: '4px',
  transition: 'background-color 0.3s ease',
};

export default App;