import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();

    // Function to determine if a link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Handle logout functionality
    const handleLogout = () => {
        // Perform logout logic here (e.g., clearing session, redirecting)
        console.log("Logged out");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className={isActive('/') ? 'active-link' : 'nav-link'}>MyApp</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/" className={isActive('/home') ? 'active-link' : 'nav-link'}>Home</Link>
                </li>
                <li>
                    <Link to="/about" className={isActive('/about') ? 'active-link' : 'nav-link'}>About</Link>
                </li>
                <li>
                    <Link to="/services" className={isActive('/services') ? 'active-link' : 'nav-link'}>Services</Link>
                </li>
                <li>
                    <Link to="/contact" className={isActive('/contact') ? 'active-link' : 'nav-link'}>Contact</Link>
                </li>
                <li>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
