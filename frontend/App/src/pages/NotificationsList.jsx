import React, { useEffect, useState } from 'react';
import NotificationItem from './NotificationItem';

const NotificationsList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/case-notifications/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else {
                    throw new Error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error(error);
                setError('Error fetching notifications'); // Set error state
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchNotifications();
    }, [userId]);

    return (
        <div>
            <h3>Notifications</h3>
            {loading ? (
                <p>Loading notifications...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (
                notifications.map((notification) => (
                    <NotificationItem key={notification._id} notification={notification} />
                ))
            )}
        </div>
    );
};

export default NotificationsList;
