import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserMarketAlerts.css'; // Optional: for styling

const UserMarketAlerts = ({ userId }) => {
    const [alerts, setAlerts] = useState([]);
    const [assetSymbol, setAssetSymbol] = useState('');
    const [threshold, setThreshold] = useState('');
    const [alertType, setAlertType] = useState('above');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch alerts for the user
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/market-alerts/${userId}`);
                setAlerts(response.data);
            } catch (error) {
                setError('Failed to fetch market alerts');
                console.error(error);
            }
        };

        fetchAlerts();
    }, [userId]);

    // Handle creating a new alert
    const handleCreateAlert = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/market-alerts', {
                userId,
                assetSymbol,
                threshold,
                alertType,
            });
            setAlerts([...alerts, response.data]); // Add the new alert to the list
            setAssetSymbol('');
            setThreshold('');
            setAlertType('above');
        } catch (error) {
            setError('Failed to create market alert');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-market-alerts">


            {/* Display the list of alerts */}
            <div className="alerts-list">
                <h3>Your Alerts</h3>
                {alerts.length === 0 ? (
                    <p>No alerts found.</p>
                ) : (
                    <ul>
                        {alerts.map((alert) => (
                            <li key={alert._id}>
                                <strong>{alert.assetSymbol}</strong>: Alert when price is {alert.alertType} {alert.threshold}
                                <br />
                                <small>Created at: {new Date(alert.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserMarketAlerts;