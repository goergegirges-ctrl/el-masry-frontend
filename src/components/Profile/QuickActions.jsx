import React from 'react';
import { Package, Heart, MessageCircle, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfileComponents.css';

const QuickActions = ({ onSecurityClick }) => {
  const navigate = useNavigate();

  const handleSupportClick = () => {
    window.open('https://wa.me/201031451015', '_blank');
  };

  const actionCards = [
    {
      id: 'orders',
      title: 'My Orders',
      desc: 'Track your orders',
      icon: <Package size={32} />,
      onClick: () => navigate('/my-orders')
    },
    {
      id: 'wishlist',
      title: 'My Wishlist',
      desc: 'Saved items',
      icon: <Heart size={32} />,
      onClick: () => navigate('/wishlist')
    },
    {
      id: 'support',
      title: 'Contact Support',
      desc: 'WhatsApp support',
      icon: <MessageCircle size={32} />,
      onClick: handleSupportClick
    },
    {
      id: 'security',
      title: 'Account Security',
      desc: 'Change password',
      icon: <Shield size={32} />,
      onClick: onSecurityClick
    }
  ];

  return (
    <div className="quick-actions-grid">
      {actionCards.map((card) => (
        <div key={card.id} className="action-card" onClick={card.onClick}>
          <div className="card-left">
            <div className="icon-wrapper">{card.icon}</div>
            <div className="text-wrapper">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </div>
          <ChevronRight className="arrow-icon" size={20} />
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
