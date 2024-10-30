import React from 'react';
import NavBar from "./components/Nav/NavBar";
const LazyContact = React.lazy(() => import("./pages/Contact"));
const LazyNotFound = React.lazy(() => import('./pages/NotFound'));
const LazyAbout = React.lazy(() => import('./pages/About'));
import Login from "./components/Login/Login";
import UserDashboard from "./components/Dashboard/UserDashboard"
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
const LazyFinancialChart = React.lazy(() => import("./components/Service/FinancialChart"));
import StockChart from "./components/Service/StockChart";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div 
        style={{
          width: isSidebarOpen ? '250px' : '60px',
          height: '100vh',
          backgroundColor: '#1a1a1a',
          transition: 'all 0.3s ease',
          position: 'fixed',
          left: 0,
          top: 0,
          color: 'white',
          padding: '1rem',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.5rem'
            }}
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        {isSidebarOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="/" style={linkStyle}>Dashboard</a>
            <a href="/crypto" style={linkStyle}>Crypto</a>
            <a href="/commodities:" style={linkStyle}>Commodities:</a>
            <a href="/financialchart" style={linkStyle}>Financial Chart</a>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ 
        marginLeft: isSidebarOpen ? '250px' : '60px',
        flex: 1,
        transition: 'all 0.3s ease',
        width: '100%',
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
   <Route path='stock' element={
    <React.Suspense fallback={<div>Loading...</div>}>
      <StockChart />
    </React.Suspense>
  } />
   
    <Route path='financialchart' element={
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyFinancialChart />
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
  padding: '0.5rem',
  borderRadius: '4px',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
};

export default App;