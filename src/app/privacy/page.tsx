import React from 'react';
import styles from '../page.module.css';

export default function PrivacyPolicy() {
    return (
        <main style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            <h1 style={{ color: '#1F3D2B', marginBottom: '2rem' }}>Privacy Policy</h1>
            <p>Last updated: December 23, 2025</p>

            <section style={{ marginTop: '2rem' }}>
                <h2>1. Introduction</h2>
                <p>Welcome to Umbrella Import & Export. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2>2. Data We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul>
                    <li><strong>Identity Data:</strong> includes first name, last name.</li>
                    <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                    <li><strong>Technical Data:</strong> includes internet protocol (IP) address, login data, browser type and version.</li>
                </ul>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2>3. How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul>
                    <li>To register you as a new customer.</li>
                    <li>To process and deliver your inquiries or orders.</li>
                    <li>To manage our relationship with you.</li>
                </ul>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2>4. Data Security</h2>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2>5. Contact Us</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: privacy@umbrellaimex.com</p>
            </section>
        </main>
    );
}
