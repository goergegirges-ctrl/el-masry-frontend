import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <button
            type="button"
            className="lang-switcher"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            aria-label={t('lang_switch')}
        >
            {language === 'ar' ? 'EN' : 'عربي'}
        </button>
    );
};

export default LanguageSwitcher;
