import React from 'react';
import './AuthLayout.css';
import logo from '../../assets/logo.png';
import { useLanguage } from '../../context/LanguageContext';

const AuthLayout = ({ children, title }) => {
    const { t } = useLanguage();
    return (
        <div className="auth-layout">
            <header className="auth-header-section">
                <div className="auth-logo-container">
                    <img src={logo} alt="El-Masry Logo" className="auth-logo" />
                    <p className="auth-tagline">{t('auth_tagline')}</p>
                </div>
            </header>

            <main className="auth-form-container">
                <div className="auth-card">
                    <div className="auth-titles">
                        <span className="auth-title-en">{title}</span>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
