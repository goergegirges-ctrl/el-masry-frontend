import React from 'react';
import './ProfileComponents.css';
import { useLanguage } from '../../context/LanguageContext';

const ProfileStats = ({ activeOrders, wishlistCount }) => {
  const { t } = useLanguage();
  return (
    <div className="profile-stats-redesign">
      <div className="stat-card">
        <span className="stat-value">{activeOrders}</span>
        <span className="stat-label">{t('profile_activeOrders')}</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{wishlistCount}</span>
        <span className="stat-label">{t('profile_wishlist')}</span>
      </div>
    </div>
  );
};

export default ProfileStats;
