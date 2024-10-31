import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';


const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Function to determine if a link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (

        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className={isActive('/') ? 'active-link' : 'nav-link'}>MyApp</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/" className={isActive('/') ? 'active-link' : 'nav-link'}>Home</Link>
                </li>
                <li>
                    <Link to="/about" className={isActive('/about') ? 'active-link' : 'nav-link'}>About</Link>
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
