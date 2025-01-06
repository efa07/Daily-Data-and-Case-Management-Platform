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
import CaseOverviewPage from './pages/CaseOverviewPage';
import SyncLoader from "react-spinners/SyncLoader";

import "./app.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [animateArrow, setAnimateArrow] = useState(true);
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';
  const isNotFoundRoute = location.pathname === '*' || !([
    '/', '/about', '/contact', '/case', '/stock',
    '/financialchart', '/crypto', '/commodities',
    '/login', '/signup', '/casepage'
  ].includes(location.pathname));

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.username : '';

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
  }, []);

  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(notification => notification.id !== id)
    );
    navigate('/case');
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      {!shouldHideNav && (
        <div className="sidebar">
          <div className="sidebar-toggle">
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'black',
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}>
              {'←'}
            </button>
          </div>

          <div className="sidebar-links">
            <a
              href="/"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                e.currentTarget.style.borderColor = hoverStyle.borderColor;
                e.currentTarget.style.transform = hoverStyle.transform;
                e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = linkStyle.backgroundColor;
                e.currentTarget.style.borderColor = linkStyle.borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = linkStyle.boxShadow;
              }}
            >
              Dashboard
            </a>
            <a
              href="/crypto"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                e.currentTarget.style.borderColor = hoverStyle.borderColor;
                e.currentTarget.style.transform = hoverStyle.transform;
                e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = linkStyle.backgroundColor;
                e.currentTarget.style.borderColor = linkStyle.borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = linkStyle.boxShadow;
              }}
            >
              Crypto
            </a>
            <a
              href="/commodities"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                e.currentTarget.style.borderColor = hoverStyle.borderColor;
                e.currentTarget.style.transform = hoverStyle.transform;
                e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = linkStyle.backgroundColor;
                e.currentTarget.style.borderColor = linkStyle.borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = linkStyle.boxShadow;
              }}
            >
              Commodities
            </a>
            <a
              href="/financialchart"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                e.currentTarget.style.borderColor = hoverStyle.borderColor;
                e.currentTarget.style.transform = hoverStyle.transform;
                e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = linkStyle.backgroundColor;
                e.currentTarget.style.borderColor = linkStyle.borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = linkStyle.boxShadow;
              }}
            >
              Financial Chart
            </a>
            <a
              href="/case"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
                e.currentTarget.style.borderColor = hoverStyle.borderColor;
                e.currentTarget.style.transform = hoverStyle.transform;
                e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = linkStyle.backgroundColor;
                e.currentTarget.style.borderColor = linkStyle.borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = linkStyle.boxShadow;
              }}
            >
              Case Management
            </a>
          </div>
        </div>
      )}

      <div style={{
        marginLeft: shouldHideNav ? '0' : '60px',
        flex: 1,
        transition: 'all 0.3s ease',
        width: '100vw',
      }}>
        {!shouldHideNav && <NavBar
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />}

        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='casepage' element={<CaseOverviewPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<UserDashboard />} />
            <Route path='about' element={
              <React.Suspense fallback={<SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            />}>
                <LazyAbout />
              </React.Suspense>
            } />
            <Route path='contact' element={
              <React.Suspense fallback={<SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            />}>
                <LazyContact />
              </React.Suspense>
            } />
            <Route path='case' element={
              <React.Suspense fallback={<SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            />}>
                <CaseManagement />
              </React.Suspense>
            } />
            <Route path='stock' element={
              <React.Suspense fallback={<SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            />}>
                <CoffeeChart />
              </React.Suspense>
            } />
            <Route path='financialchart' element={
              <React.Suspense fallback={<SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            />}>
                <FinancialInfo />
              </React.Suspense>
            } />
            <Route path='crypto' element={
              <React.Suspense fallback={<SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            />}>
                <CryptoCurrencyInfo />
              </React.Suspense>
            } />
            <Route path='commodities' element={
              <React.Suspense fallback={<SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            />}>
                <CommodityInfo />
              </React.Suspense>
            } />
          </Route>
          <Route path='*' element={
            <React.Suspense fallback={<SyncLoader
              color="#6c5ce7"
              margin={5}
              size={25}
          />}>
              <LazyNotFound />
            </React.Suspense>
          } />
        </Routes>
      </div>
    </div>
  );
}
const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  padding: '0.8rem 1.2rem',
  fontSize: '1rem',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  backgroundColor: '#6c5ce7',
  border: '2px solid #6c5ce7',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const hoverStyle = {
  backgroundColor: '#5a4dbf',
  borderColor: '#5a4dbf',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};


export default App;