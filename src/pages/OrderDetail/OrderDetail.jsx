import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { ChevronLeft } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import './OrderDetail.css';
import { useLanguage } from '../../context/LanguageContext';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(StoreContext);
    const { t } = useLanguage();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await axiosClient.get('/api/order/userorders');

                if (response.data.success) {
                    const foundOrder = response.data.data.find(o => o.id === id);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        toast.error(t('od_orderNotFound'));
                        navigate('/my-orders');
                    }
                } else {
                    toast.error(t('co_serverError'));
                    navigate('/my-orders');
                }
            } catch (err) {
                console.error("Error fetching order:", err);
                toast.error(t('co_serverError'));
                navigate('/my-orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, token, navigate]);

    if (loading) {
        return (
            <div className="order-detail-container loading-state">
                <div className="spinner"></div>
                <p>{t('od_loading')}</p>
            </div>
        );
    }

    if (!order) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const getBadgeClass = (status) => {
        if (!status) return '';
        const lower = status.toLowerCase();
        if (lower === 'pending') return 'badge-pending';
        if (lower === 'processing') return 'badge-processing';
        if (lower === 'out for delivery') return 'badge-out-for-delivery';
        if (lower === 'delivered') return 'badge-delivered';
        if (lower === 'cancelled') return 'badge-cancelled';
        return '';
    };

    // Timeline logic
    const timelineSteps = [
        { label: t('od_placed'), matches: ['pending', 'processing', 'out for delivery', 'delivered', 'cancelled'] },
        { label: t('od_confirmed'), matches: ['processing', 'out for delivery', 'delivered'] },
        { label: t('od_outForDelivery'), matches: ['out for delivery', 'delivered'] },
        { label: t('od_delivered'), matches: ['delivered'] }
    ];

    const currentStatusLower = (order.status || '').toLowerCase();
    
    // Find the highest step index we've reached
    let currentStepIndex = -1;
    if (currentStatusLower === 'cancelled') {
        currentStepIndex = 0; // If cancelled, we only highlight "Placed"
    } else {
        for (let i = timelineSteps.length - 1; i >= 0; i--) {
            if (timelineSteps[i].matches.includes(currentStatusLower)) {
                currentStepIndex = i;
                break;
            }
        }
    }

    return (
        <div className="order-detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft size={16} aria-hidden="true" />{t('od_back')}
            </button>

            <div className="order-detail-card">
                {/* Header */}
                <div className="detail-header">
                    <div className="header-top">
                        <div className="header-info">
                            <h2>Order #{order.id.slice(-8).toUpperCase()}</h2>
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <span className={`badge ${getBadgeClass(order.status)}`}>
                            {order.status || 'Unknown'}
                        </span>
                    </div>
                    {order.shippingAddress && (
                        <div className="shipping-address">
                            <h4>{t('od_shippingAddress')}</h4>
                            <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div className="order-timeline">
                    {timelineSteps.map((step, index) => {
                        const isCompleted = currentStepIndex >= index;
                        const isCurrent = currentStepIndex === index && currentStatusLower !== 'cancelled';
                        const isCancelled = currentStatusLower === 'cancelled' && index === 0;

                        let classNames = "timeline-step";
                        if (isCompleted || isCancelled) classNames += " completed";
                        if (isCurrent) classNames += " current";
                        if (currentStatusLower === 'cancelled') classNames += " is-cancelled";

                        return (
                            <div key={index} className={classNames}>
                                <div className="step-circle"></div>
                                <span className="step-label">{step.label}</span>
                                {index < timelineSteps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        );
                    })}
                </div>

                {/* Items Table */}
                <div className="products-table-wrapper">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>{t('od_colProduct')}</th>
                                <th>{t('od_colPrice')}</th>
                                <th>{t('od_colQty')}</th>
                                <th>{t('od_colSubtotal')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td>{item.price} ج.م</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity} ج.م</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="order-summary-block">
                    <div className="summary-row">
                        <span>{t('od_subtotal')}</span>
                        <span>{order.subtotal} ج.م</span>
                    </div>
                    <div className="summary-row">
                        <span>{t('od_delivery')}</span>
                        <span>{order.deliveryFee !== null && order.deliveryFee !== undefined ? `${order.deliveryFee} ج.م` : t('od_tbd')}</span>
                    </div>
                    <div className="summary-row total">
                        <span>{t('od_total')}</span>
                        <span>{order.subtotal + (order.deliveryFee || 0)} ج.م</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
