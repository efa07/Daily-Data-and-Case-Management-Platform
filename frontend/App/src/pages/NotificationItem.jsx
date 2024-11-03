// src/components/NotificationItem.js

import React from 'react';

const NotificationItem = ({ notification }) => {
    return (
        <div className="notification-item">
            <p>{notification.message}</p>
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
        </div>
    );
};

export default NotificationItem;
