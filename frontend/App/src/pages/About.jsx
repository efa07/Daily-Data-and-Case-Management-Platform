import React from 'react';
import styles from './About.module.css';

const About = () => {
    return (
        <div className={styles.container} style={{ padding: '20px' }}>
            <h1>About Us</h1>
            <p>
                Welcome to the Currency Exchange Rate Service! Our service provides the latest exchange rates for various currencies. You can use our service to get the current exchange rate between two currencies, as well as historical exchange rate data.
            </p>
            <h2>Our Team</h2>
            <p>
                I am Efa Tariku, a full-stack developer and Medical Lab student with a passion for creating innovative
            </p>
            <h2>Contact Us</h2>
            <p>
                If you have any questions or feedback, please feel free to reach out to us at
                <a href="mailto:efatariku07@gmail.com"> efatariku07@gmail.com</a>.
            </p>
        </div>
    );
};

export default About;
