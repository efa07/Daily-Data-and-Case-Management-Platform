import React, { useState } from 'react';
import FinancialChart from "../Service/FinancialChart";
import { Grid, Box } from '@mui/material';
import './UserDashboard.css';
  import BitcoinChart from "../Service/Bitcoin";
import StockChart from '../Service/StockChart';

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState([]);
  const [cases, setCases] = useState([]);

  const marketData = {
    stocks: { total: 5000, change: '+2%' },
    commodities: { total: 2000, change: '+1%' },
    cryptocurrencies: { total: 1000, change: '+3%' },
  };

  const caseData = [
    { id: 1, name: 'Case A', status: 'Active', metrics: { priority: 'High', created: '2023-01-01' } },
    { id: 2, name: 'Case B', status: 'In Progress', metrics: { priority: 'Medium', created: '2023-02-01' } },
  ];

  const handleSearch = () => {
    const filteredAssets = marketData.filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredCases = caseData.filter(caseItem =>
      caseItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setAssets(filteredAssets);
    setCases(filteredCases);
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
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
  <h2>Market Overview</h2>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4}>
      <Box className="grid-item" padding={2} border={1} borderRadius={1} borderColor="grey.300">
        <FinancialChart />

      </Box>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Box className="grid-item" padding={2} border={1} borderRadius={1} borderColor="grey.300">
        <h3>Commodities</h3>

        <StockChart />
        </Box>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Box className="grid-item" padding={2} border={1} borderRadius={1} borderColor="grey.300">
        <h3>Cryptocurrencies</h3>
        <BitcoinChart />
      </Box>
    </Grid>
  </Grid>
</div>


      <div className="case-overview">
        <h2>Case Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {caseData.map((caseItem) => (
              <tr key={caseItem.id}>
                <td>{caseItem.id}</td>
                <td>{caseItem.name}</td>
                <td>{caseItem.status}</td>
                <td>{caseItem.metrics.priority}</td>
                <td>{caseItem.metrics.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
