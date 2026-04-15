import React from 'react';
import './AuthLayout.css';
import logo from '../../assets/logo.png';

const AuthLayout = ({ children, titleAr, titleEn }) => {
    return (
        <div className="auth-layout">
            <header className="auth-header-section">
                <div className="auth-logo-container">
                    <img src={logo} alt="El-Masry Logo" className="auth-logo" />
                    <p className="auth-tagline">Electronics & Screen Spare Parts</p>
                </div>
            </header>
            
            <main className="auth-form-container">
                <div className="auth-card">
                    <div className="auth-titles">
                        <span className="auth-title-ar">{titleAr}</span>
                        <span className="auth-title-en">{titleEn}</span>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
