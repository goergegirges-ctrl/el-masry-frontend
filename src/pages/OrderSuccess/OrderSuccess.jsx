import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';
import { useLanguage } from '../../context/LanguageContext';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId || "N/A";
    const { t } = useLanguage();

    return (
        <div className='order-success-container'>
            <div className="success-card">
                <div className="success-icon">✔️</div>
                <h1>{t('os_title')}</h1>
                <p>{t('os_thanks')}</p>
                <div className="order-details">
                    <p>{t('os_orderId')} <strong>{orderId}</strong></p>
                    <p>{t('os_confirmation')}</p>
                </div>
                <div className="success-actions">
                    <Link to="/profile" className="view-orders-btn">{t('os_viewOrders')}</Link>
                    <Link to="/" className="continue-btn">{t('os_continueShopping')}</Link>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess;
