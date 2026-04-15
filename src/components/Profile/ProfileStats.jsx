import React from 'react';
import './ProfileComponents.css';

const ProfileStats = ({ activeOrders, wishlistCount, firstName }) => {
  return (
    <div className="profile-stats-redesign">
      <div className="stat-card">
        <span className="stat-value">{activeOrders}</span>
        <span className="stat-label">Active Orders</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{wishlistCount}</span>
        <span className="stat-label">Wishlist</span>
      </div>
      <div className="stat-card member-card">
        <span className="stat-value">{firstName}</span>
        <span className="stat-label">Member</span>
      </div>
    </div>
  );
};

export default ProfileStats;
