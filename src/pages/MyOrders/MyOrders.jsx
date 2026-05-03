import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import './MyOrders.css';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_STEPS = [
    { key: 'placed',    labelKey: 'od_placed' },
    { key: 'confirmed', labelKey: 'od_confirmed' },
    { key: 'shipped',   labelKey: 'od_outForDelivery' },
    { key: 'delivered', labelKey: 'od_delivered' },
];

const normalizeStatus = (status) =>
    (status || '').toLowerCase().replace(/[\s_-]+/g, '');

const getStepIndex = (status) => {
    const s = normalizeStatus(status);
    if (s === 'delivered') return 3;
    if (['shipped', 'outfordelivery'].includes(s)) return 2;
    if (['confirmed', 'processing'].includes(s)) return 1;
    return 0;
};

const getStatusBadgeClass = (status) => {
    const s = normalizeStatus(status);
    if (s === 'delivered') return 'badge-delivered';
    if (s === 'cancelled') return 'badge-cancelled';
    if (['shipped', 'outfordelivery'].includes(s)) return 'badge-shipped';
    if (['confirmed', 'processing'].includes(s)) return 'badge-confirmed';
    return 'badge-pending';
};

const getStatusLabel = (status, t) => {
    const s = normalizeStatus(status);
    const map = {
        pending:        t('orders_status_pending'),
        processing:     t('orders_status_processing'),
        confirmed:      t('orders_status_confirmed'),
        shipped:        t('orders_status_shipped'),
        outfordelivery: t('orders_status_outForDelivery'),
        delivered:      t('orders_status_delivered'),
        cancelled:      t('orders_status_cancelled'),
    };
    return map[s] || status;
};

