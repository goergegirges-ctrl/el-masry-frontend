import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const orderId = location.state?.orderId || "N/A";

    return (
        <div className='order-success-container'>
            <div className="success-card">
                <div className="success-icon">✔️</div>
                <h1>Order Placed!</h1>
                <p>Thank you for shopping with El-Masry Electronics.</p>
                <div className="order-details">
                    <p>Order ID: <strong>{orderId}</strong></p>
                    <p>A confirmation email will be sent shortly.</p>
                </div>
                <div className="success-actions">
                    <Link to="/profile" className="view-orders-btn">View My Orders</Link>
                    <Link to="/" className="continue-btn">Continue Shopping</Link>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess;
