import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>404</h1>
            <p style={styles.text}>Page Not Found</p>
            <Link to="/" style={styles.link}>Go to Home</Link>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
    },
    header: {
        fontSize: '6rem',
        margin: '0',
    },
    text: {
        fontSize: '1.5rem',
    },
    link: {
        marginTop: '1rem',
        fontSize: '1.2rem',
        color: '#007BFF',
        textDecoration: 'none',
    },
};

export default NotFound;