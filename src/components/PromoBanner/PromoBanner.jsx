import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './PromoBanner.css';

const PromoBanner = ({ ctaPath = '/search' }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="promo-banner reveal-on-scroll">
            <div className="promo-icon">
                <Zap size={28} strokeWidth={1.75} />
            </div>
            <div className="promo-text">
                <p className="promo-title">{t('promo_title')}</p>
            </div>
            <button className="promo-cta" onClick={() => navigate(ctaPath)}>
                {t('promo_cta')}
            </button>
        </div>
    );
};

export default PromoBanner;
