import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import './MyOrders.css';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        console.log("Fetching orders with token present:", !!token);
        try {
            const response = await axiosClient.get('/api/order/userorders');
            console.log("Orders response:", response.data);
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
                    setError("Session expired. Please login again.");
                    // In a real app, you would also clear token/user state here
                } else {
                    setError(err.response.data.message || `Server error: ${err.response.status}`);
                }
            } else if (err.request) {
                setError("Server not reachable. Please check your connection.");
            } else {
                setError("An unexpected error occurred.");
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
            <h2>My Orders</h2>
            
            {error && (
                <div className="error-banner">
                    <p>⚠️ {error}</p>
                    <button onClick={fetchOrders} className="retry-btn">Try again</button>
                </div>
            )}

            {loading ? (
                <div className="profile-loading-overlay">
                    <div className="spinner"></div>
                    <p>Loading orders...</p>
                </div>
            ) : (
                <div className="orders-list">
                    {!error && orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order.id} className="order-item">
                                <div className="order-head">
                                    <div className="order-info-group">
                                        <div>
                                            <p className="label">Order ID</p>
                                            <p className="val">#{order.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="label">Date</p>
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
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !error && (
                            <div className="no-orders-state">
                                <p>No active orders</p>
                                <button onClick={() => navigate("/")} className="shop-now-btn">Shop Now</button>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default MyOrders;
