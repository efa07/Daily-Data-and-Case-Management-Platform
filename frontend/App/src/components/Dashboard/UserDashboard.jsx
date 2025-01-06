import React, { useState, useEffect } from 'react';
import FinancialChart from "../Service/ExchangeRateChart";
import { Grid, Box } from '@mui/material';
import './UserDashboard.css';
import BitcoinChart from "../Service/Bitcoin";
import CoffeeChart from '../Service/CoffeeChart';
import NotificationsList from '../../pages/NotificationsList';
import { toast, ToastContainer } from 'react-toastify';
import UserMarketAlerts from '../marketAlet/marketAlert';

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState([]);
  const [cases, setCases] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.userId : '';
  const username = user ? user.username : 'Guest'; 
  const userRole = user ? user.username : ''; 

  const marketData = {
    stocks: { total: 5000, change: '+2%' },
    commodities: { total: 2000, change: '+1%' },
    cryptocurrencies: { total: 1000, change: '+3%' },
  };

  useEffect(() => {
    const message = localStorage.getItem(user);
    if (message) {
        toast.success(message.username); // Show the success message
    }
  }, [user]);

  // Fetch case data from API when the component mounts
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('http://localhost:5000/api/cases', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };
  
    fetchCases();
  }, []);
  
  const handleSearch = () => {
    const filteredAssets = marketData.filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredCases = cases.filter(caseItem =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setAssets(filteredAssets);
    setCases(filteredCases);
  };

  return (
    <div className="user-dashboard">
      <h1>Welcome, {username}!</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for assets or cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="market-overview">
        <h2 className='mh2'>Market Overview</h2>
        <Grid container spacing={2}>

          <Grid item xs={12} sm={4}>
            <Box className="grid-item" padding={2} border={1} borderRadius={1} borderColor="grey.300">
              <FinancialChart />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box className="grid-item" padding={2} border={1} borderRadius={1} borderColor="grey.300">
              <CoffeeChart />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box className="grid-item" padding={2} border={1} borderRadius={1} borderColor="grey.300">
              <BitcoinChart />
            </Box>
          </Grid>

        </Grid>
      </div>

      {userRole === 'Analyst' && ( // Conditionally render the Case Overview section
        <div className="case-overview"
        onClick={() => window.location.href = '/casepage'}
        style={{ cursor: 'pointer' }}
        >
          <h2 className='mh2'>Case Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem._id}>
                  <td>{caseItem._id}</td>
                  <td>{caseItem.title}</td>
                  <td>{caseItem.status}</td>
                  <td>{caseItem.priority}</td>
                  <td>{new Date(caseItem.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="user-market-alerts">
        <h2>Market Alerts for User: {username}</h2>
        <UserMarketAlerts userId={userId} />
      </div>

      <div className='not'>
        <h1>Market Notification</h1>
        <NotificationsList userId={userId} />
      </div>


      <ToastContainer position='bottom' />
    </div>
  );
};

export default UserDashboard;
