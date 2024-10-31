import React from 'react';
import NavBar from "./components/Nav/NavBar";
const LazyContact = React.lazy(() => import("./pages/Contact"));
const LazyNotFound = React.lazy(() => import('./pages/NotFound'));
const LazyAbout = React.lazy(() => import('./pages/About'));
import Login from "./components/Login/Login";
import UserDashboard from "./components/Dashboard/UserDashboard"
import { Route, Routes } from 'react-router-dom';
import StockChart from "./components/Service/StockChart";
import CryptoCurrencyInfo from "./pages/CryptoPage";
import CommodityInfo from "./pages/Commodity"
import FinancialInfo from "./pages/Financialinfo"
import CaseManagement from './pages/CaseManagement'
import Signup from "./pages/Singup"
import "./app.css"
function App() {
  return (
    <div className="App" style={{ display: 'flex'}}>
      {/* Sidebar */}
      <div 
        className="sidebar"
      >
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

      {/* Main Content */}
      <div style={{ 
        marginLeft: '60px',
        flex: 1,
        transition: 'all 0.3s ease',
        width: '100vw',
      }}>
        
        <React.Suspense fallback={<div>Loading...</div>}>
          <NavBar />
        </React.Suspense>
        <div style={{ marginBottom: "30px" }}>
          <Routes>
            <Route path='login' element={<Login />} />
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

            <Route path='signup' element={<Signup />} />

            <Route path='case' element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <CaseManagement />
              </React.Suspense>
            } />

            <Route path='stock' element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <StockChart />
              </React.Suspense>
            } />
             
            <Route path='financialchart' element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <FinancialInfo/>
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

            <Route path='/' element={<UserDashboard />} /> 
            <Route path='*' element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <LazyNotFound />
              </React.Suspense>
            } />
          </Routes>
        </div>
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
