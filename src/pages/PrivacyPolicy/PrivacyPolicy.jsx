import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container section-padding">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last Updated: March 2026</p>

            <section>
                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you create an account, make a purchase, or contact us. This includes:</p>
                <ul>
                    <li>Name, email address, and phone number.</li>
                    <li>Shipping and billing addresses.</li>
                    <li>Payment information (processed securely through our payment providers).</li>
                    <li>Wishlist data and product preferences.</li>
                </ul>
            </section>

            <section>
                <h2>2. How We Use Your Information</h2>
                <p>El-Masry Electronics uses your data to:</p>
                <ul>
                    <li>Process and fulfill your orders.</li>
                    <li>Maintain your account and wishlist.</li>
                    <li>Send transaction notifications and customer support responses.</li>
                    <li>Analyze shopping patterns to improve our product selection and website experience.</li>
                    <li>Prevent fraudulent transactions and ensure site security.</li>
                </ul>
            </section>

            <section>
                <h2>3. Data Sharing</h2>
                <p>We do not sell your personal data. We share information only with:</p>
                <ul>
                    <li>Service providers (shipping companies, payment processors).</li>
                    <li>Legal authorities if required by Egyptian law or to protect our rights.</li>
                </ul>
            </section>

            <section>
                <h2>4. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal information through your account profile. You may also contact us to request data deletion.</p>
            </section>

            <section>
                <h2>5. Data Retention</h2>
                <p>We retain your information for as long as your account is active or as needed to provide you services and comply with legal obligations.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
