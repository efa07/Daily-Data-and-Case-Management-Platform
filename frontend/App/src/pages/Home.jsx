import React from 'react';
import './Home.css'; // Make sure to add styling in a separate CSS file for a polished design

const Home = () => {
  return (
    <>
    <div className="home-container">

      <header className="hero-section">
        <div className="hero-content">
          <h1>Comprehensive Daily Data & Case Management Platform</h1>
          <p>
            Manage your investments, track market trends, and streamline case
            management with real-time and historical financial data.
          </p>
          <a href="#features" className="cta-button">Explore Features</a>
        </div>
      </header>
    
      <section id="features" className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Data Aggregation</h3>
            <p>
              Collect and display daily data for stocks, commodities, and
              cryptocurrencies from reliable APIs like Alpha Vantage and CoinGecko.
            </p>
          </div>
          <div className="feature-card">
            <h3>Case Management</h3>
            <p>
              Track and manage cases related to market analysis, investment
              decisions, and compliance issues.
            </p>
          </div>
          <div className="feature-card">
            <h3>Alerts & Notifications</h3>
            <p>
              Stay informed about significant market changes and updates on your
              cases through customizable alerts.
            </p>
          </div>
          <div className="feature-card">
            <h3>Reporting & Analytics</h3>
            <p>
              Generate custom reports and access historical data for deeper
              insights into market trends and case performance.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Get Started Today!</h2>
        <p>
          Join our platform now to streamline your investment tracking, case
          management, and market analysis.
        </p>
        <a href="/signup" className="cta-button">Sign Up</a>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Comprehensive Data & Case Management Platform</p>
      </footer>
    </div></>
  );
}

export default Home;
