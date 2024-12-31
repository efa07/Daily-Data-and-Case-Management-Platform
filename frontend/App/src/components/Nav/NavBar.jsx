import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconButton, Badge, Menu, MenuItem, Typography, Paper, Divider, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './NavBar.css';

const NavBar = ({ notifications = [], onNotificationClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const isActive = (path) => location.pathname === path;


    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.userId : '';
    const username = user ? user.username : 'Guest'; 
    const userRole = user ? user.username : ''; 


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
                        PaperProps={{
                            elevation: 3,
                            sx: { 
                                width: 300, 
                                maxHeight: 400, 
                                overflowY: 'auto', 
                                borderRadius: 2 
                            }
                        }}
                    >
                        {notifications.length > 0 && userRole === "Analyst" ? (
                            notifications.map((notification) => (
                                <MenuItem
                                    key={notification._id}
                                    onClick={() => {
                                        onNotificationClick(notification._id);
                                        handleClose();
                                    }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                        },
                                        padding: 2,
                                        alignItems: 'start',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {notification.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Priority: 
                                            {notification.priority === 'High' ? (
                                                <PriorityHighIcon fontSize="small" color="error" sx={{ ml: 0.5 }} />
                                            ) : (
                                                ' Normal'
                                            )}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Status: 
                                            {notification.status === 'Completed' ? (
                                                <CheckCircleIcon fontSize="small" color="success" sx={{ ml: 0.5 }} />
                                            ) : (
                                                ` ${notification.status}`
                                            )}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Due: {new Date(notification.dueDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem onClick={handleClose}>
                                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center' }}>
                                    No new notifications
                                </Typography>
                            </MenuItem>
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
