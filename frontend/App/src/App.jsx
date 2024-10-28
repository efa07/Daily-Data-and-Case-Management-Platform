import React from 'react';
import Home from "./pages/Home"
import NavBar from "./components/Nav/NavBar"
const LazyContact = React.lazy(() => import("./pages/Contact")) 
const LazyService = React.lazy(() => import("./pages/Service/Service"))
const LazyNotFound = React.lazy(() => import('./pages/NotFound')) ;
const LazyAbout = React.lazy(() => import('./pages/About'))
import Login from "./components/Login/Login"
import { Route, Routes } from 'react-router-dom';
const LazyFinancialChart = React.lazy(() => import ("./pages/Service/FinancialChart"))
function App() {
  return (
      <div className="App">
        <React.Suspense fallback={<div>Loading...</div>}>
          <NavBar />
        </React.Suspense>

        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='home' element={<Home />} />
          <Route path='/' element={<Home />} />
          <Route path='about' element={<React.Suspense fallback={<div>Loading...</div>}>
            <LazyAbout />
          </React.Suspense>} />
          <Route path='contact' element={<React.Suspense fallback={<div>Loading...</div>}>
            <LazyContact />
          </React.Suspense>} />
          <Route path='services' element={<React.Suspense fallback={<div>Loading...</div>}>
            <LazyService />

          </React.Suspense>} />

          <Route path="financialchart" element={<React.Suspense fallback={<div>Loding....</div>}>
          <LazyFinancialChart />
</React.Suspense>} />
          <Route path='*' element={<React.Suspense fallback={<div>Loading...</div>}>
            <LazyNotFound />
          </React.Suspense>} />
        </Routes>
      </div>
  );
}

export default App;
