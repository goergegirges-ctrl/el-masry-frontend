import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url, token } = useContext(StoreContext);
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/order/userorders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    const foundOrder = response.data.data.find(o => o.id === id);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        toast.error("Order not found or access denied.");
                        navigate('/my-orders');
                    }
                } else {
                    toast.error("Failed to load order details.");
                    navigate('/my-orders');
                }
            } catch (err) {
                console.error("Error fetching order:", err);
                toast.error("Unable to securely fetch order.");
                navigate('/my-orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, token, url, navigate]);

    if (loading) {
        return (
            <div className="order-detail-container loading-state">
                <div className="spinner"></div>
                <p>Loading order details...</p>
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
        { label: 'Order Placed', matches: ['pending', 'processing', 'out for delivery', 'delivered', 'cancelled'] },
        { label: 'Confirmed', matches: ['processing', 'out for delivery', 'delivered'] },
        { label: 'Out for Delivery', matches: ['out for delivery', 'delivered'] },
        { label: 'Delivered', matches: ['delivered'] }
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
                &larr; Back to Orders
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
                            <h4>Shipping Address</h4>
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
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price} EGP</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity} EGP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="order-summary-block">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{order.subtotal} EGP</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>{order.deliveryFee !== null && order.deliveryFee !== undefined ? `${order.deliveryFee} EGP` : 'TBD'}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>{order.subtotal + (order.deliveryFee || 0)} EGP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
