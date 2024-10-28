import React from 'react';
import styles from './About.module.css';

const About = () => {
    return (
        <div className={styles.container} style={{ padding: '20px' }}>
            <h1>About Us</h1>
            <p>
                Welcome to the Daily Data and Case Management Platform. Our mission is to provide
                efficient and effective solutions for managing daily data and cases. We strive to
                offer the best tools and resources to help you stay organized and productive.
            </p>
            <h2>Our Team</h2>
            <p>
                Our team is composed of experienced professionals dedicated to delivering high-quality
                software solutions. We are passionate about technology and committed to continuous
                improvement.
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