const OrderTimeline = ({ status, t }) => {
    const currentStep = getStepIndex(status);
    return (
        <div className="order-timeline-mini" role="list" aria-label="order progress">
            {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                    <React.Fragment key={step.key}>
                        <div
                            className={`step-mini${isDone ? ' done' : ''}${isCurrent ? ' active' : ''}`}
                            role="listitem"
                        >
                            <div className="step-dot-mini">
                                {isDone && <span aria-hidden="true">✓</span>}
                            </div>
                            <span className="step-label-mini">{t(step.labelKey)}</span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                            <div className={`step-line-mini${i < currentStep ? ' done' : ''}`} aria-hidden="true" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const MyOrders = () => {
    const { token } = useContext(StoreContext);
    const { t, language } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosClient.get('/api/order/userorders');
            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                setError(response.data.message || t('co_serverError'));
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError(t('profile_sessionExpired'));
            } else {
                setError(t('co_serverError'));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString(
            language === 'ar' ? 'ar-EG' : 'en-GB',
            { day: '2-digit', month: 'short', year: 'numeric' }
        );
    };

    const getItemCount = (items) =>
        Array.isArray(items) ? items.reduce((s, i) => s + (i.quantity || 1), 0) : 0;

    const currencyStr = language === 'ar' ? 'ج.م' : 'EGP';

    return (
        <div className="my-orders-page">
            <div className="mo-page-header">
                <h1>{t('orders_title')}</h1>
                {!loading && !error && orders.length > 0 && (
                    <span className="mo-count-chip">{orders.length}</span>
                )}
            </div>

            {error && (
                <div className="mo-error-banner">
                    <span>⚠ {error}</span>
                    <button className="mo-retry-btn" onClick={fetchOrders}>
                        {t('orders_tryAgain')}
                    </button>
                </div>
            )}

            {loading ? (
                <div className="mo-loading">
                    <div className="spinner" />
                    <p>{t('orders_loading')}</p>
                </div>
            ) : !error && orders.length === 0 ? (
                <div className="mo-empty">
                    <div className="mo-empty-icon">
                        <ShoppingBag size={48} strokeWidth={1.25} />
                    </div>
                    <h3>{t('orders_noOrders')}</h3>
                    <p>{t('orders_noOrdersMsg')}</p>
                    <button className="mo-shop-btn" onClick={() => navigate('/')}>
                        {t('orders_shopNow')}
                    </button>
                </div>
            ) : (
                <div className="mo-list">
                    {orders.map(order => {
                        const isOpen = !!expanded[order.id];
                        const itemCount = getItemCount(order.items);
                        const subtotal = Number(order.subtotal) || 0;
                        const deliveryFee = Number(order.deliveryFee) || 0;
                        const total = subtotal + deliveryFee;
                        const isCancelled = normalizeStatus(order.status) === 'cancelled';

                        return (
                            <article key={order.id} className={`mo-card${isOpen ? ' is-open' : ''}`}>
                                <button
                                    className="mo-card-header"
                                    onClick={() => toggleExpand(order.id)}
                                    aria-expanded={isOpen}
                                >
                                    <div className="mo-meta-grid">
                                        <div className="mo-meta-cell">
                                            <span className="mo-meta-label">{t('orders_orderId')}</span>
                                            <span className="mo-order-id">#{order.id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="mo-meta-cell">
                                            <span className="mo-meta-label">{t('orders_date')}</span>
                                            <span className="mo-meta-val">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="mo-meta-cell mo-hide-xs">
                                            <span className="mo-meta-label">{t('orders_items')}</span>
                                            <span className="mo-meta-val">{itemCount}</span>
                                        </div>
                                        <div className="mo-meta-cell">
                                            <span className="mo-meta-label">{t('orders_total')}</span>
                                            <span className="mo-total-val">{total.toLocaleString()} {currencyStr}</span>
                                        </div>
                                    </div>
                                    <div className="mo-card-right">
                                        <span className={`mo-badge ${getStatusBadgeClass(order.status)}`}>
                                            {getStatusLabel(order.status, t)}
                                        </span>
                                        <span className="mo-expand-icon" aria-hidden="true">
                                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </span>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="mo-card-body">
                                        {isCancelled ? (
                                            <div className="mo-cancelled-banner">
                                                ✕ {t('orders_status_cancelled')}
                                            </div>
                                        ) : (
                                            <OrderTimeline status={order.status} t={t} />
                                        )}

                                        {Array.isArray(order.items) && order.items.length > 0 && (
                                            <div className="mo-items-section">
                                                <p className="mo-section-title">{t('orders_product')}</p>
                                                <div className="mo-items-list">
                                                    {order.items.map((item, idx) => {
                                                        const imgUrl = Array.isArray(item.images)
                                                            ? item.images[0]
                                                            : (item.image || null);
                                                        const lineTotal = (item.quantity || 1) * Number(item.price || 0);
                                                        return (
                                                            <div key={idx} className="mo-line-item">
                                                                <div className="mo-item-thumb">
                                                                    {imgUrl ? (
                                                                        <img src={imgUrl} alt={item.name} loading="lazy" />
                                                                    ) : (
                                                                        <div className="mo-thumb-placeholder">
                                                                            <Package size={16} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mo-item-info">
                                                                    <p className="mo-item-name">{item.name}</p>
                                                                    <p className="mo-item-subline">
                                                                        {item.quantity || 1} × {Number(item.price || 0).toLocaleString()} {currencyStr}
                                                                    </p>
                                                                </div>
                                                                <div className="mo-item-total">
                                                                    {lineTotal.toLocaleString()} {currencyStr}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mo-order-summary">
                                            <div className="mo-summary-row">
                                                <span>{t('orders_subtotal')}</span>
                                                <span>{subtotal.toLocaleString()} {currencyStr}</span>
                                            </div>
                                            <div className="mo-summary-row">
                                                <span>{t('orders_deliveryFee')}</span>
                                                <span>
                                                    {deliveryFee > 0
                                                        ? `${deliveryFee.toLocaleString()} ${currencyStr}`
                                                        : t('orders_deliveryTbd')}
                                                </span>
                                            </div>
                                            <div className="mo-summary-row mo-summary-total">
                                                <span>{t('orders_total')}</span>
                                                <span>{total.toLocaleString()} {currencyStr}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
