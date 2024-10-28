import React, { useState } from 'react';
import FinancialChart from "../../pages/Service/FinancialChart"
import './UserDashboard.css';

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState([]); // This will hold market data
  const [cases, setCases] = useState([]);   // This will hold case data

  // Dummy data for demonstration purposes
  const marketData = {
    stocks: { total: 5000, change: '+2%' },
    commodities: { total: 2000, change: '+1%' },
    cryptocurrencies: { total: 1000, change: '+3%' },
  };

  const caseData = [
    { id: 1, name: 'Case A', status: 'Active', metrics: { priority: 'High', created: '2023-01-01' } },
    { id: 2, name: 'Case B', status: 'In Progress', metrics: { priority: 'Medium', created: '2023-02-01' } },
    // Add more cases as needed
  ];

  const handleSearch = () => {
    // Implement search logic here
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
        <ul>
          <li><div className='market-fina'>
      <FinancialChart />

      </div></li>
          <li>Commodities: {marketData.commodities.total} ({marketData.commodities.change})</li>
          <li>Cryptocurrencies: {marketData.cryptocurrencies.total} ({marketData.cryptocurrencies.change})</li>
        </ul>
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
