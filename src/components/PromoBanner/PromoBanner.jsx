import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import './PromoBanner.css';

const PromoBanner = ({ title, titleAr, subtitle, ctaLabel = 'Shop Now', ctaPath = '/search' }) => {
    const navigate = useNavigate();

    return (
        <div className="promo-banner reveal-on-scroll">
            <div className="promo-icon">
                <Zap size={28} strokeWidth={1.75} />
            </div>
            <div className="promo-text">
                <p className="promo-title-ar">{titleAr || 'شحن مجاني عند الطلب فوق ٥٠٠ ج.م'}</p>
                <p className="promo-title-en">{title || 'Free delivery on orders over 500 EGP'}</p>
                {subtitle && <p className="promo-subtitle">{subtitle}</p>}
            </div>
            <button className="promo-cta" onClick={() => navigate(ctaPath)}>
                {ctaLabel}
            </button>
        </div>
    );
};

export default PromoBanner;
