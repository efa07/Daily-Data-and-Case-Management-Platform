import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Badge, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './NavBar.css';

const NavBar = ({ notifications }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    // Function to determine if a link is active
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBellClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const unreadCount = notifications.length;

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
                    <IconButton color="inherit" onClick={handleBellClick}>
                        <Badge badgeContent={unreadCount} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        keepMounted
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem key={notification.id} onClick={handleClose}>
                                    {notification.message}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleClose}>No new notifications</MenuItem>
                        )}
                    </Menu>
                </li>
                <li>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
