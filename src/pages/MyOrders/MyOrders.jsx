import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { Package } from 'lucide-react';
import './MyOrders.css';
import { useLanguage } from '../../context/LanguageContext';

const MyOrders = () => {
    const { token } = useContext(StoreContext);
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosClient.get('/api/order/userorders');
            if (response.data.success) {
                // Filter active statuses (case-insensitive)
                const activeOrders = response.data.data.filter(order => {
                    const status = (order.status || '').toLowerCase();
                    return !['delivered', 'cancelled'].includes(status);
                });
                setOrders(activeOrders);
            } else {
                setError(response.data.message || "Failed to load orders");
            }
        } catch (err) {
            console.error("Fetch orders error:", err);
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError(t('profile_sessionExpired'));
                } else {
                    setError(err.response.data.message || t('co_serverError'));
                }
            } else if (err.request) {
                setError(t('co_serverError'));
            } else {
                setError(t('co_serverError'));
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getBadgeClass = (status) => {
        if (!status) return '';
        const lower = status.toLowerCase();
        if (lower === 'pending') return 'badge-pending';
        if (lower === 'processing') return 'badge-processing';
        if (lower === 'out for delivery') return 'badge-out-for-delivery';
        return '';
    };

    return (
        <div className='my-orders-container'>
            <h2>{t('orders_title')}</h2>

            {error && (
                <div className="error-banner">
                    <p>⚠️ {error}</p>
                    <button onClick={fetchOrders} className="retry-btn">{t('orders_tryAgain')}</button>
                </div>
            )}

            {loading ? (
                <div className="profile-loading-overlay">
                    <div className="spinner"></div>
                    <p>{t('orders_loading')}</p>
                </div>
            ) : (
                <div className="orders-list">
                    {!error && orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order.id} className="order-item">
                                <div className="order-head">
                                    <div className="order-info-group">
                                        <div>
                                            <p className="label">{t('orders_orderId')}</p>
                                            <p className="val">#{order.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="label">{t('orders_date')}</p>
                                            <p className="val">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="order-action-group">
                                        <span className={`badge ${getBadgeClass(order.status)}`}>
                                            {order.status || 'Unknown'}
                                        </span>
                                        <button
                                            className="view-details-btn"
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                        >
                                            {t('orders_viewDetails')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !error && (
                            <div className="empty">
                                <div className="ring"><Package size={28} strokeWidth={1.75} /></div>
                                <h4>{t('orders_noOrders')}</h4>
                                <p>{t('orders_noOrdersMsg')}</p>
                                <button className="btn btn-primary md" onClick={() => navigate("/")}>{t('orders_shopNow')}</button>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default MyOrders;
