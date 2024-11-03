import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './NavBar.css';

const NavBar = ({ notifications = [], onNotificationClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

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
                    <IconButton
                        sx={{ color: 'white' }}
                        onClick={handleBellClick}
                        aria-label="notifications"
                    >
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
                                <MenuItem 
                                    key={notification._id} 
                                    onClick={() => {
                                        onNotificationClick(notification._id);
                                        handleClose();
                                    }}
                                >
                                    <div className="notf">
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {notification.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Priority: {notification.priority}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Status: {notification.status}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Due: {new Date(notification.dueDate).toLocaleDateString()}
                                        </Typography>
                                    </div>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleClose}>No new notifications</MenuItem>
                        )}
                    </Menu>
                </li>
                <li>
                    <button className="logout-button" onClick={handleLogout} aria-label="logout">
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
