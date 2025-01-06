import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./MarketAlertForm.css";

const MarketAlertForm = ({ userId }) => {
    const [assetSymbol, setAssetSymbol] = useState('');
    const [threshold, setThreshold] = useState('');
    const [alertType, setAlertType] = useState('above');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const alertData = { userId, assetSymbol, threshold, alertType };

        try {
            const response = await fetch('http://localhost:5000/api/market-alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(alertData),
            });

            if (response.ok) {
                toast.success('Market alert created successfully!');
                setAssetSymbol('');
                setThreshold('');
                setAlertType('above');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create market alert');
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='mform'>
                <h3 className='mh3'>Set Market Alert</h3>
                {error && <div className="error-message">{error}</div>}
                <div>
                    <label>
                        Asset Symbol:
                        <input
                            type="text"
                            value={assetSymbol}
                            onChange={(e) => setAssetSymbol(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Threshold:
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Alert Type:
                        <select value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                            <option value="above">Above</option>
                            <option value="below">Below</option>
                        </select>
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Alert'}
                </button>
            </form>
            <ToastContainer />
        </>
    );
};

export default MarketAlertForm;